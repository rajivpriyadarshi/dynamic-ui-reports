"use client"

import * as React from "react"

import {
  BY_CUSTODIAN,
  POSITIONS,
  pct,
  usd,
  usdCompact,
  weightOfListed,
} from "@/app/lab/portfolio-report/prashanth/data"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

/**
 * The same holding, seen from four custody statements and then added up.
 *
 * This is the exhibit the 7 August review turned on: no single mandate shows NVIDIA at
 * US$3.6m, because each custodian only reports its own slice — the largest of which is
 * a third of the position. The sum rule at the bottom is the whole point, so it is set
 * like the total on an invoice rather than shown as another chart.
 *
 * Every split here is recorded: all four statements carry all five lines, so the
 * pattern holds for whichever holding is selected.
 */

const SECURITIES = POSITIONS.filter((position) => position.ticker in BY_CUSTODIAN)
  .map((position) => ({
    ticker: position.ticker,
    split: BY_CUSTODIAN[position.ticker as keyof typeof BY_CUSTODIAN],
  }))
  /** NVIDIA first: it is the position the review looked through. */
  .sort((a, b) => Number(b.ticker === "NVDA") - Number(a.ticker === "NVDA"))

function LookThroughExposure() {
  const [ticker, setTicker] = React.useState<string>("NVDA")
  const security = SECURITIES.find((item) => item.ticker === ticker)!
  const position = POSITIONS.find((item) => item.ticker === ticker)!
  const split = [...security.split].sort((a, b) => b.amount - a.amount)
  const total = split.reduce((sum, row) => sum + row.amount, 0)
  const largest = split[0]

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          One position, as each custodian reports it
        </p>
        <ToggleGroup
          size="sm"
          spacing={0}
          variant="outline"
          aria-label="Security"
          value={[ticker]}
          onValueChange={(value) => {
            const next = value[0] as string | undefined
            if (next) setTicker(next)
          }}
        >
          {SECURITIES.map((item) => (
            <ToggleGroupItem
              key={item.ticker}
              value={item.ticker}
              className="px-3 font-mono text-xs"
            >
              {item.ticker}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div>
        {split.map((row) => (
          <div
            key={row.custodian}
            className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_6rem] items-center gap-x-5 border-b border-dotted py-3"
          >
            <span className="truncate text-[0.8125rem] text-muted-foreground">
              {row.custodian}
            </span>
            <span aria-hidden className="flex items-center">
              <span
                className="h-[3px] bg-foreground/40"
                style={{ width: `${(row.amount / total) * 100}%` }}
              />
            </span>
            <span className="text-right text-[0.8125rem] tabular-nums">
              {usdCompact(row.amount)}
            </span>
          </div>
        ))}

        <div className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_6rem] items-baseline gap-x-5 border-t-2 border-foreground pt-3">
          <span className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
            Total {position.ticker}
          </span>
          <span className="text-xs text-muted-foreground">
            {position.name} · {pct(weightOfListed(position.marketValue), 1)} of
            listed holdings
          </span>
          <span className="text-right text-xl leading-none font-medium tracking-tight tabular-nums">
            {usd(total, 2)}
          </span>
        </div>
      </div>

      <p className="max-w-[62ch] text-[0.9375rem] leading-[1.7] text-foreground/85">
        The largest single custody line is {largest.custodian} at{" "}
        {usdCompact(largest.amount)} —{" "}
        {pct(largest.amount / total, 0)} of the position. Reviewed one statement
        at a time, {position.ticker} never looks like a concentration.
      </p>

    </div>
  )
}

export { LookThroughExposure }
