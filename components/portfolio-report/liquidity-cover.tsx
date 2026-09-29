import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/**
 * Whether the money on hand covers what it has been promised to.
 *
 * Two bars on one scale, so the answer is the difference in their lengths rather than a
 * subtraction the reader has to perform. Each bar is segmented by where the money comes
 * from or goes to, and every segment is named underneath with its own figure — because one
 * of them is 1% of the bar and would otherwise be a line too thin to see, which is itself
 * worth showing rather than rounding away.
 *
 * Not `LiquidityLadder`: a ladder needs a stated minimum cash floor to measure against, and
 * the source names none. This measures two stated amounts against each other and stops.
 */

export type Flow = { name: string; amount: number; detail: string }

function LiquidityCover({
  sources,
  uses,
  sourcesLabel,
  usesLabel,
  remainderLabel,
  remainderNote,
  format,
  className,
}: {
  sources: Flow[]
  uses: Flow[]
  sourcesLabel: string
  usesLabel: string
  remainderLabel: string
  remainderNote: string
  format: (amount: number) => string
  className?: string
}) {
  const available = sources.reduce((total, flow) => total + flow.amount, 0)
  const required = uses.reduce((total, flow) => total + flow.amount, 0)
  const scale = Math.max(available, required)
  const remaining = available - required

  return (
    <div className={cn("space-y-7", className)}>
      <div className="space-y-6">
        <FlowBar
          label={sourcesLabel}
          flows={sources}
          total={available}
          scale={scale}
          format={format}
          variant="solid"
        />
        <FlowBar
          label={usesLabel}
          flows={uses}
          total={required}
          scale={scale}
          format={format}
          variant="outline"
        />
      </div>

      <Separator />

      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl leading-none font-medium tracking-tight tabular-nums">
            {remaining >= 0 ? format(remaining) : `−${format(-remaining)}`}
          </span>
          <span className="text-xs text-muted-foreground">{remainderLabel}</span>
        </div>
        <p className="max-w-[46ch] text-xs leading-relaxed text-muted-foreground">
          {remainderNote}
        </p>
      </div>
    </div>
  )
}

function FlowBar({
  label,
  flows,
  total,
  scale,
  format,
  variant,
}: {
  label: string
  flows: Flow[]
  total: number
  scale: number
  format: (amount: number) => string
  variant: "solid" | "outline"
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </span>
        <span className="text-sm font-medium tabular-nums">{format(total)}</span>
      </div>

      {/* Segments are separated by a background-coloured hairline, not a gap, so the bar
          still reads as one length while its parts stay countable. */}
      <div
        aria-hidden
        className="flex h-3 w-full gap-px"
        style={{ width: `${(total / scale) * 100}%` }}
      >
        {flows.map((flow) => (
          <span
            key={flow.name}
            className={
              variant === "solid"
                ? "h-full bg-foreground"
                : "h-full border border-foreground/40 bg-foreground/8"
            }
            style={{ width: `${(flow.amount / total) * 100}%` }}
          />
        ))}
      </div>

      <dl className="flex flex-wrap gap-x-6 gap-y-1">
        {flows.map((flow) => (
          <div key={flow.name} className="flex items-baseline gap-2">
            <dt className="text-[0.8125rem]">{flow.name}</dt>
            <dd className="text-[0.8125rem] text-muted-foreground tabular-nums">
              {format(flow.amount)}
            </dd>
            <dd className="text-xs text-muted-foreground">· {flow.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { LiquidityCover }
