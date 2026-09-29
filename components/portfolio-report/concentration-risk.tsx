import {
  LISTED,
  POSITIONS,
  TECHNOLOGY,
  pct,
  usd,
  weightOfListed,
} from "@/app/lab/portfolio-report/prashanth/data"
import { DEMO_TECHNOLOGY_BAND } from "@/app/lab/portfolio-report/prashanth/demo-data"
import { TargetRange } from "@/components/portfolio-report/target-range"

/**
 * Technology exposure inside the listed book, measured and placed against a band.
 *
 * The three names are listed because the aggregate is the finding but the names are the
 * decision: Apple, Microsoft and NVIDIA are US$14.3m between them, and the index fund
 * beside them holds more of the same three. The measurement is real; the band is not,
 * and says so.
 */

const TECHNOLOGY_NAMES = POSITIONS.filter(
  (position) => position.group === "Technology"
).sort((a, b) => b.marketValue - a.marketValue)

function ConcentrationRisk() {
  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
      <TargetRange
        value={TECHNOLOGY.weight}
        min={DEMO_TECHNOLOGY_BAND.min}
        max={DEMO_TECHNOLOGY_BAND.max}
        valueLabel={pct(TECHNOLOGY.weight, 1)}
        bandLabel={`${DEMO_TECHNOLOGY_BAND.label} ${Math.round(
          DEMO_TECHNOLOGY_BAND.min * 100
        )}–${Math.round(DEMO_TECHNOLOGY_BAND.max * 100)}% · ${
          DEMO_TECHNOLOGY_BAND.disclosure
        }`}
      />

      <div>
        <dl className="text-[0.8125rem]">
        {TECHNOLOGY_NAMES.map((position) => (
          <div
            key={position.ticker}
            className="flex items-baseline justify-between gap-4 border-b py-2"
          >
            <dt className="truncate">{position.name}</dt>
            <dd className="shrink-0 tabular-nums">
              <span className="text-muted-foreground">
                {usd(position.marketValue, 2)}
              </span>
              <span className="ml-3 inline-block w-12 text-right font-medium">
                {pct(weightOfListed(position.marketValue), 1)}
              </span>
            </dd>
          </div>
        ))}
        <div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground pt-2.5">
          <dt className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
            Technology
          </dt>
          <dd className="shrink-0 tabular-nums">
            <span className="text-muted-foreground">
              {usd(TECHNOLOGY.marketValue, 2)}
            </span>
            <span className="ml-3 inline-block w-12 text-right text-base font-medium">
              {pct(TECHNOLOGY.weight, 1)}
            </span>
          </dd>
        </div>
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Out of {usd(LISTED.marketValue, 2)} of listed holdings. The Vanguard
          S&amp;P 500 holding adds more of the same three companies on top, which
          this figure does not count.
        </p>
      </div>
    </div>
  )
}

export { ConcentrationRisk }
