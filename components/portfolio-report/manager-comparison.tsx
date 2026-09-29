import {
  PERIOD_RETURNS,
  signedPct,
  signedPp,
} from "@/app/lab/portfolio-report/prashanth/data"
import { DataLimitation } from "@/components/portfolio-report/data-limitation"

/**
 * Return against benchmark over each period the estimate can speak to.
 *
 * Paired bars rather than a chart: three periods and two series is six numbers, and at
 * that size a reader compares lengths and reads figures faster than they can decode an
 * axis. The portfolio bar is solid, the benchmark bar is outlined — same measure, one
 * of them estimated more loosely than the other.
 *
 * Bars are drawn on a common scale, so 6M genuinely looks three times 3M.
 */

const ROWS = PERIOD_RETURNS.filter((row) => row.benchmark !== null)
const SCALE = Math.max(...ROWS.map((row) => row.portfolio)) * 1.05

function ManagerComparison() {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {ROWS.map((row) => (
          <div key={row.period} className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {row.period} · {row.window}
              </span>
              <span className="text-sm font-medium tabular-nums">
                {signedPp(row.alpha!)}
              </span>
            </div>

            <div className="space-y-1">
              <BarRow
                label="Portfolio"
                value={row.portfolio}
                scale={SCALE}
                variant="solid"
              />
              <BarRow
                label="Benchmark"
                value={row.benchmark!}
                scale={SCALE}
                variant="outline"
              />
            </div>
          </div>
        ))}
      </div>

      <DataLimitation title="Performance is only measured for the whole portfolio">
        There is one performance history on file, covering everything together,
        and none for the individual managers. The 7 August note says LGT is doing
        well, but there are no figures behind that — which is why reviewing LGT
        against its benchmark is still an open item here rather than a finding.
      </DataLimitation>
    </div>
  )
}

function BarRow({
  label,
  value,
  scale,
  variant,
}: {
  label: string
  value: number
  scale: number
  variant: "solid" | "outline"
}) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-x-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span aria-hidden className="flex h-3 items-center">
        <span
          className={
            variant === "solid"
              ? "h-3 bg-foreground"
              : "h-3 border border-foreground/35 bg-transparent"
          }
          style={{ width: `${(value / scale) * 100}%` }}
        />
      </span>
      <span className="text-right text-[0.8125rem] tabular-nums">
        {signedPct(value)}
      </span>
    </div>
  )
}

export { ManagerComparison }
