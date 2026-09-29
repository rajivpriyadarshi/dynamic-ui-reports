"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/**
 * A securities book in full — the evidence behind the figures above it.
 *
 * Few enough rows for no pagination and no filtering; sorting is the one control that
 * earns its place, because the reader arrives here wanting either the largest position or
 * the largest gain. Set small and tight on purpose: this is the appendix, not the
 * argument.
 *
 * `ticker` is optional. Prashanth holds single securities and an index fund, so each row
 * has one; Eleanor holds four managed mandates, which have names and no symbols, and the
 * column simply does not render for her.
 */

export type HoldingRow = {
  name: string
  ticker?: string
  group: string
  marketValue: number
  cost: number
  gain: number
}

type SortKey = "marketValue" | "cost" | "gain"

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "marketValue", label: "Market value" },
  { key: "cost", label: "Cost" },
  { key: "gain", label: "Unrealised" },
]

function HoldingsTable({
  holdings,
  currency,
  totalLabel,
}: {
  holdings: readonly HoldingRow[]
  /**
   * The unit prefix, not a formatter. This is a client component, so a function prop
   * would have to cross the server boundary — a string cannot.
   */
  currency: string
  /** What the footer row is called — "Listed book", "Managed portfolio". */
  totalLabel: string
}) {
  const money = (millions: number) => `${currency}${millions.toFixed(2)}m`

  const [sort, setSort] = React.useState<SortKey>("marketValue")

  const rows = React.useMemo(
    () => [...holdings].sort((a, b) => b[sort] - a[sort]),
    [holdings, sort]
  )

  const total = React.useMemo(
    () => ({
      marketValue: holdings.reduce((sum, row) => sum + row.marketValue, 0),
      cost: holdings.reduce((sum, row) => sum + row.cost, 0),
      gain: holdings.reduce((sum, row) => sum + row.gain, 0),
    }),
    [holdings]
  )

  return (
    <Table className="text-[0.8125rem]">
      <TableHeader>
        <TableRow>
          <TableHead className="h-9">Holding</TableHead>
          <TableHead className="h-9">Class</TableHead>
          <TableHead className="h-9 text-right">Weight</TableHead>
          {COLUMNS.map((column) => (
            <TableHead key={column.key} className="h-9 p-0 text-right">
              <button
                type="button"
                onClick={() => setSort(column.key)}
                aria-pressed={sort === column.key}
                className={cn(
                  "inline-flex h-9 w-full items-center justify-end gap-1 px-2 whitespace-nowrap transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  sort === column.key && "text-foreground"
                )}
              >
                {column.label}
                {sort === column.key ? (
                  <ChevronDown className="size-3" />
                ) : (
                  <ChevronUp className="size-3 opacity-0" />
                )}
              </button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell className="py-2">
              <span className="font-medium">{row.name}</span>
              {row.ticker && (
                <span className="ml-2 font-mono text-[0.6875rem] text-muted-foreground">
                  {row.ticker}
                </span>
              )}
            </TableCell>
            <TableCell className="py-2 text-muted-foreground">
              {row.group}
            </TableCell>
            <TableCell className="py-2 text-right tabular-nums">
              {((row.marketValue / total.marketValue) * 100).toFixed(1)}%
            </TableCell>
            <TableCell className="py-2 text-right tabular-nums">
              {money(row.marketValue)}
            </TableCell>
            <TableCell className="py-2 text-right text-muted-foreground tabular-nums">
              {money(row.cost)}
            </TableCell>
            <TableCell className="py-2 text-right tabular-nums">
              {row.gain === 0 ? "—" : money(row.gain)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell className="py-2 font-medium">{totalLabel}</TableCell>
          <TableCell className="py-2" />
          <TableCell className="py-2 text-right tabular-nums">100.0%</TableCell>
          <TableCell className="py-2 text-right font-medium tabular-nums">
            {money(total.marketValue)}
          </TableCell>
          <TableCell className="py-2 text-right tabular-nums">
            {money(total.cost)}
          </TableCell>
          <TableCell className="py-2 text-right font-medium tabular-nums">
            {money(total.gain)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export { HoldingsTable }
