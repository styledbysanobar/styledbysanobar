"use client";

import { useEffect, useRef, useState } from "react";

import { trackCustom, WEDDING_OFFER, weddingLeadEventId } from "../../lib/fbq";

/* Sanobar's wedding event type in Cal.com. Its slug (after the slash)
   must equal WEDDING_CAL_SLUG in app/api/webhooks/cal/route.ts, which is how the
   server tells a wedding booking apart and sends WeddingLead instead of Lead. */
const WEDDING_CAL_LINK = "sanobar-samir-fiqx39/wedding-style-upgrade";
const NS = "wedding-style-upgrade";
const MOUNT_ID = "wl-cal-inline";

export default function WeddingCalEmbed() {
  const [ready, setReady] = useState(false);
  const booked = useRef<Set<string>>(new Set());

  useEffect(() => {
    /* eslint-disable */
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api: any = function () { p(api, arguments); };
          const namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    /* eslint-enable */

    const Cal = (window as any).Cal;
    Cal("init", NS, { origin: "https://app.cal.com" });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
    Cal.ns[NS]("inline", {
      elementOrSelector: `#${MOUNT_ID}`,
      config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
      calLink: WEDDING_CAL_LINK,
    });
    Cal.ns[NS]("ui", { hideEventTypeDetails: false, layout: "month_view" });
    Cal.ns[NS]("on", { action: "linkReady", callback: () => setReady(true) });

    /* Same dedup as the Instant Image booking: the Cal webhook sends the server
       copy with the same cal_wedding_lead_<uid> id. Both Cal events are
       subscribed and the second is dropped by uid. */
    const fireLead = (e: any) => {
      const d = e?.detail?.data ?? {};
      const uid: string | undefined = d?.uid ?? d?.booking?.uid;
      if (uid) {
        if (booked.current.has(uid)) return;
        booked.current.add(uid);
      }
      trackCustom("WeddingLead", { ...WEDDING_OFFER }, uid ? weddingLeadEventId(uid) : undefined);
    };
    Cal.ns[NS]("on", { action: "bookingSuccessfulV2", callback: fireLead });
    Cal.ns[NS]("on", { action: "bookingSuccessful", callback: fireLead });

    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="wb-cal">
      {!ready && (
        <span className="wb-cal-loading" aria-hidden="true">
          Opening the calendar
        </span>
      )}
      <div id={MOUNT_ID} className="wb-cal-inline" />
    </div>
  );
}
