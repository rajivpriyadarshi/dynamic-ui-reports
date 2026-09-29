/**
 * Every position in the book against what the news feed had to say about it.
 *
 * The join is the whole product. A news feed sorted by ticker tells him there are fifty stories
 * about his holdings; ordering those holdings by weight instead shows that the feed's attention
 * and his exposure are close to inverted — the largest position in the book draws nothing, and
 * the loudest ticker is not the largest one.
 *
 * Two bars per row, sharing a scale, because that comparison is the finding: the filled bar is
 * the position's weight in the book, the outlined one is its share of the feed. Where the second
 * overruns the first the feed is over-attentive; where it is absent the feed is silent. A single
 * number in a column would state the same thing and would not be read.
 *
 * Positions with no coverage are kept in place, at their real weight, rather than dropped to a
 * footnote. Dropping them is exactly the error the component exists to prevent.
 *
 * No headline per row. An earlier version named a lead story for each position and there is no
 * defensible rule for which one that is: ranked by relevance it named a withdrawn lawsuit as
 * Apple's story, ranked by score it named an opinion column, and both contradicted the ranked
 * briefing further up the page. The stories are ranked once, there. This table counts coverage.
 */

export type CoverageRow = {
  ticker: string
  name: string
  /** Share of the listed book by market value. */
  weight: number
  /** Share of the feed's items that mention this position. */
  attention: number
  items: number
  reports: number
  /** Relevance-weighted mean sentiment over first reports only, or null where there are none. */
  sentiment: number | null
  band: string | null
}

function BookCoverage({ rows }: { rows: CoverageRow[] }) {
  /** One scale across both bars and all rows, or the comparison means nothing. */
  const scale = Math.max(...rows.flatMap((row) => [row.weight, row.attention]))

  return (
    <div>
      <div className="flex items-baseline gap-6 border-b pb-2.5 font-mono text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase">
        <span className="min-w-0 flex-1">Position</span>
        <span className="w-[11rem] shrink-0">Weight vs. attention</span>
        <span className="w-16 shrink-0 text-right">Items</span>
        <span className="w-24 shrink-0 text-right">On the company</span>
      </div>

      {rows.map((row) => (
        <article key={row.ticker} className="border-b py-5">
          <div className="flex items-baseline gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-[0.8125rem] font-medium">
                  {row.ticker}
                </span>
                <span className="truncate text-[0.8125rem] text-muted-foreground">
                  {row.name}
                </span>
              </div>
            </div>

            <div className="w-[11rem] shrink-0 space-y-1 pt-0.5">
              <Bar fraction={row.weight / scale} filled />
              <Bar fraction={row.attention / scale} />
            </div>

            <span className="w-16 shrink-0 text-right text-[0.9375rem] tabular-nums">
              {row.items}
            </span>

            <span className="w-24 shrink-0 text-right text-[0.9375rem] tabular-nums">
              {row.reports > 0 ? row.reports : "—"}
            </span>
          </div>

          <div className="mt-2.5">
            {row.sentiment !== null && row.band ? (
              <p className="text-xs text-muted-foreground">
                Sentiment on those reports{" "}
                <span className="text-foreground tabular-nums">
                  {row.sentiment >= 0 ? "+" : "−"}
                  {Math.abs(row.sentiment).toFixed(2)}
                </span>{" "}
                · {row.band}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                {row.items === 0
                  ? "Nothing in the feed mentions it."
                  : "Mentioned, never reported on."}
              </p>
            )}
          </div>
        </article>
      ))}

      <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.6875rem] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-1.5 w-6 bg-foreground" />
          Share of the book
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-6 border border-foreground/40 bg-transparent"
          />
          Share of the feed
        </span>
      </p>
    </div>
  )
}

/**
 * Zero is a real answer here, so the track is always drawn and the fill is omitted entirely
 * rather than set to zero width — an outlined element at zero width still paints both of its
 * borders, which reads as a small value instead of none.
 */
function Bar({ fraction, filled }: { fraction: number; filled?: boolean }) {
  return (
    <div aria-hidden className="h-1.5 w-full bg-foreground/[0.06]">
      {fraction > 0 && (
        <div
          className={filled ? "h-full bg-foreground" : "h-full border border-foreground/40"}
          style={{ width: `${fraction * 100}%` }}
        />
      )}
    </div>
  )
}

export { BookCoverage }
