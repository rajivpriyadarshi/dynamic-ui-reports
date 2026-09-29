"use client"

import { Bar, BarChart, Cell, LabelList, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * What helped and what hurt, in percentage points, around a zero line.
 *
 * Distinct from the contribution chart in the other reports: those bars are all positive
 * because nothing was below cost, so no zero line was drawn. Here four of the eight lines
 * are negative, and the axis at zero is the whole point — it is what separates the
 * S$-adding half of the portfolio from the half that took away.
 *
 * Two tones, not eight. Direction already says gain or drag, and the sign is printed on
 * every label; colouring each line differently would encode nothing. Drags use a mid tone
 * rather than red — this is an eight-week attribution, not an alarm.
 *
 * No x-axis: every bar carries its own figure at the end, so an axis would be a second
 * way of reading the same lengths.
 */

export type AttributionRow = { name: string; pp: number }

const CHART_CONFIG = {
  pp: { label: "Contribution" },
} satisfies ChartConfig

function ReturnAttribution({ rows }: { rows: AttributionRow[] }) {
  const max = Math.max(...rows.map((row) => row.pp))
  const min = Math.min(...rows.map((row) => row.pp))

  return (
    <ChartContainer
      config={CHART_CONFIG}
      className="aspect-auto h-[248px] w-full"
    >
      <BarChart
        data={rows}
        layout="vertical"
        margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
        barCategoryGap={8}
      >
        {/* Headroom on both sides so the end labels sit inside the plot area. */}
        <XAxis type="number" domain={[min * 1.45, max * 1.24]} hide />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={152}
          tickMargin={6}
          className="text-xs"
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideIndicator
              formatter={(value) => (
                <span className="font-medium tabular-nums">
                  {Number(value) >= 0 ? "+" : "−"}
                  {Math.abs(Number(value)).toFixed(2)}pp of the change
                </span>
              )}
            />
          }
        />
        <ReferenceLine x={0} stroke="var(--foreground)" strokeOpacity={0.35} />
        <Bar dataKey="pp" radius={1} isAnimationActive={false}>
          {rows.map((row) => (
            <Cell
              key={row.name}
              fill={
                row.pp >= 0
                  ? "var(--foreground)"
                  : "color-mix(in oklab, var(--foreground) 32%, var(--background))"
              }
            />
          ))}
          <LabelList dataKey="pp" content={<EndLabel />} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/**
 * Bars straddle zero, so the label has to change side with the sign — `position="right"`
 * puts a negative bar's label on top of the bar rather than beyond it.
 *
 * Recharts anchors both directions at zero and signs the width, so the far end is
 * `x + width` either way. Taking the min and the max of the two edges rather than trusting
 * the sign keeps this correct whichever convention the chart hands over.
 */
function EndLabel(props: {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  value?: number | string
}) {
  const x = Number(props.x ?? 0)
  const y = Number(props.y ?? 0)
  const width = Number(props.width ?? 0)
  const height = Number(props.height ?? 0)
  const value = Number(props.value ?? 0)
  const positive = value >= 0

  const left = Math.min(x, x + width)
  const right = Math.max(x, x + width)

  return (
    <text
      x={positive ? right + 7 : left - 7}
      y={y + height / 2}
      textAnchor={positive ? "start" : "end"}
      dominantBaseline="central"
      className="fill-foreground text-xs tabular-nums"
    >
      {positive ? "+" : "−"}
      {Math.abs(value).toFixed(2)}
    </text>
  )
}

export { ReturnAttribution }
