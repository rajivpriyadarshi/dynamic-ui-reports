"use client"

import * as React from "react"

import {
  DIGITAL_HOLDINGS,
  LISTED,
  POSITIONS,
  PRIVATE_MARKS,
  pct,
  usd,
  usdCompact,
} from "@/app/lab/portfolio-report/prashanth/data"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * One analytical area, four ways of cutting it.
 *
 * The tabs do not reveal four sections; they change what the same ranked list measures.
 * Each lens states its own denominator, because they differ — the security and sector
 * lenses are shares of the US$25.2m listed book, the private and digital lenses are
 * shares of their own books.
 *
 * Currency and custodian would have been the obvious fifth and sixth lenses, and the
 * brief asked for them. His record does not break market values down that way, so they
 * are absent rather than estimated. The one custodian split that IS recorded — NVIDIA's
 * — gets its own exhibit below.
 */

type Row = { label: string; sublabel?: string; value: number; emphasis?: boolean }

const LENSES = [
  {
    id: "security",
    label: "Security",
    denominator: LISTED.marketValue,
    caption: "Share of US$25.2m of listed holdings",
    /** Rows are issuers, so each one has a logo to stand in for. */
    marks: true,
    rows: (): Row[] =>
      [...POSITIONS]
        .sort((a, b) => b.marketValue - a.marketValue)
        .map((position) => ({
          label: position.name,
          sublabel: position.ticker,
          value: position.marketValue,
          emphasis: position.ticker === "NVDA",
        })),
  },
  {
    id: "sector",
    label: "Sector",
    denominator: LISTED.marketValue,
    caption: "Share of US$25.2m of listed holdings",
    /** A sector is not a company and has no logo. No slot rather than an empty one. */
    marks: false,
    rows: (): Row[] => {
      const groups = new Map<string, number>()
      for (const position of POSITIONS) {
        groups.set(
          position.group,
          (groups.get(position.group) ?? 0) + position.marketValue
        )
      }
      return [...groups.entries()]
        .map(([label, value]) => ({
          label,
          value,
          emphasis: label === "Technology",
        }))
        .sort((a, b) => b.value - a.value)
    },
  },
  {
    id: "private",
    label: "Private",
    denominator: PRIVATE_MARKS.reduce((total, mark) => total + mark.value, 0),
    caption: "Share of US$2.4m of private holdings, revalued 13 August",
    marks: true,
    rows: (): Row[] =>
      PRIVATE_MARKS.map((mark) => ({ label: mark.name, value: mark.value })),
  },
  {
    id: "digital",
    label: "Digital",
    denominator: DIGITAL_HOLDINGS.reduce((total, h) => total + h.value, 0),
    caption: "Share of the US$3.5m digital book",
    marks: true,
    rows: (): Row[] =>
      DIGITAL_HOLDINGS.map((holding) => ({
        label: holding.name,
        value: holding.value,
      })),
  },
] as const

function ExposureLens() {
  const [lens, setLens] = React.useState<string>(LENSES[0].id)

  return (
    <Tabs value={lens} onValueChange={(value) => setLens(value as string)}>
      <TabsList variant="line" className="mb-6">
        {LENSES.map((item) => (
          <TabsTrigger key={item.id} value={item.id}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {LENSES.map((item) => {
        const rows = item.rows()
        const max = Math.max(...rows.map((row) => row.value))

        return (
          <TabsContent key={item.id} value={item.id} className="space-y-4">
            <p className="text-xs text-muted-foreground">{item.caption}</p>
            <dl className="space-y-0">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,9rem)_5.5rem_4.5rem] items-center gap-x-4 border-b py-2.5"
                >
                  <dt className="flex min-w-0 items-center gap-2.5">
                    {item.marks && (
                      <HoldingMark seed={row.sublabel ?? row.label} />
                    )}
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span
                        className={cn(
                          "truncate text-[0.8125rem]",
                          row.emphasis && "font-medium"
                        )}
                      >
                        {row.label}
                      </span>
                      {row.sublabel && (
                        <span className="shrink-0 font-mono text-[0.6875rem] text-muted-foreground">
                          {row.sublabel}
                        </span>
                      )}
                    </span>
                  </dt>
                  <dd
                    aria-hidden
                    className="flex h-1.5 items-center overflow-hidden rounded-full bg-muted"
                  >
                    <span
                      className={cn(
                        "h-full rounded-full",
                        row.emphasis ? "bg-foreground" : "bg-chart-3"
                      )}
                      style={{ width: `${(row.value / max) * 100}%` }}
                    />
                  </dd>
                  <dd className="text-right text-[0.8125rem] tabular-nums">
                    {usdCompact(row.value)}
                  </dd>
                  <dd
                    className={cn(
                      "text-right text-[0.8125rem] tabular-nums",
                      row.emphasis ? "font-medium" : "text-muted-foreground"
                    )}
                  >
                    {pct(row.value / item.denominator, 1)}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="text-xs text-muted-foreground tabular-nums">
              Total {usd(item.denominator, 2)}
            </p>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}

/**
 * Placeholder for a holding's logo — a letter-mark until real artwork is wired in.
 *
 * A hairline square rather than a filled tile: at 1.25rem it reads as an identifier sitting
 * beside the name, not as an icon competing with it. Deliberately not emphasised on the
 * emphasised row either — the name and the bar already carry that, and a third channel
 * saying the same thing is noise.
 *
 * To wire up real logos, swap the letter for an <img> at the same size and keep the border
 * as the frame; the slot is sized so the row height does not change.
 */
function HoldingMark({ seed }: { seed: string }) {
  return (
    <span
      aria-hidden
      data-slot="holding-mark"
      className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-foreground/15 font-mono text-[0.625rem] leading-none text-muted-foreground"
    >
      {seed.charAt(0).toUpperCase()}
    </span>
  )
}

export { ExposureLens }
