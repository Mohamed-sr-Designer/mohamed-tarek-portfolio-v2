"use client";

// Shared segmented control used by the AI Work Flow, Storyboards, Motion and
// case-gallery sections so only one item is on screen at a time.
//
// Built as a real switch rather than a row of pills. Earlier passes styled the
// options as separate buttons and people still read them as labels: with no
// enclosing track there was nothing to say "these are the two states of one
// control". Now the whole thing sits in a recessed track, the active option
// rides a raised slab inside it, and the inactive ones are visibly pressed
// back — the shape itself reads as switchable before anyone reads the words.
export function Toggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  hint,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  /** short instruction shown above the control, e.g. "Pick a production" */
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {hint ? (
        <span className="flex items-center gap-2 text-[11px] uppercase tracking-ultra text-mint">
          <span aria-hidden className="text-xs leading-none">
            ⇄
          </span>
          {hint}
        </span>
      ) : null}

      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex w-fit max-w-full flex-wrap gap-1 rounded-full border border-line/25 bg-ink-900/80 p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
      >
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(o.value)}
              className={`group relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-all duration-300 ${
                on
                  ? "bg-mint font-semibold text-ink-900 shadow-[0_6px_18px_-6px_rgb(var(--mint)/0.8)]"
                  : "text-bone-300 hover:bg-line/10 hover:text-bone-50"
              }`}
            >
              <span
                aria-hidden
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                  on ? "bg-ink-900" : "bg-bone-500 group-hover:bg-mint"
                }`}
              />
              <span className="whitespace-nowrap">{o.label}</span>
              {o.hint ? (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                    on ? "bg-ink-900/20 text-ink-900" : "bg-line/15 text-bone-400"
                  }`}
                >
                  {o.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
