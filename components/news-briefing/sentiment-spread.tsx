/**
 * Why the average is the wrong statistic for this feed.
 *
 * Every figure sits on the vendor's own sentiment scale with the vendor's own band boundaries
 * ruled across it, so the conclusion is not asserted: the six reports of the patent verdict all
 * land in Bearish, and the average over all fifty items lands in Neutral. Nothing about Apple
 * changed between those two numbers — twenty-four filing notices outvoted the largest patent
 * award in US history.
 *
 * One track per row rather than one shared number line. A single line was tried first and it
 * failed: with four band boundaries, four aggregates and six individual reports on one axis,
 * no mark could be attributed to the label that owned it. Giving each figure its own track
 * turns the divergence into vertical displacement, which is the thing worth seeing, and the
 * boundaries stay in the same place down the column so they still read as one scale.
 *
 * Not a chart component. There is one dimension and four thresholds; an axis, a plot area and a
 * legend would be furniture around something a ruled line states exactly.
 */

/** Transcribed from the payload's own `sentiment_score_definition`. */
const BOUNDARIES = [-0.35, -0.15, 0.15, 0.35]
const DOMAIN = { min: -0.75, max: 0.55 }

/** Band name and the midpoint of the band, for the header strip. */
const BAND_LABELS = [
  { label: "Bearish", at: -0.55 },
  { label: "Sw. bearish", at: -0.25 },
  { label: "Neutral", at: 0 },
  { label: "Sw. bullish", at: 0.25 },
  { label: "Bullish", at: 0.45 },
]

const position = (score: number) =>
  ((score - DOMAIN.min) / (DOMAIN.max - DOMAIN.min)) * 100

export type SpreadMark = {
  id: string
  score: number
  label: string
  emphasis?: boolean
}

export type ClusterReport = {
  source: string
  at: string
  sentiment: number
  label: string
}

/** The ruled scale every row shares. Drawn once per track so the verticals line up down the page. */
function Track({ score, emphasis }: { score: number; emphasis?: boolean }) {
  return (
    <div aria-hidden className="relative h-4 w-full">
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-foreground/[0.09]" />
      {BOUNDARIES.map((boundary) => (
        <span
          key={boundary}
          className="absolute inset-y-0 w-px bg-foreground/[0.14]"
          style={{ left: `${position(boundary)}%` }}
        />
      ))}
      <span
        className={
          emphasis
            ? "absolute inset-y-0 w-0.5 -translate-x-px bg-foreground"
            : "absolute inset-y-[0.1875rem] w-0.5 -translate-x-px bg-foreground/55"
        }
        style={{ left: `${position(score)}%` }}
      />
    </div>
  )
}

const signed = (score: number) =>
  `${score >= 0 ? "+" : "−"}${Math.abs(score).toFixed(2)}`

function SentimentSpread({
  marks,
  reports,
  clusterLabel,
  award,
}: {
  /** The aggregates, ordered so the divergence reads top to bottom. */
  marks: SpreadMark[]
  /** The individual reports of the one story, on the same scale. */
  reports: ClusterReport[]
  clusterLabel: string
  award: string
}) {
  const spread =
    Math.max(...reports.map((report) => report.sentiment)) -
    Math.min(...reports.map((report) => report.sentiment))

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-baseline gap-5 pb-1.5">
          <span className="w-[17rem] shrink-0" />
          <div className="relative hidden h-3.5 min-w-0 flex-1 sm:block">
            {BAND_LABELS.map((band) => (
              <span
                key={band.label}
                className="absolute -translate-x-1/2 font-mono text-[0.5625rem] tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase"
                style={{ left: `${position(band.at)}%` }}
              >
                {band.label}
              </span>
            ))}
          </div>
          <span className="w-14 shrink-0" />
        </div>

        <dl>
          {marks.map((mark) => (
            <div
              key={mark.id}
              className="flex items-center gap-5 border-t py-3 last:border-b"
            >
              <dt
                className={
                  mark.emphasis
                    ? "w-[17rem] shrink-0 text-[0.8125rem] leading-snug font-medium"
                    : "w-[17rem] shrink-0 text-[0.8125rem] leading-snug text-muted-foreground"
                }
              >
                {mark.label}
              </dt>
              <dd className="hidden min-w-0 flex-1 sm:block">
                <Track score={mark.score} emphasis={mark.emphasis} />
              </dd>
              <dd
                className={
                  mark.emphasis
                    ? "w-14 shrink-0 text-right text-[0.9375rem] font-medium tabular-nums"
                    : "w-14 shrink-0 text-right text-[0.9375rem] tabular-nums"
                }
              >
                {signed(mark.score)}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h3 className="max-w-[48ch] text-base leading-snug font-medium tracking-tight">
          {clusterLabel}: {award}, and {reports.length} separate reports of it
        </h3>
        <p className="mt-2 max-w-[60ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
          One event. Every newsroom scores it Bearish and none of them agree how
          Bearish — a spread of {spread.toFixed(2)} on the same facts. Counted as{" "}
          {reports.length} items it dominates any measure of volume; averaged
          against the filings it disappears.
        </p>

        <ul className="mt-6">
          {reports.map((report) => (
            <li
              key={report.source}
              className="flex items-center gap-5 border-t py-2.5 last:border-b"
            >
              {/* Source and time are split so a long masthead truncates and the
                  dateline never does — the timestamps also then align down the list. */}
              <span className="flex w-[17rem] shrink-0 items-baseline gap-2 font-mono text-[0.6875rem] text-muted-foreground">
                <span className="min-w-0 flex-1 truncate">{report.source}</span>
                <span className="shrink-0">{report.at}</span>
              </span>
              <span className="hidden min-w-0 flex-1 sm:block">
                <Track score={report.sentiment} />
              </span>
              <span className="w-14 shrink-0 text-right text-[0.8125rem] tabular-nums">
                {signed(report.sentiment)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { SentimentSpread }
