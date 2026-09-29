import { cn } from "@/lib/utils"

/**
 * One weight, where it was and where it is, against the whole portfolio.
 *
 * The full track is the portfolio, so the reader sees 29% as a share of everything rather
 * than as a number on its own — and sees that the other 71% is not broken down anywhere in
 * the source. The tick marks the weight at the last review, so the move is a distance on
 * the same bar instead of two figures to subtract.
 *
 * Not `Progress`: there is no target here and no completion. A progress bar would imply
 * 29% is 29% of the way to something, and nothing in the record says what that would be.
 * Not `TargetRange` either — that needs a stated band, and none exists.
 */
function ConcentrationShift({
  label,
  from,
  to,
  fromLabel,
  toLabel,
  remainderLabel,
  className,
}: {
  label: string
  /** Percent of the whole, 0–100. */
  from: number
  to: number
  fromLabel: string
  toLabel: string
  /** What the rest of the track is, said plainly. */
  remainderLabel: string
  className?: string
}) {
  const points = to - from

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
          {points >= 0 ? "+" : "−"}
          {Math.abs(points)} points since the last review
        </span>
      </div>

      <div>
        {/* The tick sits above the track at the old weight, labelled to its right. */}
        <div className="relative h-4">
          <span
            className="absolute bottom-0 -translate-x-1/2"
            style={{ left: `${from}%` }}
          >
            <span className="block h-2 w-px bg-foreground/45" />
          </span>
          <span
            className="absolute bottom-0 pl-2 text-[0.6875rem] whitespace-nowrap text-muted-foreground tabular-nums"
            style={{ left: `${from}%` }}
          >
            {fromLabel}
          </span>
        </div>

        <div
          aria-hidden
          className="flex h-2.5 w-full overflow-hidden bg-muted"
        >
          <span className="h-full bg-foreground" style={{ width: `${to}%` }} />
        </div>

        <div className="mt-2 flex items-baseline justify-between gap-6">
          <span className="text-2xl leading-none font-medium tracking-tight tabular-nums">
            {toLabel}
          </span>
          <span className="max-w-[28ch] text-right text-xs leading-snug text-muted-foreground">
            {remainderLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

export { ConcentrationShift }
