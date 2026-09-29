import {
  AS_OF,
  AS_OF_ISO,
  COMMITMENTS,
  STALE_THRESHOLD_MONTHS,
  VALUATION_AGE,
} from "@/app/lab/portfolio-report/eleanor/data"

/**
 * When every figure in this report was measured, and when the dated obligations fall.
 *
 * A balance sheet stated "as at 30 June 2026" is really a set of marks taken on seven
 * different days across fifteen months, and this places them on one axis: measurements
 * above the line, obligations below it, and the reference date as the rule between. It is
 * the report's own provenance, which is why it sits in the basis of preparation rather
 * than in the analysis.
 *
 * Deliberately unquantified — every tick is the same height. Chapter 05 already encodes
 * how much money each stale mark carries; repeating that here would say it twice and
 * would bury the one thing this exhibit is for, which is the spread of the dates.
 */

const at = (iso: string) => Date.parse(iso)

const MEASURED = [
  ...VALUATION_AGE.map((row) => ({
    name: row.name,
    iso: row.iso,
    on: row.valuedOn,
  })),
  { name: "Bank and custody balances", iso: AS_OF_ISO, on: AS_OF },
]

const OLDEST_MONTHS = Math.max(...VALUATION_AGE.map((row) => row.months))

/** One tick per date, not per figure: four of the marks were taken on 30 June. */
const DATES = [...new Set(MEASURED.map((row) => row.iso))].sort()

const OLDEST = MEASURED.reduce((oldest, row) =>
  at(row.iso) < at(oldest.iso) ? row : oldest
)

const FIRST_DUE = COMMITMENTS[0]
const LAST_DUE = COMMITMENTS[COMMITMENTS.length - 1]

const START = at(OLDEST.iso)
const END = at(LAST_DUE.iso)

const x = (iso: string) => ((at(iso) - START) / (END - START)) * 100

/** Half-year marks only, and none at the very end, where the label would overhang. */
const YEARS = ["2025-07-01", "2026-01-01", "2026-07-01"]
const yearLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" })

function AsAtMap() {
  return (
    <div>
      <div
        className="relative h-[116px]"
        role="img"
        aria-label={`${DATES.length} measurement dates between ${OLDEST.iso} and ${AS_OF_ISO}, and ${COMMITMENTS.length} dated payments between ${FIRST_DUE.on} and ${LAST_DUE.on}`}
      >
        {/* The spine. Not `border` — that token is invisible on white, and the
            caption depends on there being a line to be above and below. */}
        <div className="absolute inset-x-0 top-[3.25rem] border-t border-foreground/25" />

        {/* the date the balance sheet is stated at */}
        <div
          className="absolute top-2 bottom-8 w-px bg-foreground"
          style={{ left: `${x(AS_OF_ISO)}%` }}
        />

        {/* measurements, above the line and the longer of the two, because they are
            what the balance sheet is actually made of */}
        {DATES.map((iso) => (
          <div
            key={iso}
            className="absolute top-[2rem] h-[1.25rem] w-px bg-foreground/50"
            style={{ left: `${x(iso)}%` }}
          />
        ))}

        {/* obligations, below it and shorter: they are not measurements */}
        {COMMITMENTS.map((row) => (
          <div
            key={row.iso}
            className="absolute top-[3.25rem] h-[0.625rem] w-px bg-foreground/30"
            style={{ left: `${x(row.iso)}%` }}
          />
        ))}

        <p className="absolute top-0 left-0 text-[0.6875rem] text-muted-foreground">
          Oldest valuation · {OLDEST.on} · {OLDEST.name}
        </p>
        <p
          className="absolute top-0 -translate-x-full pr-2.5 text-right text-[0.6875rem] font-medium"
          style={{ left: `${x(AS_OF_ISO)}%` }}
        >
          Stated as at {AS_OF}
        </p>
        {/* One label for the five, at the right-hand end: naming each of them here
            would repeat the schedule in chapter 06. */}
        <p className="absolute top-[4.375rem] right-0 text-right text-[0.6875rem] text-muted-foreground">
          {COMMITMENTS.length} dated payments · {FIRST_DUE.on} to {LAST_DUE.on}
        </p>

        {/* the calendar, understated: this is a ruler, not a series */}
        <div className="absolute inset-x-0 bottom-0 h-4">
          {YEARS.map((iso) => (
            <span
              key={iso}
              className="absolute text-[0.625rem] text-muted-foreground tabular-nums"
              style={{ left: `${x(iso)}%` }}
            >
              {yearLabel(iso)}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {DATES.length} measurement dates sit behind this balance sheet, spread
        over {OLDEST_MONTHS} months; past {STALE_THRESHOLD_MONTHS} months her
        file counts a valuation as stale. Below the line are the{" "}
        {COMMITMENTS.length} dated payments — the only figures here that look
        forward rather than back.
      </p>
    </div>
  )
}

export { AsAtMap }
