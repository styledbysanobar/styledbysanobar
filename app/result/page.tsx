import type { Metadata } from "next";
import Result from "./Result";

export const metadata: Metadata = { title: "Your read · The Instant Image Upgrade" };

/* The money page (Model B): diagnosis shown, prescription gated behind the free
   call. Built from result-page-copy-v2.md, wired to the quiz outputs via
   resultData.buildView(). Pending real assets are stubbed and flagged inline. */
export default function ResultRoute() {
  return <Result />;
}
