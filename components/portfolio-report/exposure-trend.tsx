"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { NVDA_WEIGHT_HISTORY } from "@/app/lab/portfolio-report/prashanth/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * NVIDIA's share of the listed book, month by month.
 *
 * One line, flat fill, no area gradient: the quantity is a percentage of the book, and
 * shading the space beneath it would encode nothing. Every month except June is higher
 * than the one before it, which is the finding — the position was never trimmed, it
 * simply appreciated faster than everything around it.
 *
 * There is no target band drawn because his file records no limit for a single holding.
 */

const CHART_CONFIG = {
  weight: { label: "Share of listed holdings", color: "var(--foreground)" },
} satisfies ChartConfig

function ExposureTrend() {
  return (
    <ChartContainer config={CHART_CONFIG} className="aspect-auto h-[180px] w-full">
      <LineChart
        data={[...NVDA_WEIGHT_HISTORY]}
        margin={{ top: 10, right: 12, bottom: 0, left: 0 }}
      >
        <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis
          domain={[8, 15]}
          ticks={[9, 11, 13, 15]}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={42}
        />
        <ChartTooltip
          cursor={{ stroke: "var(--border)" }}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) => (
                <span className="font-medium tabular-nums">
                  {Number(value).toFixed(1)}% of listed holdings
                </span>
              )}
            />
          }
        />
        <Line
          dataKey="weight"
          stroke="var(--color-weight)"
          strokeWidth={1.75}
          isAnimationActive={false}
          dot={false}
          activeDot={{ r: 3, strokeWidth: 0 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export { ExposureTrend }
