import type { Metadata } from "next";
import Quiz from "./Quiz";

export const metadata: Metadata = { title: "Begin · The Instant Image Upgrade" };

/* The fitting-room dim from the entry page lands here: the quiz opens on the same
   near-black stage. Intake (gender fork) -> 7 questions -> computes the four
   outputs (Presence Score, Current/Goal Image Type, Body Shape) and hands off to
   /result. Full spec: /workspace/sanobar-landing-page/sanobar-funnel-spec.md. */
export default function QuizPage() {
  return <Quiz />;
}
