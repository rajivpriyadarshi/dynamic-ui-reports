"use client"

import {
  CartesianGrid,
  Cell,
  ReferenceArea,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import {
  STALE_THRESHOLD_MONTHS,
  VALUATION_AGE,
  sgd,
} from "@/app/lab/portfolio-report/eleanor/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * How old each number on her balance sheet is.
 *
 * A dot plot, not a bar chart: the quantity being measured is age, and age has a
 * meaningful zero on the left and a threshold at nine months, so the reader needs to see
 * where each asset falls along one axis rather than compare lengths. Dot size carries the
 * amount at stake, which is the second question and correctly the quieter one — the
 * fifteen-month mark matters more because S$3.0m sits behind it, but it would matter
 * even if it were smaller.
 *
 * The shaded band past nine months is her file's own definition of stale, not a threshold
 * introduced here. It is a flat tint rather than a red zone: two valuations being old is
 * a housekeeping fact, not an error.
 */

const CHART_CONFIG = {
  value: { label: "Valuation" },
} satisfies ChartConfig

const DATA = [...VALUATION_AGE]
  .sort((a, b) => a.months - b.months)
  .map((row) => ({ ...row, stale: row.months >= STALE_THRESHOLD_MONTHS }))

const MAX_MONTHS = 16

function ValuationAge() {
  return (
    <div className="space-y-6">
      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[300px] w-full"
      >
        <ScatterChart margin={{ top: 8, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} strokeOpacity={0.5} />

          {/* her file's own nine-month definition, drawn as context not as an alarm */}
          <ReferenceArea
            x1={STALE_THRESHOLD_MONTHS}
            x2={MAX_MONTHS}
            fill="var(--foreground)"
            fillOpacity={0.05}
            strokeOpacity={0}
          />

          <XAxis
            type="number"
            dataKey="months"
            domain={[0, MAX_MONTHS]}
            ticks={[0, 3, 6, 9, 12, 15]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => (value === 0 ? "Current" : `${value}m`)}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={196}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <ZAxis type="number" dataKey="value" range={[36, 320]} />

          <ChartTooltip
            cursor={{ strokeOpacity: 0.15 }}
            content={
              <ChartTooltipContent
                labelKey="name"
                formatter={(_value, _name, item) => {
                  const row = item.payload as (typeof DATA)[number]
                  return (
                    <div className="flex w-full flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="text-muted-foreground">Carried at</span>
                        <span className="font-medium tabular-nums">
                          {sgd(row.value)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="text-muted-foreground">Last valued</span>
                        <span className="tabular-nums">{row.valuedOn}</span>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />

          <Scatter data={DATA} isAnimationActive={false}>
            {DATA.map((row) => (
              <Cell
                key={row.name}
                fill={
                  row.stale
                    ? "color-mix(in oklab, var(--foreground) 85%, var(--background))"
                    : "color-mix(in oklab, var(--foreground) 22%, var(--background))"
                }
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>

      <p className="text-xs text-muted-foreground">
        Months between each valuation and 30 June 2026. Dot area is the amount
        carried. Cash and the managed portfolio are excluded: both are priced
        continuously, so age does not apply to them.
      </p>
    </div>
  )
}

export { ValuationAge }
