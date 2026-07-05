"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QUESTIONS,
  visibleOptions,
  optSub,
  scoreQuiz,
  type Gender,
  type Answers,
  type Intake,
} from "./quizData";

const AGES = ["Under 25", "25 to 34", "35 to 44", "45 to 54", "55+"];
const HEIGHTS = ["Under 5'4", "5'4 to 5'7", "5'8 to 5'11", "6'0 and up"];
const TOPS = ["XS", "S", "M", "L", "XL", "XXL"];
const WAISTS = ["28", "30", "32", "34", "36", "38", "40", "42+"];

/* total steps in the dossier index = the 7 questions (intake sits at step 0). */
const TOTAL = QUESTIONS.length;

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Quiz() {
  const router = useRouter();
  // step 0 = intake, 1..7 = questions, 8 = handing off (the "developing" beat)
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<Gender | null>(null);
  const [age, setAge] = useState<string>();
  const [height, setHeight] = useState<string>();
  const [topSize, setTopSize] = useState<string>();
  const [waist, setWaist] = useState<string>();
  const [answers, setAnswers] = useState<Answers>({});
  const [leaving, setLeaving] = useState(false);
  const advancing = useRef<number | null>(null);

  useEffect(() => () => {
    if (advancing.current) window.clearTimeout(advancing.current);
  }, []);

  // the handoff: let the score "develop" for a beat, then route to the result page.
  useEffect(() => {
    if (step <= TOTAL) return;
    const t = window.setTimeout(() => router.push("/result"), prefersReduced() ? 0 : 1300);
    return () => window.clearTimeout(t);
  }, [step, router]);

  function finish(next: Answers) {
    const intake: Intake = { gender: gender as Gender, age, height, topSize, waist };
    const result = scoreQuiz(intake, next);
    try {
      sessionStorage.setItem("iiu_result", JSON.stringify(result));
    } catch {
      /* sessionStorage can be unavailable; the result page falls back gracefully */
    }
    setStep(TOTAL + 1);
  }

  function advance(next: Answers) {
    if (step >= TOTAL) finish(next);
    else setStep(step + 1);
  }

  function pick(qid: string, tag: string) {
    const next = { ...answers, [qid]: tag };
    setAnswers(next);
    if (advancing.current) window.clearTimeout(advancing.current);
    if (prefersReduced()) {
      advance(next);
      return;
    }
    // let the chosen row set, then lift the whole column away before the swap.
    setLeaving(true);
    advancing.current = window.setTimeout(() => {
      setLeaving(false);
      advance(next);
    }, 360);
  }

  function back() {
    if (advancing.current) window.clearTimeout(advancing.current);
    setLeaving(false);
    setStep((s) => Math.max(0, s - 1));
  }

  const progress = step <= 0 ? 0 : step > TOTAL ? 1 : step / TOTAL;

  // ---------- the centre column, per step ----------
  let contentKey: string;
  let shapeMode = false;
  let body: React.ReactNode;

  if (step === 0) {
    contentKey = "intake";
    body = (
      <>
        <span className="quiz-eyebrow">Before we begin</span>
        <h1 className="quiz-q">First, the fitting notes.</h1>
        <div className="intake-ledger">
          <IntakeRow n="01" label="You are">
            <div className="chips">
              <Chip on={gender === "man"} onClick={() => setGender("man")}>A man</Chip>
              <Chip on={gender === "woman"} onClick={() => setGender("woman")}>A woman</Chip>
            </div>
          </IntakeRow>
          <IntakeRow n="02" label="Age">
            <div className="chips">
              {AGES.map((a) => (
                <Chip key={a} on={age === a} onClick={() => setAge(a)}>{a}</Chip>
              ))}
            </div>
          </IntakeRow>
          <IntakeRow n="03" label="Height">
            <div className="chips">
              {HEIGHTS.map((h) => (
                <Chip key={h} on={height === h} onClick={() => setHeight(h)}>{h}</Chip>
              ))}
            </div>
          </IntakeRow>
          <IntakeRow n="04" label="Top size">
            <div className="chips chips--run">
              {TOPS.map((t) => (
                <Chip key={t} on={topSize === t} onClick={() => setTopSize(t)}>{t}</Chip>
              ))}
            </div>
          </IntakeRow>
          <IntakeRow n="05" label="Waist (in)">
            <div className="chips chips--run">
              {WAISTS.map((w) => (
                <Chip key={w} on={waist === w} onClick={() => setWaist(w)}>{w}</Chip>
              ))}
            </div>
          </IntakeRow>
        </div>
        <button
          className="quiz-cta"
          disabled={!(gender && age && height && topSize && waist)}
          onClick={() => gender && age && height && topSize && waist && setStep(1)}
        >
          Begin the fitting <span className="arrow">&rarr;</span>
        </button>
        <p className="quiz-fine">7 questions · about 2 minutes</p>
      </>
    );
  } else if (step > TOTAL) {
    contentKey = "done";
    body = (
      <div className="quiz-done">
        <span className="quiz-eyebrow">Developing your read</span>
        <h1 className="quiz-q">Building your Presence Score.</h1>
        <div className="quiz-develop" aria-hidden="true">
          <span className="quiz-develop-num" data-n="00">00</span>
          <span className="quiz-develop-rule" />
        </div>
        <p className="quiz-fine">One moment. Taking you to your read.</p>
      </div>
    );
  } else {
    const q = QUESTIONS[step - 1];
    const opts = visibleOptions(q, gender as Gender);
    const chosen = answers[q.id];
    shapeMode = !!q.shape;
    contentKey = q.id;
    body = (
      <>
        <span className="quiz-eyebrow">Q.{String(step).padStart(2, "0")}</span>
        <h1 className="quiz-q">{q.prompt}</h1>
        {q.hint ? <p className="quiz-hint is-instruction">{q.hint}</p> : null}

        {q.shape ? (
          <div className="quiz-plates">
            {opts.map((o) => {
              const sub = optSub(o, gender as Gender);
              const name = o.tag.replace("BS-", "");
              return (
                <button
                  key={o.tag}
                  className={`quiz-plate${chosen === o.tag ? " is-on" : ""}`}
                  onClick={() => pick(q.id, o.tag)}
                >
                  <span className="quiz-sil" aria-hidden="true">
                    <i className="tl" /><i className="tr" /><i className="bl" /><i className="br" />
                    <span className="quiz-sil-cap">{name}</span>
                  </span>
                  <span className="quiz-plate-label">{o.label}</span>
                  {sub ? <span className="quiz-plate-sub">{sub}</span> : null}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="quiz-opts" role="radiogroup">
            {opts.map((o) => {
              const sub = optSub(o, gender as Gender);
              const on = chosen === o.tag;
              return (
                <button
                  key={o.tag}
                  role="radio"
                  aria-checked={on}
                  className={`quiz-opt${on ? " is-on" : ""}`}
                  onClick={() => pick(q.id, o.tag)}
                >
                  <span className="quiz-opt-radio" aria-hidden="true" />
                  <span className="quiz-opt-text">
                    {o.label}
                    {sub ? <i>{sub}</i> : null}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <main className="quiz-stage">
      <header className="quiz-mast" style={{ ["--prog" as string]: progress } as React.CSSProperties}>
        <span className="quiz-mast-name">Sanobar Samir</span>
        <span className="quiz-mast-issue">The Instant Image Upgrade</span>
      </header>

      <div className="quiz-zone">
        <div
          className={`quiz-content${shapeMode ? " is-shape" : ""}${leaving ? " is-leaving" : ""}`}
          key={contentKey}
        >
          {body}
        </div>
      </div>

      <footer className="quiz-rail">
        <button
          className={`quiz-back${step <= 0 || step > TOTAL ? " quiz-back--ghost" : ""}`}
          onClick={back}
        >
          <span className="arrow">&larr;</span> Back
        </button>
        <RailIndex step={step} />
      </footer>
    </main>
  );
}

function RailIndex({ step }: { step: number }) {
  if (step === 0) return <span className="quiz-index">Fitting · Intake</span>;
  if (step > TOTAL) return <span className="quiz-index">Developing</span>;
  return (
    <span className="quiz-index">
      <span><b>Q.{String(step).padStart(2, "0")}</b> / {String(TOTAL).padStart(2, "0")}</span>
      <span className="quiz-ticks" aria-hidden="true">
        {QUESTIONS.map((_, i) => (
          <span key={i} className={i + 1 < step ? "done" : i + 1 === step ? "now" : ""} />
        ))}
      </span>
    </span>
  );
}

function IntakeRow({
  n,
  label,
  tag,
  req,
  children,
}: {
  n: string;
  label: string;
  tag?: string;
  req?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="intake-row">
      <div className="intake-head">
        <span className="intake-n">{n}</span>
        <span className="intake-label">{label}</span>
        {tag ? <span className={`intake-tag${req ? " req" : ""}`}>{tag}</span> : null}
      </div>
      <div className="intake-field">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button className={`chip${on ? " is-on" : ""}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}
