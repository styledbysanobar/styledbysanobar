const Flower = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden="true">
    {Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={i} cx="10" cy="5.2" rx="2.4" ry="4.2" transform={`rotate(${i * 60} 10 10)`} />
    ))}
    <circle cx="10" cy="10" r="1.6" fill="currentColor" />
  </svg>
);

/* Parked 4 Oct 2026 (Atul: "remove for now, remember it if I ask to put it back").
   To restore: import RewearBand in page.tsx and render <RewearBand /> as the last
   child of the "What happens in the Dulha Edit" section. Styles (.wl-rw*) are
   still in wedding.css and the two images are still in /images/wedding. */
export default function RewearBand() {
  return (
      <div className="wl-rw">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-rw-img" src="/images/wedding/ed-rewear-l.webp" alt="" width={360} height={240} loading="lazy" />
        <div className="wl-rw-title">
          <p className="wl-rw-eyebrow">
            <Flower className="wl-eyebrow-flower" />
            After the wedding
          </p>
          <h3>Your Rewear Plan</h3>
        </div>
        <p className="wl-rw-text">Turn your wedding wardrobe into looks for Diwali, other weddings &amp; formal events.</p>
        <p className="wl-rw-credit">
          <strong>+ ₹15,000 credit</strong>
          <span>towards the Instant Image Upgrade when booked within 60 days.</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="wl-rw-img" src="/images/wedding/ed-rewear-r.webp" alt="" width={360} height={240} loading="lazy" />
      </div>
  );
}
