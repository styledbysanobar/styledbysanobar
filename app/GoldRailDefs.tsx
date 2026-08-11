/* Shared SVG defs: the icon gradient, and the mono-ivory logo filter. Rendered
   zero-size and hidden from a11y; paints nothing itself. Stops read the palette
   tokens, so a change to the golds carries through the icons automatically.

   Lives here rather than inside the entry page because #goldRail has to be in
   the DOM of EVERY route that lights a glyph on it. A url(#id) reference only
   resolves against the current document, so /checkout needs its own copy in the
   tree. One definition, imported by each page, keeps the funnel and the fee page
   on the same diagonal. */
const GoldRailDefs = () => (
  <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
    <defs>
      {/* Turns any client logo into a single-ink ivory lockup, the way a brand kit
          does it, WITHOUT flattening it. brightness becomes transparency: the dark
          and mid parts of a mark become solid ivory, anything already white drops
          to nothing. So Parachute's blue field renders as an ivory badge with its
          white script punched out as holes, instead of the solid blob a plain
          brightness(0) invert(1) produced. Steps: read luminance into alpha,
          invert it, clip back to the artwork's own alpha so the transparent
          background stays transparent, then flood the result with ivory.
          color-interpolation-filters must be sRGB; the linearRGB default skews
          mid-tones badly. */}
      <filter id="monoIvory" colorInterpolationFilters="sRGB">
        <feColorMatrix type="luminanceToAlpha" result="lum" />
        <feComponentTransfer in="lum" result="inv">
          <feFuncA type="table" tableValues="1 0.97 0.88 0.55 0" />
        </feComponentTransfer>
        <feComposite in="inv" in2="SourceGraphic" operator="in" result="masked" />
        <feFlood floodColor="#F3E9DC" result="ink" />
        <feComposite in="ink" in2="masked" operator="in" />
      </filter>
      <linearGradient id="goldRail" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--gold-edge)" />
        <stop offset="20%" stopColor="var(--gold-soft)" />
        <stop offset="50%" stopColor="var(--gold-bright)" />
        <stop offset="80%" stopColor="var(--gold-soft)" />
        <stop offset="100%" stopColor="var(--gold-edge)" />
      </linearGradient>
    </defs>
  </svg>
);

export default GoldRailDefs;
