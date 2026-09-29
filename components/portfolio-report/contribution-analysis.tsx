"use client"

import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"

import {
  CONTRIBUTION,
  LISTED,
  usd,
} from "@/app/lab/portfolio-report/prashanth/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * Which holdings produced the gain, in percentage points of the book at cost.
 *
 * Two shades, not five: the three technology names carry the foreground colour because
 * they are the finding, the index fund recedes to a mid tone. A mid tone rather than the
 * lightest chart token, because the theme's dark palette is identical to its light one —
 * `--chart-1` would read as the same near-white as the foreground once inverted.
 *
 * Every bar is positive — no holding is below cost — so there is no zero line to
 * straddle and none is drawn.
 *
 * The bars are labelled at their ends, so the chart needs no x-axis of its own.
 */

const CHART_CONFIG = {
  pp: { label: "Contribution" },
} satisfies ChartConfig

function ContributionAnalysis() {
  const data = CONTRIBUTION.map((row) => ({
    ...row,
    highlight: row.group === "Technology",
  }))
  const max = Math.max(...data.map((row) => row.pp))

  return (
    <div className="space-y-4">
      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[176px] w-full"
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 56, bottom: 0, left: 0 }}
          barCategoryGap={10}
        >
          <XAxis type="number" domain={[0, max * 1.08]} hide />
          <YAxis
            type="category"
            dataKey="ticker"
            tickLine={false}
            axisLine={false}
            width={56}
            tickMargin={4}
            className="font-mono"
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                labelKey="name"
                formatter={(value, _name, item) => (
                  <div className="space-y-0.5 tabular-nums">
                    <div className="font-medium">
                      +{Number(value).toFixed(1)}pp of the book at cost
                    </div>
                    <div className="text-muted-foreground">
                      {usd(item.payload.gain, 2)} of the {usd(LISTED.gain, 2)}{" "}
                      unrealised gain
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar dataKey="pp" radius={2} isAnimationActive={false}>
            {data.map((row) => (
              <Cell
                key={row.ticker}
                fill={row.highlight ? "var(--foreground)" : "var(--chart-2)"}
              />
            ))}
            <LabelList
              dataKey="pp"
              position="right"
              offset={10}
              className="fill-foreground text-xs tabular-nums"
              formatter={(value) => `+${Number(value).toFixed(1)}pp`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export { ContributionAnalysis }
