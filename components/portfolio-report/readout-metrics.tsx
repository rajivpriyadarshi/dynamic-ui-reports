import { cn } from "@/lib/utils"

/**
 * The few figures that support the opening statement.
 *
 * Deliberately not cards: no borders, no backgrounds, no shadows. Thin vertical rules
 * group them the way a statement header would, and the numbers carry the weight.
 */

export type ReadoutMetric = {
  label: string
  value: string
  /** One short clause of context. Kept short — this is a header, not a paragraph. */
  detail?: string
}

function ReadoutMetrics({
  metrics,
  className,
}: {
  metrics: ReadoutMetric[]
  className?: string
}) {
  return (
    <dl
      className={cn(
        "grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="border-l pl-4">
          <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
            {metric.label}
          </dt>
          <dd className="mt-2">
            <span className="block text-[1.75rem] leading-none font-medium tracking-tight tabular-nums">
              {metric.value}
            </span>
            {metric.detail && (
              <span className="mt-2 block text-xs leading-snug text-muted-foreground">
                {metric.detail}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { ReadoutMetrics }
