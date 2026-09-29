"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  CONTRIBUTION,
  LISTED,
  pct,
  usd,
} from "@/app/lab/portfolio-report/prashanth/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

/**
 * The "but" in the opening sentence, as one bar.
 *
 * The claim is that most of the year's gain sits in three technology names, so the
 * exhibit is the gain itself divided by holding — the three technology names set solid
 * on the left, the index fund faint on the right. The dark run reads as the majority
 * without a number having to assert it.
 *
 * Not the chapter 03 chart at small size: that one measures each holding's contribution
 * in percentage points of the book at cost, which is a return. This divides US$4.60m of
 * money four ways, which is a composition — one stacked bar, hover for the detail.
 *
 * Since cost, not year to date: his positions carry a cost basis and a market value and
 * nothing in between, so a year-to-date attribution would have to be invented.
 */

const TECHNOLOGY_SHADES = [0.92, 0.72, 0.54]
const OTHER_SHADE = 0.2

const shade = (opacity: number) =>
  `color-mix(in oklab, var(--foreground) ${opacity * 100}%, var(--background))`

/** Technology first so the majority reads as one mass, then everything else. */
const SEGMENTS = [
  ...CONTRIBUTION.filter((row) => row.group === "Technology"),
  ...CONTRIBUTION.filter((row) => row.group !== "Technology"),
]

const TECHNOLOGY_GAIN = CONTRIBUTION.filter(
  (row) => row.group === "Technology"
).reduce((total, row) => total + row.gain, 0)

const CHART_CONFIG = Object.fromEntries(
  SEGMENTS.map((row, index) => [
    row.ticker,
    {
      label: row.name,
      color: shade(
        row.group === "Technology" ? TECHNOLOGY_SHADES[index] : OTHER_SHADE
      ),
    },
  ])
) satisfies ChartConfig

/** One row: the gain, split by holding. */
const DATA = [
  Object.fromEntries([
    ["label", "Unrealised gain"],
    ...SEGMENTS.map((row) => [row.ticker, row.gain]),
  ]),
]

function GainComposition({ className }: { className?: string }) {
  return (
    <figure className={cn("space-y-3", className)}>
      <figcaption className="text-[0.6875rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
        Where the {usd(LISTED.gain, 2)} gain sits
      </figcaption>

      <ChartContainer config={CHART_CONFIG} className="aspect-auto h-[38px] w-full">
        <BarChart
          data={DATA}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barSize={26}
        >
          <XAxis type="number" domain={[0, LISTED.gain]} hide />
          <YAxis type="category" dataKey="label" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => (
                  <div className="flex w-full items-center gap-2">
                    <span
                      aria-hidden
                      className="size-2 shrink-0 rounded-[2px]"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="flex-1">
                      {CHART_CONFIG[name as keyof typeof CHART_CONFIG]?.label ??
                        name}
                    </span>
                    <span className="font-medium tabular-nums">
                      {usd(Number(value), 2)}
                    </span>
                    <span className="w-9 text-right text-muted-foreground tabular-nums">
                      {pct(Number(value) / LISTED.gain, 0)}
                    </span>
                  </div>
                )}
              />
            }
          />
          {SEGMENTS.map((row) => (
            <Bar
              key={row.ticker}
              dataKey={row.ticker}
              stackId="gain"
              fill={`var(--color-${row.ticker})`}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ChartContainer>

      {/* tickers set to the width of their own segment, so the bar needs no legend */}
      <div aria-hidden className="flex gap-1">
        {SEGMENTS.map((row) => (
          <span
            key={row.ticker}
            className="overflow-hidden font-mono text-[0.625rem] tracking-wide text-muted-foreground"
            style={{ flexBasis: `${row.share * 100}%` }}
          >
            {row.ticker}
          </span>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {usd(TECHNOLOGY_GAIN, 2)} of it —{" "}
        {pct(TECHNOLOGY_GAIN / LISTED.gain, 0)} — is the three technology names.
        Measured since cost, not year to date.
      </p>
    </figure>
  )
}

export { GainComposition }
