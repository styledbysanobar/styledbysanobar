import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Presence Consultation · Sanobar Samir",
  description:
    "You earned your success. People still cannot see it on you. A private, one-to-one Presence Consultation with celebrity stylist Sanobar Samir, so how people see you finally matches what you have built.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/*
          The luxury-house model (Chanel / Vogue / Celine): a Didone WORDMARK on top
          + ONE neo-grotesque doing everything else, hierarchy from case + tracking +
          weight + scale (not a second body font).
            Wordmark (masthead "Sanobar Samir" only) = Bodoni Moda (the Didone)
            Everything else (titles, body, labels)   = Jost (the Futura, one geometric)
          LICENSED UPGRADE: drop real Futura .woff2 in /public/fonts, @font-face in
          styles.css, repoint --f-display/body.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400..700&family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
