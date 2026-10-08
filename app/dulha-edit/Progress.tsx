const STEPS = [
  ["Confirm your slot", "Slot confirmed"],
  ["Pick your time", "Time picked"],
  ["Call booked", "Call booked"],
] as const;

/* step: the 1-based step the visitor is on. Earlier steps read as done. */
export default function Progress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <nav className="wc-progress" aria-label="Booking progress">
      {STEPS.map(([todo, done], i) => {
        const n = i + 1;
        const state = n < step ? "done" : n === step ? "active" : "";
        return (
          <span key={todo} className="wc-progress-item">
            {i > 0 ? <span className="wc-progress-rail" aria-hidden="true" /> : null}
            <span className={`wc-step ${state}`}>
              <span className="wc-step-n">{n < step ? "✓" : n}</span>
              {n < step ? done : todo}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
