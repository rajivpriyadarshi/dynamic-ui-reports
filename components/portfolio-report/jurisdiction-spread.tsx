import {
  BALANCE_SHEET,
  CLIENT,
  JURISDICTIONS,
  JURISDICTION_UNSTATED,
  pct,
  sgd,
} from "@/app/lab/portfolio-report/eleanor/data"

/**
 * Where the balance sheet sits, by country.
 *
 * The finding is that neither her nationality nor her residence is where most of the
 * money is: she is British and lives in Singapore, and the United Kingdom carries more
 * than either the residence or the portfolio — property in two cities, the manufacturing
 * stake, one fund and one bank account.
 *
 * Rows rather than a stacked bar, because this sits in a narrow column beside the
 * readout and a single 116m bar cut five ways would be unreadable at that width. Every
 * bar is the same weight: length already carries the quantity, so shading them as well
 * would say it twice.
 *
 * The last row is the managed portfolio, which her file places nowhere. It is drawn as a
 * rule rather than a bar for the same reason the unattributed branch in chapter 04 is
 * labelled "no entity recorded" — the absence is the value.
 */

const TOTAL = BALANCE_SHEET.totalAssets

/*
 * `lg:pt-1` drops the eyebrow onto the narrative's first baseline: the two columns
 * share a top edge, but 11px uppercase and 16px body text do not share a first
 * baseline without it.
 */
function JurisdictionSpread() {
  return (
    <div className="lg:pt-1">
      <p className="text-[0.6875rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
        Where it sits
      </p>

      <dl className="mt-5 space-y-4">
        {JURISDICTIONS.map((row) => (
          <div key={row.country}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[0.8125rem]">{row.name}</dt>
              <dd className="flex shrink-0 items-baseline gap-2">
                {/* Fixed width, not just right-aligned: "S$50.5m" and "S$8.4m"
                    are different lengths, so without a box the figures end in a
                    column but start in a ragged edge. */}
                <span className="w-[4.5rem] text-right text-[0.9375rem] leading-none font-medium tracking-tight tabular-nums">
                  {sgd(row.value)}
                </span>
                <span className="w-[2.75rem] text-right text-xs text-muted-foreground tabular-nums">
                  {pct(row.value / TOTAL, 1)}
                </span>
              </dd>
            </div>
            {/* Scaled to the S$116.0m total, not to the largest country, and on a
                track so the empty part of each row is visible. Scaled to the
                widest bar instead, the United Kingdom would fill the column and
                read as all of it rather than as 43.5% of it. */}
            <dd className="mt-2 h-1.5 w-full bg-foreground/8">
              <div
                className="h-full bg-foreground/85"
                style={{ width: `${(row.value / TOTAL) * 100}%` }}
              />
            </dd>
          </div>
        ))}

        <div className="border-t border-foreground/20 pt-4">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-[0.8125rem] text-muted-foreground">
              No location recorded
            </dt>
            <dd className="flex shrink-0 items-baseline gap-2">
              <span className="w-[4.5rem] text-right text-[0.9375rem] leading-none font-medium tracking-tight text-muted-foreground tabular-nums">
                {sgd(JURISDICTION_UNSTATED)}
              </span>
              <span className="w-[2.75rem] text-right text-xs text-muted-foreground tabular-nums">
                {pct(JURISDICTION_UNSTATED / TOTAL, 1)}
              </span>
            </dd>
          </div>
          {/* The track with nothing in it: the row keeps its place in the scale,
              and the empty bar is the point. */}
          <dd className="mt-2 h-1.5 w-full border border-dashed border-foreground/25" />
          <dd className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
            The managed portfolio. UBS is named as the custodian, but no country
            is.
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        {CLIENT.nationality} national, resident in {CLIENT.jurisdiction} — and
        neither is where most of it is.
      </p>
    </div>
  )
}

export { JurisdictionSpread }
