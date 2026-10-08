import { Playfair_Display } from "next/font/google";

export const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--wl-display",
  display: "swap",
});
