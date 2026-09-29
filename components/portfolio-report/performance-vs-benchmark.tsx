"use client"

import * as React from "react"
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts"

import {
  PERFORMANCE_VS_BENCHMARK,
  PERIOD_RETURNS,
  signedPct,
  signedPp,
} from "@/app/lab/portfolio-report/prashanth/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/**
 * The portfolio against its benchmark, rebased to February = 100.
 *
 * Two series and nothing else: no legend box, no axis lines, no dots. The series are
 * labelled at their right-hand ends, where the eye already is. The benchmark is dashed
 * because it is estimated and observed at four months only — the gaps are real gaps,
 * not smoothing, and `connectNulls` draws through them without implying a path.
 *
 * The period control does not refetch or re-slice the data. It shades the window under
 * discussion and swaps the three figures beside it, all of which come from the record.
 */

const CHART_CONFIG = {
  portfolio: { label: "Portfolio", color: "var(--foreground)" },
  benchmark: { label: "Benchmark", color: "var(--chart-2)" },
} satisfies ChartConfig

/** Where each period's window opens on the February-based series. */
const PERIOD_START: Record<string, string> = {
  "1M": "Jul",
  "3M": "May",
  "6M": "Feb",
  YTD: "Feb",
}

type Period = (typeof PERIOD_RETURNS)[number]["period"]

function PerformanceVsBenchmark() {
  const [period, setPeriod] = React.useState<Period>("6M")
  const selected = PERIOD_RETURNS.find((row) => row.period === period)!
  const lastMonth = PERFORMANCE_VS_BENCHMARK.at(-1)!.month

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <dl className="flex flex-wrap items-end gap-x-9 gap-y-4 tabular-nums">
          <div>
            <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Portfolio
            </dt>
            <dd className="mt-1.5 text-2xl leading-none font-medium tracking-tight">
              {signedPct(selected.portfolio)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Benchmark
            </dt>
            <dd className="mt-1.5 text-2xl leading-none font-medium tracking-tight text-muted-foreground">
              {selected.benchmark === null ? "—" : signedPct(selected.benchmark)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              Difference
            </dt>
            <dd className="mt-1.5 text-2xl leading-none font-medium tracking-tight">
              {selected.alpha === null ? "—" : signedPp(selected.alpha)}
            </dd>
          </div>
          <div className="text-xs text-muted-foreground">{selected.window}</div>
        </dl>

        <ToggleGroup
          size="sm"
          spacing={0}
          variant="outline"
          aria-label="Period"
          value={[period]}
          onValueChange={(value) => {
            const next = value[0] as Period | undefined
            if (next) setPeriod(next)
          }}
        >
          {PERIOD_RETURNS.map((row) => (
            <ToggleGroupItem
              key={row.period}
              value={row.period}
              className="px-3 font-mono text-xs tabular-nums"
            >
              {row.period}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[300px] w-full"
      >
        <LineChart
          data={[...PERFORMANCE_VS_BENCHMARK]}
          // Right margin holds the two end-of-line series labels; "Benchmark" is
          // the longer of them and needs all of this.
          margin={{ top: 8, right: 78, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeOpacity={0.6}
          />
          {PERIOD_START[period] !== "Feb" && (
            <ReferenceArea
              x1={PERIOD_START[period]}
              x2={lastMonth}
              fill="var(--muted)"
              fillOpacity={0.7}
              stroke="none"
            />
          )}
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
          />
          <YAxis
            domain={[98, 116]}
            ticks={[100, 105, 110, 115]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={34}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)" }}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name) => (
                  <div className="flex w-full justify-between gap-4 tabular-nums">
                    <span className="text-muted-foreground">
                      {CHART_CONFIG[name as keyof typeof CHART_CONFIG].label}
                    </span>
                    <span className="font-medium">
                      {Number(value).toFixed(1)}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Line
            dataKey="benchmark"
            stroke="var(--color-benchmark)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            connectNulls
            isAnimationActive={false}
          >
            <LabelList
              dataKey="benchmark"
              content={seriesEndLabel("Benchmark", "var(--color-benchmark)")}
            />
          </Line>
          <Line
            dataKey="portfolio"
            stroke="var(--color-portfolio)"
            strokeWidth={1.75}
            dot={false}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="portfolio"
              content={seriesEndLabel("Portfolio", "var(--color-portfolio)")}
            />
          </Line>
        </LineChart>
      </ChartContainer>
    </div>
  )
}

/**
 * Names a series at its own right-hand end, so the chart needs no legend.
 *
 * `LabelList` calls this once per point; we draw only at the final month. Both series
 * end in August, so the two labels stack naturally without colliding.
 */
const LAST_INDEX = PERFORMANCE_VS_BENCHMARK.length - 1

function seriesEndLabel(label: string, fill: string) {
  return function EndLabel(props: {
    index?: number
    x?: number | string
    y?: number | string
  }) {
    const { index, x, y } = props
    if (index !== LAST_INDEX || x === undefined || y === undefined) return null

    return (
      <text
        x={Number(x) + 8}
        y={Number(y)}
        dy="0.32em"
        fill={fill}
        className="text-[0.6875rem] font-medium"
      >
        {label}
      </text>
    )
  }
}

export { PerformanceVsBenchmark }
