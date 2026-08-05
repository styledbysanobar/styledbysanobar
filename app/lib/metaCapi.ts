import crypto from "node:crypto";

/* Shared server-side Meta Conversions API helper.

   The Cal.com webhook (app/api/webhooks/cal/route.ts) sends the Lead event for a
   booked consultation. This helper is used by the Razorpay webhook to send the
   Purchase event for the paid slot. Both land on the SAME pixel, so Events
   Manager shows one funnel: Purchase (paid) then Lead (booked).

   Same shape as the TGO-Marketing funnels: PII lowercased, trimmed and SHA-256
   hashed before it ever leaves the server, one event_id per conversion so a
   duplicate delivery collapses instead of double counting. */

const GRAPH_VERSION = "v21.0";

/* Kept in sync with OFFER in app/lib/fbq.ts and the Cal webhook. */
export const OFFER = {
  content_name: "Instant Image Upgrade consultation",
  content_category: "booking",
} as const;

/** Meta requires every PII field lowercased, trimmed, then SHA-256 hex. */
export function hash(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return crypto.createHash("sha256").update(normalised).digest("hex");
}

/** Phone numbers hash digits-only, country code included, no + or spaces. */
export function hashPhone(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, "");
  if (!digits) return undefined;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export interface CapiPerson {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  countryCode?: string;
  /* Meta click and browser ids, snapshotted at order time. These are the two
     signals that let Meta attribute a server event back to an ad click, so they
     matter more to match quality than anything else here. */
  fbc?: string;
  fbp?: string;
  clientIp?: string;
  clientUserAgent?: string;
}

/** Build the hashed user_data block, dropping anything we do not actually have.
 *  Meta rejects null members, so absent keys are removed rather than sent empty. */
export function buildUserData(p: CapiPerson): Record<string, unknown> {
  const externalId = p.email ? hash(p.email) : undefined;
  const userData: Record<string, unknown> = {
    em: hash(p.email),
    ph: hashPhone(p.phone),
    fn: hash(p.firstName),
    ln: hash(p.lastName),
    ct: p.city ? hash(p.city.replace(/[^a-zA-Z]/g, "")) : undefined,
    country: hash(p.countryCode),
    external_id: externalId,
    fbc: p.fbc || undefined,
    fbp: p.fbp || undefined,
    client_ip_address: p.clientIp || undefined,
    client_user_agent: p.clientUserAgent || undefined,
  };
  for (const key of Object.keys(userData)) {
    if (userData[key] === undefined) delete userData[key];
  }
  return userData;
}

export interface CapiEventInput {
  eventName: string;
  /** Shared dedup key. Same string for any duplicate send of this conversion. */
  eventId: string;
  eventTimeMs?: number;
  eventSourceUrl?: string;
  person: CapiPerson;
  customData?: Record<string, unknown>;
}

/** POST one event to the Conversions API. Throws only on a network failure, so
 *  callers can log and still return 200 to whoever called the webhook. */
export async function sendCapiEvent(input: CapiEventInput) {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    return { ok: false as const, skipped: "not configured" };
  }

  const customData = { ...(input.customData ?? {}) };
  for (const key of Object.keys(customData)) {
    if (customData[key] === undefined) delete customData[key];
  }

  const event = {
    event_name: input.eventName,
    /* Seconds. Meta rejects anything older than 7 days or in the future. */
    event_time: Math.floor((input.eventTimeMs ?? Date.now()) / 1000),
    event_id: input.eventId,
    action_source: "website",
    event_source_url: input.eventSourceUrl,
    user_data: buildUserData(input.person),
    custom_data: customData,
  };

  const body: Record<string, unknown> = { data: [event] };
  if (process.env.META_CAPI_TEST_EVENT_CODE) {
    body.test_event_code = process.env.META_CAPI_TEST_EVENT_CODE;
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const result = await res.json().catch(() => ({}));
  return { ok: res.ok as boolean, status: res.status, result };
}

/** The shared dedup key for a paid slot. Derived from the Razorpay payment id
 *  and nothing else, so any resend of the same payment collapses into one. */
export function purchaseEventId(paymentId: string) {
  return `rzp_purchase_${paymentId}`;
}
