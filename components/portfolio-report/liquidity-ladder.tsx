"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  AS_OF,
  COMMITMENTS,
  LIQUIDITY,
  sgd,
  sgdCompact,
} from "@/app/lab/portfolio-report/eleanor/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * Her cash balance walked forward through every dated commitment in the file.
 *
 * A step area, because cash does not decline smoothly — it sits flat and then drops on a
 * date. Drawing it as a slope would imply a drawdown that does not happen and would hide
 * the thing worth seeing, which is that the line crosses her own S$7m floor at the very
 * first call in October and never comes back above it.
 *
 * The floor is the only reference line, and it is the one threshold in her record that
 * she set herself. Nothing here is a forecast: every step is a dated amount from the file,
 * and the two her file marks medium-confidence are named in the tooltip.
 */

const CHART_CONFIG = {
  cash: { label: "Cash available" },
} satisfies ChartConfig

type Step = {
  when: string
  cash: number
  event: string | null
  amount: number | null
  confidence: string | null
}

/** Opening balance, then one step per commitment, in date order. */
const DATA: Step[] = COMMITMENTS.reduce<Step[]>(
  (steps, commitment) => {
    const previous = steps[steps.length - 1]
    return [
      ...steps,
      {
        when: commitment.when,
        cash: previous.cash - commitment.amount,
        event: commitment.name,
        amount: commitment.amount,
        confidence: commitment.confidence,
      },
    ]
  },
  [
    {
      when: "Today",
      cash: LIQUIDITY.cash,
      event: null,
      amount: null,
      confidence: null,
    },
  ]
)

function LiquidityLadder() {
  return (
    <div className="space-y-6">
      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[260px] w-full"
      >
        <AreaChart data={DATA} margin={{ top: 8, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.5} />
          <XAxis
            dataKey="when"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[0, 12]}
            ticks={[0, 3, 6, 9, 12]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={44}
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value}m`}
          />

          <ReferenceLine
            y={LIQUIDITY.reserve}
            stroke="var(--foreground)"
            strokeOpacity={0.45}
            strokeDasharray="3 3"
            label={{
              value: `The minimum she set · ${sgd(LIQUIDITY.reserve)}`,
              // Right-hand end and below the rule: by then the cash line has
              // dropped to S$4m, so this is the one part of the plot where the
              // label sits on white rather than across the steps or the dashes.
              position: "insideBottomRight",
              fontSize: 11,
              fill: "var(--muted-foreground)",
              dy: 14,
              dx: -4,
            }}
          />

          <ChartTooltip
            cursor={{ strokeOpacity: 0.2 }}
            content={
              <ChartTooltipContent
                labelKey="when"
                formatter={(value, _name, item) => {
                  const row = item.payload as Step
                  return (
                    <div className="flex w-full flex-col gap-0.5">
                      {row.event && (
                        <p className="max-w-[24ch] text-muted-foreground">
                          {row.event}
                          {row.confidence === "medium" && " · timing uncertain"}
                        </p>
                      )}
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="text-muted-foreground">Paid out</span>
                        <span className="tabular-nums">
                          {row.amount ? sgdCompact(row.amount) : "—"}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="text-muted-foreground">Cash left</span>
                        <span className="font-medium tabular-nums">
                          {sgd(Number(value), 2)}
                        </span>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />

          {/* flat fill, not a gradient: it only says "this is the balance", and a
              gradient would imply the value varies down the band */}
          <Area
            type="step"
            dataKey="cash"
            stroke="var(--foreground)"
            strokeWidth={1.75}
            fill="var(--foreground)"
            fillOpacity={0.07}
            isAnimationActive={false}
            dot={{ r: 2.5, fill: "var(--foreground)", strokeWidth: 0 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ChartContainer>

      <div className="grid gap-x-10 gap-y-4 border-t pt-4 text-[0.8125rem] sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Cash at {AS_OF}</p>
          <p className="mt-1 text-xl leading-none font-medium tracking-tight tabular-nums">
            {sgd(LIQUIDITY.cash, 2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            Committed, next six months
          </p>
          <p className="mt-1 text-xl leading-none font-medium tracking-tight tabular-nums">
            {sgd(LIQUIDITY.committed, 2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            Below her minimum
          </p>
          <p className="mt-1 text-xl leading-none font-medium tracking-tight tabular-nums">
            {sgd(LIQUIDITY.gap, 2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export { LiquidityLadder }
