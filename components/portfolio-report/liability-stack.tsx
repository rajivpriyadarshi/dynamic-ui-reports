import {
  BALANCE_SHEET,
  CLIENT,
  FACILITIES,
  usd,
  usdCompact,
} from "@/app/lab/portfolio-report/prashanth/data"

/**
 * What he owes, ranked, with the price of each and the one that is not on the sheet.
 *
 * A ledger rather than a chart: four lines, two of which have an interest rate and two of
 * which do not, and the rate is the column that makes the exhibit worth including. A bar
 * chart of four amounts would rank them and say nothing about cost.
 *
 * The guarantee is set below the total rule, outside the arithmetic, because that is
 * exactly where it sits on the balance sheet.
 */

const PRICED = FACILITIES.filter((row) => row.rate !== null)
const TOTAL = FACILITIES.reduce((sum, row) => sum + row.value, 0)

function LiabilityStack() {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_4rem_6rem] gap-x-6 border-b pb-2 text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground uppercase">
        <span>Obligation</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Balance</span>
      </div>

      {[...FACILITIES]
        .sort((a, b) => b.value - a.value)
        .map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-[minmax(0,1fr)_4rem_6rem] items-baseline gap-x-6 border-b border-dotted py-3"
          >
            <span className="min-w-0">
              <span className="text-[0.8125rem]">{row.name}</span>
              {row.counterparty && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {row.counterparty}
                </span>
              )}
            </span>
            <span className="text-right font-mono text-xs tabular-nums">
              {row.rate ?? (
                <span className="text-muted-foreground/50" aria-label="no rate">
                  —
                </span>
              )}
            </span>
            <span className="text-right text-[0.8125rem] tabular-nums">
              {usdCompact(row.value)}
            </span>
          </div>
        ))}

      <div className="grid grid-cols-[minmax(0,1fr)_4rem_6rem] items-baseline gap-x-6 border-t-2 border-foreground pt-3">
        <span className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
          Total borrowing
        </span>
        <span />
        <span className="text-right text-xl leading-none font-medium tracking-tight tabular-nums">
          {usd(TOTAL, 2)}
        </span>
      </div>

      {/* below the line, because it is below the line */}
      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_4rem_6rem] items-baseline gap-x-6">
        <span className="text-[0.8125rem] text-muted-foreground">
          Guarantee from {CLIENT.entity} to LGT — off balance sheet
        </span>
        <span />
        <span className="text-right text-[0.8125rem] text-muted-foreground tabular-nums">
          {usd(BALANCE_SHEET.guaranteeOffBalanceSheet, 2)}
        </span>
      </div>

      <p className="mt-7 max-w-[64ch] text-[0.9375rem] leading-[1.7] text-foreground/85">
        The expensive money is the smallest line. The {PRICED[1].rate}{" "}
        {PRICED[1].name.toLowerCase()} at {PRICED[1].counterparty} is{" "}
        {usdCompact(PRICED[1].value)}, secured against the very holdings this
        report says are too concentrated. The shares he would sell to fix the
        concentration are the shares holding up the loan.
      </p>
    </div>
  )
}

export { LiabilityStack }
