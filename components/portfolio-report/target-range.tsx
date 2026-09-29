import { cn } from "@/lib/utils"

/**
 * Where a measured exposure sits relative to a preferred band.
 *
 * `Progress` would be the wrong primitive here: it can only say "how far along a bar",
 * and the question is "inside or outside a range, and by how much". So this is a scale
 * with the band shaded on it and one marker — thin, ticked, and to scale, the way a
 * risk report would print it. No gauge, no dial, no traffic light.
 *
 * Deliberately no alarm colour, even though the one use of it here would be outside the
 * band: the band this report draws is illustrative, and colouring a breach of a figure
 * nobody has agreed to would assert more than the data supports. The distance between
 * the marker and the band is the argument.
 */

function TargetRange({
  value,
  min,
  max,
  domain = [0, 0.7],
  valueLabel,
  bandLabel,
  className,
}: {
  /** The measured exposure, as a fraction. */
  value: number
  /** Band bounds, as fractions. */
  min: number
  max: number
  /** Scale bounds, as fractions. */
  domain?: [number, number]
  valueLabel: string
  bandLabel: string
  className?: string
}) {
  const [floor, ceiling] = domain
  const position = (fraction: number) =>
    ((fraction - floor) / (ceiling - floor)) * 100

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative pt-7 pb-1">
        {/* the marker's own label, carried above it so the scale stays uncluttered */}
        <div
          className="absolute top-0 -translate-x-1/2 text-center whitespace-nowrap"
          style={{ left: `${position(value)}%` }}
        >
          <span className="text-lg leading-none font-medium tabular-nums">
            {valueLabel}
          </span>
        </div>

        <div className="relative h-4">
          {/* the scale */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
          {/* the preferred band */}
          <div
            className="absolute top-1/2 h-3 -translate-y-1/2 bg-foreground/15"
            style={{
              left: `${position(min)}%`,
              width: `${position(max) - position(min)}%`,
            }}
          />
          {/* the measurement */}
          <div
            className="absolute top-0 h-4 w-px bg-foreground"
            style={{ left: `${position(value)}%` }}
          />
        </div>

        {/* band bounds, annotated on the scale itself */}
        <div className="relative mt-1.5 h-4 font-mono text-[0.625rem] text-muted-foreground tabular-nums">
          <span
            className="absolute -translate-x-1/2"
            style={{ left: `${position(min)}%` }}
          >
            {Math.round(min * 100)}%
          </span>
          <span
            className="absolute -translate-x-1/2"
            style={{ left: `${position(max)}%` }}
          >
            {Math.round(max * 100)}%
          </span>
          <span className="absolute right-0">
            {Math.round(ceiling * 100)}%
          </span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{bandLabel}</p>
    </div>
  )
}

export { TargetRange }
