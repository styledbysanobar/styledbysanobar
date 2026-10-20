import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Campaign attribution, captured on the FIRST page a visitor opens.

   Ads land on / or /dulha-edit, and the CTAs there link to a bare /checkout,
   so by the time the checkout reads its own URL the fbclid and UTMs are gone.
   This saves them into a first-party cookie on the page request itself, before
   any JS runs, and create-order reads the cookie back into the Razorpay notes.

   A visit that carries ANY of the keys replaces the whole set, so the notes
   always describe one click rather than a mix of two campaigns. A visit with
   none of them leaves the cookie alone. */

/* Read back by name in app/api/razorpay/create-order/route.ts. */
const ATTR_COOKIE = "ss_attr";
const KEYS = ["fbclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const MAX = 200;
const TTL_SECONDS = 30 * 24 * 60 * 60;

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  try {
    const q = req.nextUrl.searchParams;
    if (!KEYS.some((k) => q.get(k))) return res;

    const attr: Record<string, string> = {};
    for (const k of KEYS) attr[k] = (q.get(k) ?? "").slice(0, MAX);

    /* Raw JSON: Next encodes the value once on the way out, and create-order
       decodes it once on the way in. */
    res.cookies.set(ATTR_COOKIE, JSON.stringify(attr), {
      path: "/",
      maxAge: TTL_SECONDS,
      sameSite: "lax",
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
    });
  } catch {
    /* Attribution is best-effort and must never break a page render. */
  }

  return res;
}

/* Page navigations only: API routes, Next internals and static files are not
   visits. */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
