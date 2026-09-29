"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  HOLDINGS,
  SECURITIES,
  pct,
  sgd,
  sgdCompact,
  signedPct,
} from "@/app/lab/portfolio-report/eleanor/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * Each mandate's cost and its mark, on one axis.
 *
 * Her file holds a cost basis and a market value per mandate and nothing between them, so
 * the only honest exhibit is the distance between those two numbers. Each bar therefore
 * starts at cost and ends at the mark: the left edge is what she paid, the length is
 * everything that has happened since. It is not a return — no period is attached, because
 * her file records no purchase dates.
 *
 * Ordered by that distance rather than by size, which is what makes the finding visible:
 * the two equity funds carry almost all of the gain, and S$9.1m of fixed income has moved
 * so little that its bars are barely a tick.
 *
 * The split beneath the chart names that in figures. Her equity exposure is real and it is
 * held through two funds rather than through any single stock, so nothing above it says the
 * word "equity" — the balance sheet calls the whole mandate "listed securities" and the
 * chart labels four fund names. Two of those four are equity, they are 44% of the mandate,
 * and they produced 84% of its gain. Leaving that to be inferred from the fund names
 * understated the largest active call inside the mandate.
 */

const ROWS = [...HOLDINGS]
  .map((holding) => ({
    name: holding.name,
    kind: holding.kind,
    cost: holding.cost,
    gain: holding.marketValue - holding.cost,
    marketValue: holding.marketValue,
  }))
  .sort((a, b) => b.gain - a.gain)

/** Rounded up to a whole million so the axis ends on a tick rather than on a holding. */
const AXIS_MAX = Math.ceil(Math.max(...ROWS.map((row) => row.marketValue)))
const TICKS = Array.from({ length: AXIS_MAX / 2 + 1 }, (_, i) => i * 2)

/**
 * What is equity and what is not, from the `kind` her file already records against each
 * mandate. Derived, not stated — no figure here is new.
 */
const SPLIT = (["Equity fund", "Fixed income"] as const).map((kind) => {
  const lines = HOLDINGS.filter((holding) => holding.kind === kind)
  const marketValue = lines.reduce((total, h) => total + h.marketValue, 0)
  const gain = lines.reduce((total, h) => total + (h.marketValue - h.cost), 0)
  return {
    label: kind === "Equity fund" ? "Equity funds" : "Fixed income",
    count: lines.length,
    marketValue,
    gain,
    shareOfMandate: marketValue / SECURITIES.marketValue,
    shareOfGain: gain / SECURITIES.gain,
  }
})

const CHART_CONFIG = {
  cost: { label: "Cost", color: "color-mix(in oklab, var(--foreground) 30%, var(--background))" },
  gain: { label: "Since cost", color: "var(--foreground)" },
} satisfies ChartConfig

function CostToMarket() {
  return (
    <div className="space-y-5">
      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[220px] w-full"
      >
        <BarChart
          data={ROWS}
          layout="vertical"
          // Right margin carries the gain labels; left is the mandate names.
          margin={{ top: 4, right: 104, bottom: 0, left: 0 }}
          barCategoryGap="34%"
        >
          <XAxis
            type="number"
            domain={[0, AXIS_MAX]}
            ticks={TICKS}
            tickFormatter={(value) => `S$${value}m`}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={208}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            className="text-[0.8125rem]"
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                formatter={(value, name) => (
                  <span className="flex w-full justify-between gap-6">
                    <span className="text-muted-foreground">
                      {name === "cost" ? "Cost" : "Since cost"}
                    </span>
                    <span className="font-medium tabular-nums">
                      {name === "cost"
                        ? sgd(Number(value), 2)
                        : `+${sgdCompact(Number(value))}`}
                    </span>
                  </span>
                )}
              />
            }
          />
          {/* The cost leg is drawn, faintly: it is where the bar starts, so hiding it
              would leave the mark floating without a stated origin. */}
          <Bar
            dataKey="cost"
            stackId="mandate"
            fill="var(--color-cost)"
            isAnimationActive={false}
          />
          <Bar
            dataKey="gain"
            stackId="mandate"
            fill="var(--color-gain)"
            // Two of the four have moved so little that they would otherwise vanish.
            minPointSize={2}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="gain"
              position="right"
              offset={10}
              className="fill-muted-foreground text-[0.6875rem] tabular-nums"
              formatter={(value) => `+${sgdCompact(Number(value))}`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>

      {/* The equity and fixed-income halves, because the chart above labels funds and the
          balance sheet labels the whole thing "listed securities" — neither says which of
          it is stock. Two rows, not a second chart: it is one split of four lines. */}
      <dl className="grid gap-x-12 gap-y-2.5 border-t pt-4 sm:grid-cols-2">
        {SPLIT.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.8125rem]">{group.label}</dt>
              <dd className="text-[0.8125rem] font-medium tabular-nums">
                {sgd(group.marketValue)}
              </dd>
            </div>
            <dd className="text-xs text-muted-foreground tabular-nums">
              {group.count} of {HOLDINGS.length} mandates ·{" "}
              {pct(group.shareOfMandate, 0)} of the book ·{" "}
              {pct(group.shareOfGain, 0)} of the gain
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 border-t pt-4">
        <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
          Managed portfolio
        </p>
        <p className="text-[0.8125rem] text-muted-foreground tabular-nums">
          Paid {sgd(SECURITIES.cost, 2)} · now worth{" "}
          {sgd(SECURITIES.marketValue, 2)}
        </p>
        <p className="flex items-baseline gap-2">
          <span className="text-xl leading-none font-medium tracking-tight tabular-nums">
            +{sgd(SECURITIES.gain, 2)}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {signedPct(SECURITIES.returnOnCost)} since purchase
          </span>
        </p>
      </div>
    </div>
  )
}

export { CostToMarket }
