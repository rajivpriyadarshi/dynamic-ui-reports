"use client"

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  BALANCE_SHEET,
  LIFESTYLE,
  LIFESTYLE_ASSETS,
  pct,
  signedPct,
  usd,
  usdCompact,
} from "@/app/lab/portfolio-report/prashanth/data"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * The used assets, measured the only way that makes them interesting: against cost.
 *
 * Every other exhibit in this report ranks holdings by size. Size is the wrong question
 * here — the yacht is the largest of these and the reason the group looks bad, but the
 * pattern is that the things with engines have lost money and the things in cases have
 * made it. So this is a diverging bar off a zero rule, which is a shape that answers
 * "which way" before it answers "how much".
 *
 * Two shades only, and they are not decorative: they separate the two kinds, which is the
 * whole finding. Hover gives the market value and the cost behind each percentage.
 */

const CHART_CONFIG = {
  change: { label: "Change on cost" },
} satisfies ChartConfig

/** `signedPct` takes percentage points; everything here is a fraction. */
const signed = (fraction: number) => signedPct(fraction * 100)

const VEHICLE = "color-mix(in oklab, var(--foreground) 78%, var(--background))"
const COLLECTIBLE = "color-mix(in oklab, var(--foreground) 34%, var(--background))"

const DATA = [...LIFESTYLE_ASSETS]
  .sort((a, b) => b.value / b.cost - a.value / a.cost)
  .map((item) => ({
    name: item.name,
    kind: item.kind,
    change: item.value / item.cost - 1,
    value: item.value,
    cost: item.cost,
  }))

const EXTENT = Math.max(...DATA.map((row) => Math.abs(row.change)))

function LifestyleAssets() {
  return (
    <div className="space-y-8">
      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[224px] w-full"
      >
        <BarChart
          data={DATA}
          layout="vertical"
          margin={{ top: 4, right: 44, bottom: 0, left: 4 }}
          barSize={16}
        >
          <XAxis
            type="number"
            // Slack on both ends so the value labels have somewhere to sit.
            domain={[-EXTENT * 1.35, EXTENT * 1.25]}
            hide
          />
          <YAxis
            type="category"
            dataKey="name"
            width={168}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickMargin={8}
          />
          <ReferenceLine
            x={0}
            stroke="var(--foreground)"
            strokeOpacity={0.35}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelKey="name"
                formatter={(value, _name, item) => {
                  const row = item.payload as (typeof DATA)[number]
                  return (
                    <div className="flex w-full flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="text-muted-foreground">
                          Now / at cost
                        </span>
                        <span className="tabular-nums">
                          {usdCompact(row.value)} / {usdCompact(row.cost)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-6">
                        <span className="text-muted-foreground">
                          Change on cost
                        </span>
                        <span className="font-medium tabular-nums">
                          {signed(Number(value))}
                        </span>
                      </div>
                    </div>
                  )
                }}
              />
            }
          />
          <Bar dataKey="change" isAnimationActive={false} radius={1}>
            {DATA.map((row) => (
              <Cell
                key={row.name}
                fill={row.kind === "vehicle" ? VEHICLE : COLLECTIBLE}
              />
            ))}
            {/* On the page, not only on hover: this reads as a printed exhibit.
                Each label sits at the far end of its own bar, so it falls outside
                the bar on both sides of zero rather than piling up on the rule. */}
            <LabelList
              dataKey="change"
              content={({ x, y, width, height, value }) => {
                const change = Number(value)
                // Recharts reports a negative width for bars left of zero, so the
                // edges have to be derived rather than read off x and width.
                const a = Number(x)
                const b = a + Number(width)
                const positive = change >= 0
                return (
                  <text
                    x={positive ? Math.max(a, b) + 8 : Math.min(a, b) - 8}
                    y={Number(y) + Number(height) / 2}
                    textAnchor={positive ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={11}
                    fill="var(--muted-foreground)"
                    className="tabular-nums"
                  >
                    {signed(change)}
                  </text>
                )
              }}
            />
          </Bar>
        </BarChart>
      </ChartContainer>

      <dl className="grid gap-x-10 gap-y-4 text-[0.8125rem] sm:grid-cols-3">
        {[
          {
            label: "Vehicles",
            group: LIFESTYLE.vehicles,
            swatch: VEHICLE,
          },
          {
            label: "Collectibles",
            group: LIFESTYLE.collectibles,
            swatch: COLLECTIBLE,
          },
          {
            label: "All lifestyle assets",
            group: LIFESTYLE,
            swatch: null,
          },
        ].map((row) => (
          <div key={row.label} className="border-t pt-3">
            <dt className="flex items-center gap-2 text-xs text-muted-foreground">
              {row.swatch && (
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: row.swatch }}
                />
              )}
              {row.label}
            </dt>
            <dd className="mt-1.5 text-xl leading-none font-medium tracking-tight tabular-nums">
              {signed(row.group.change)}
            </dd>
            <dd className="mt-1.5 text-xs text-muted-foreground tabular-nums">
              {usd(row.group.value, 2)} against {usd(row.group.cost, 2)} paid
            </dd>
          </div>
        ))}
      </dl>

      <p className="max-w-[64ch] text-[0.9375rem] leading-[1.7] text-foreground/85">
        As a group these are {signed(LIFESTYLE.change)} on cost, which is
        unremarkable until it is split: the vehicles are{" "}
        {signed(LIFESTYLE.vehicles.change)} and the collectibles are{" "}
        {signed(LIFESTYLE.collectibles.change)}. Nothing here is held to
        compound, so neither number is a performance result — but{" "}
        {usd(LIFESTYLE.value, 2)} is {pct(LIFESTYLE.value / BALANCE_SHEET.totalAssets, 1)} of total
        assets, which is enough that it should not be absent from the balance
        sheet discussion. {LIFESTYLE.excluded} and therefore excluded above.
      </p>
    </div>
  )
}

export { LifestyleAssets }
