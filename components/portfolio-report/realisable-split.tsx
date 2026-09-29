import {
  BALANCE_SHEET,
  LIQUIDITY,
  pct,
  sgd,
} from "@/app/lab/portfolio-report/eleanor/data"

/**
 * The balance sheet cut by what can actually be sold, and then by what is already spent.
 *
 * Chapter 04 splits the same total by asset class; this splits it by realisability, which
 * is the finding in this section. Two levels rather than one chart: the upper bar is all
 * assets, and the lower bar expands only the realisable end of it — so the reader can see
 * that the small slice is itself mostly committed. A pie could not nest.
 */

const TOTAL = BALANCE_SHEET.totalAssets
const FREE = BALANCE_SHEET.liquid - LIQUIDITY.committed

const ILLIQUID = "color-mix(in oklab, var(--foreground) 82%, var(--background))"
const COMMITTED =
  "color-mix(in oklab, var(--foreground) 48%, var(--background))"
const UNCOMMITTED =
  "color-mix(in oklab, var(--foreground) 24%, var(--background))"

function RealisableSplit() {
  return (
    <div className="space-y-5">
      <div>
        <div
          className="flex h-2 w-full overflow-hidden rounded-full bg-foreground/8"
          role="img"
          aria-label={`Hard to sell ${pct(BALANCE_SHEET.illiquidShare, 1)}, can be sold ${pct(BALANCE_SHEET.liquid / TOTAL, 1)}`}
        >
          <div
            style={{
              flexBasis: `${(BALANCE_SHEET.illiquid / TOTAL) * 100}%`,
              backgroundColor: ILLIQUID,
            }}
          />
          <div
            style={{
              flexBasis: `${(BALANCE_SHEET.liquid / TOTAL) * 100}%`,
              backgroundColor: UNCOMMITTED,
            }}
          />
        </div>

        {/* The realisable end, expanded directly beneath the segment it expands —
            same width, same right edge, so the second bar reads as a zoom of the
            first rather than as a second measurement. */}
        <div
          className="mt-1.5 ml-auto flex h-2 overflow-hidden rounded-full bg-foreground/8"
          style={{ width: `${(BALANCE_SHEET.liquid / TOTAL) * 100}%` }}
          role="img"
          aria-label={`Of that, ${sgd(LIQUIDITY.committed, 2)} is committed and ${sgd(FREE, 2)} is not`}
        >
          <div
            style={{
              flexBasis: `${(LIQUIDITY.committed / BALANCE_SHEET.liquid) * 100}%`,
              backgroundColor: COMMITTED,
            }}
          />
          <div
            style={{
              flexBasis: `${(FREE / BALANCE_SHEET.liquid) * 100}%`,
              backgroundColor: UNCOMMITTED,
            }}
          />
        </div>
      </div>

      <dl className="grid gap-x-10 gap-y-3 text-[0.8125rem] sm:grid-cols-3">
        {[
          {
            swatch: ILLIQUID,
            label: "Cannot be sold this quarter",
            value: sgd(BALANCE_SHEET.illiquid),
            share: pct(BALANCE_SHEET.illiquidShare, 1),
            detail: "Four properties, four funds, one company stake",
          },
          {
            swatch: COMMITTED,
            label: "Can be sold, already promised",
            value: sgd(LIQUIDITY.committed, 2),
            share: pct(LIQUIDITY.committed / TOTAL, 1),
            detail: "The five dated payments above",
          },
          {
            swatch: UNCOMMITTED,
            label: "Can be sold, not promised",
            value: sgd(FREE, 2),
            share: pct(FREE / TOTAL, 1),
            detail: `Against the ${sgd(LIQUIDITY.reserve)} she wants to keep`,
          },
        ].map((row) => (
          <div key={row.label} className="border-t pt-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: row.swatch }}
              />
              {row.label}
            </dt>
            <dd className="mt-1.5 flex items-baseline gap-2">
              <span className="text-xl leading-none font-medium tracking-tight tabular-nums">
                {row.value}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">
                {row.share}
              </span>
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { RealisableSplit }
