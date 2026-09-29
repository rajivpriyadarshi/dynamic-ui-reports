import {
  ACTIONS,
  ATTRIBUTION,
  ATTRIBUTION_SPLIT,
  ATTRIBUTION_TOTAL,
  CHANGES,
  COMPLETED,
  COVER,
  DECISIONS,
  DISCREPANCIES,
  FOCUS,
  NOT_ON_FILE,
  PORTFOLIO,
  SOURCES,
  SOURCE_NOTE,
  TECHNOLOGY,
  UPCOMING,
  USES,
  pct,
  sgd,
  sgdCompact,
  sgdExact,
  signedPct,
  signedPp,
} from "./data"
import {
  Chapter,
  Eyebrow,
  Figure,
  Narrative,
} from "@/components/portfolio-report/chapter"
import { ChangeLedger } from "@/components/portfolio-report/change-ledger"
import { ConcentrationShift } from "@/components/portfolio-report/concentration-shift"
import { DecisionList } from "@/components/portfolio-report/decision-list"
import { EventTimeline } from "@/components/portfolio-report/event-timeline"
import { LiquidityCover } from "@/components/portfolio-report/liquidity-cover"
import { ReadoutMetrics } from "@/components/portfolio-report/readout-metrics"
import { ReturnAttribution } from "@/components/portfolio-report/return-attribution"
import { Separator } from "@/components/ui/separator"

/**
 * A report written from a single review note.
 *
 * The other two reports in this lab are written from complete client files. This one has a
 * one-page summary and nothing else, which changes the report rather than merely shortening
 * it:
 *
 *   — There is no chapter on what the client owns. The note carries no holdings, no cost
 *     basis and one allocation weight, so an inventory chapter would be a heading over an
 *     empty table. It is omitted, and its absence is stated at the end rather than padded.
 *
 *   — The masthead cannot name the client or date the report, because the note does neither.
 *     "As at —" is the honest version of a field that usually carries a date.
 *
 *   — The source disagrees with itself twice, in the two most prominent numbers on it. Both
 *     are shown at the point a reader would rely on them. Picking the more plausible figure
 *     and printing only that one would produce a cleaner page and a less true one.
 *
 * So the shape of the report is the shape of the evidence. Six chapters, two of them
 * shorter than they would be, one of them missing, and a closing list of what could not be
 * written at all.
 */

function ReviewReport() {
  return (
    <article className="mx-auto max-w-[1100px] px-6 py-16 sm:px-10 lg:py-24">
      <header className="mb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <Eyebrow>Portfolio review</Eyebrow>
          <p className="font-mono text-xs text-muted-foreground">As at —</p>
        </div>
        <h1 className="mt-4 max-w-[26ch] text-[2.5rem] leading-[1.05] font-medium tracking-tight">
          {sgd(PORTFOLIO.value)}, and two things to settle
        </h1>
        <p className="mt-3 max-w-[64ch] text-sm text-muted-foreground">
          Written from a {SOURCE_NOTE.detail}. It names neither the client nor a
          date, so this report does not either.
        </p>
      </header>

      {/* 01 — the statement, the four figures behind it, and the client's own priorities
          alongside. Wide left column, narrow right: the stated focus is context for the
          finding, not a finding of its own. */}
      <Chapter id="c01" number="01" title="Where things stand">
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)]">
          <p className="max-w-[34ch] text-[2rem] leading-[1.2] font-medium tracking-tight text-balance">
            The portfolio is up since the last review. The two developments
            underneath it matter more than the gain.
          </p>

          <div className="lg:pt-2">
            <Eyebrow>Stated focus</Eyebrow>
            <ul className="mt-3 space-y-2">
              {FOCUS.map((item) => (
                <li
                  key={item}
                  className="border-l pl-3 text-[0.8125rem] leading-snug text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Narrative className="mt-10">
          <p>
            Technology has gone from {pct(TECHNOLOGY.from, 0)} of the portfolio
            to {pct(TECHNOLOGY.to, 0)} — a{" "}
            {pct(TECHNOLOGY.relativeChange * 100)} increase in the position,
            which the note records as having happened{" "}
            <strong>without an explicit decision</strong>. And{" "}
            {sgdExact(USES[0].amount)} of the portfolio has a buyer waiting for
            it within twelve months, against {sgdExact(SOURCES[0].amount)} of
            cash.
          </p>
          <p>
            Both of those are the note&apos;s own observations, and both are
            answerable. The gain is the figure that is least clear: the note
            prints {sgdCompact(PORTFOLIO.changeAmount)} and{" "}
            {signedPct(PORTFOLIO.changePct)} side by side, and on{" "}
            {sgd(PORTFOLIO.value)} those are not the same statement —{" "}
            {signedPct(PORTFOLIO.changePct)} would be{" "}
            {sgdCompact(DISCREPANCIES.changeImpliedAmount)}. Neither figure is
            corrected here, because correcting one means overwriting the other.
          </p>
        </Narrative>

        <ReadoutMetrics
          className="mt-12"
          metrics={[
            {
              label: "Portfolio value",
              value: sgd(PORTFOLIO.value),
              detail: "The only total in the note",
            },
            {
              label: "Change",
              value: signedPct(PORTFOLIO.changePct),
              detail: `Printed beside ${sgdCompact(PORTFOLIO.changeAmount)}, which is ${pct(DISCREPANCIES.changeImpliedPct, 2)} of the total`,
            },
            {
              label: "Technology",
              value: pct(TECHNOLOGY.to, 0),
              detail: `${pct(TECHNOLOGY.from, 0)} at the last review. No limit is stated`,
            },
            {
              label: "Cash",
              value: sgdExact(SOURCES[0].amount),
              detail: `Against ${sgdExact(COVER.required)} of commitments inside a year`,
            },
          ]}
        />
      </Chapter>

      {/* 02 — full width. Three rows, each with a real before and after, which is the one
          thing this thin source does supply properly. */}
      <Chapter id="c02" number="02" className="mt-20" title="What changed">
        <ChangeLedger changes={CHANGES} />

        <Narrative className="mt-10">
          <p>
            Two of the three are not market movements. The property requirement
            and the bond maturity are dates in the calendar, and they land close
            enough together that the same {sgdExact(SOURCES[1].amount)} can only
            answer one of them.
          </p>
        </Narrative>
      </Chapter>

      {/* 03 — the widest exhibit on the page, and the one that needs the most caveating.
          The chart gets the full measure; the caveat sits under it rather than beside it,
          so the reader meets the numbers before they meet the doubt. */}
      <Chapter
        id="c03"
        number="03"
        className="mt-20"
        title="Where the change came from"
      >
        <Figure
          label="Performance summary"
          title={`Energy and technology carried the period; four of the eight lines took away ${signedPp(ATTRIBUTION_SPLIT.drags).replace("−", "")}`}
          note={
            <>
              Percentage points. The eight lines sum to{" "}
              {signedPct(ATTRIBUTION_TOTAL, 2)} —{" "}
              {signedPct(ATTRIBUTION_SPLIT.gains, 2)} of gains against{" "}
              {signedPct(ATTRIBUTION_SPLIT.drags, 2)} of drags — which is{" "}
              {signedPp(DISCREPANCIES.attributionGap).replace("+", "")} short of
              the stated {signedPct(PORTFOLIO.changePct)}, consistent with a line
              having been left off the summary. That they nearly reconcile at all
              is the only evidence that these are contributions to the headline
              change rather than eight standalone returns; the note does not say
              which, names no period and gives no benchmark, so nothing here can
              be annualised or compared.
            </>
          }
        >
          <ReturnAttribution rows={ATTRIBUTION} />
        </Figure>
      </Chapter>

      {/* 04 — two findings, deliberately given different shapes. The concentration one is
          a single weight and sits in a narrow column with its narrative; the funding one is
          an arithmetic that needs the full width. */}
      <Chapter id="c04" number="04" className="mt-20" title="What needs attention">
        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          <Figure
            label="Concentration"
            title="Technology is the largest single call in the portfolio, and nobody made it"
          >
            <ConcentrationShift
              label="Technology exposure"
              from={TECHNOLOGY.from}
              to={TECHNOLOGY.to}
              fromLabel={`${pct(TECHNOLOGY.from, 0)} at last review`}
              toLabel={pct(TECHNOLOGY.to, 0)}
              remainderLabel="The remaining 71% is not broken down anywhere in the note"
            />
          </Figure>

          <Narrative className="lg:pt-14">
            <p>
              {signedPp(TECHNOLOGY.pointChange, 0)} in points, but{" "}
              {pct(TECHNOLOGY.relativeChange * 100)} of the position — the
              exposure is now roughly half again what it was. The note pairs it
              with US equity and USD sensitivity, which is the right pairing: one
              decision not taken has moved three exposures at once.
            </p>
            <p>
              Nothing on file states a ceiling, so this is not a breach. It is
              the harder case — a position that has grown into significance
              without anyone having to approve it, and which therefore has no
              obvious moment at which someone would have reviewed it.
            </p>
          </Narrative>
        </div>

        <Separator className="my-12" />

        <Figure
          label="Funding"
          title={`Cash and the bond maturity cover the year's commitments with ${sgdExact(COVER.remaining)} to spare`}
          note={
            <>
              The education payment is{" "}
              {pct((USES[1].amount / USES[0].amount) * 100)} of the property
              requirement and is drawn to scale, which is why it is barely
              visible. The note writes it without the S$ prefix it uses
              everywhere else, so its currency is assumed, not stated — if it is
              US dollars the headroom is thinner than shown.
            </>
          }
        >
          <LiquidityCover
            sources={SOURCES}
            uses={USES}
            sourcesLabel="Available"
            usesLabel="Committed within 12 months"
            remainderLabel="left over, if both land as described"
            remainderNote={`Cover of ${pct(100 + COVER.headroom * 100, 0)}. The margin is thin enough that the order matters: the property could complete before the bond proceeds are reinvested, or long after.`}
            format={sgdExact}
          />
        </Figure>

        <Narrative className="mt-10">
          <p>
            The third item the note raises — aggregate USD exposure — cannot be
            shown. It records that higher US equity has increased sensitivity to
            USD movements, but gives no currency breakdown and no figure for
            total USD exposure. It stays on the decision list as a question
            rather than appearing here as a finding.
          </p>
        </Narrative>
      </Chapter>

      {/* 05 — three dates, genuinely chronological, so a timeline is the honest shape.
          Narrow. Timing is quoted relatively because that is how the note gives it. */}
      <Chapter id="c05" number="05" className="mt-20" title="What is coming">
        <EventTimeline events={UPCOMING} />

        <p className="mt-8 max-w-[62ch] text-xs leading-relaxed text-muted-foreground">
          All three are relative to an undated note, so none can be placed on a
          calendar. &ldquo;Next month&rdquo; and &ldquo;within 12
          months&rdquo; are reproduced as written rather than converted into
          dates that the source does not support.
        </p>
      </Chapter>

      {/* 06 — the close. Decisions first, then the note's own action items, which are
          reproduced rather than rewritten so the gap in them is visible. */}
      <Chapter id="c06" number="06" className="mt-20" title="What to decide">
        <DecisionList decisions={DECISIONS} />

        <Separator className="my-12" />

        <div className="grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
            <Eyebrow>Action items, as recorded</Eyebrow>
            <ul className="mt-4 space-y-0">
              {ACTIONS.map((action) => (
                <li
                  key={action}
                  className="border-b py-3 text-[0.8125rem] leading-snug first:border-t"
                >
                  {action}
                </li>
              ))}
              {COMPLETED.map((action) => (
                <li
                  key={action}
                  className="flex items-baseline justify-between gap-4 border-b py-3 text-[0.8125rem] leading-snug text-muted-foreground"
                >
                  <span>{action}</span>
                  <span className="shrink-0 text-xs">Done</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground lg:pt-8">
            Four of the five are open and none carries an owner or a date. The
            fifth is already complete and was recorded in the same list, which is
            why it is separated here — a list that mixes work to be done with work
            already finished cannot be used to chase anything.
          </p>
        </div>
      </Chapter>

      {/* The closing disclosure. Not a chapter: it is about the report rather than the
          portfolio, and it is the reason there are six chapters instead of seven. */}
      <footer className="mt-24">
        <Separator className="mb-6" />
        <div className="grid gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div>
            <Eyebrow>What the source does not contain</Eyebrow>
            <p className="mt-3 max-w-[34ch] text-xs leading-relaxed text-muted-foreground">
              Listed so that nothing above is mistaken for a complete picture.
              There is no chapter on holdings in this report because the first
              item here makes one impossible.
            </p>
          </div>

          <ul className="space-y-0">
            {NOT_ON_FILE.map((item) => (
              <li
                key={item}
                className="border-b py-2.5 text-xs leading-relaxed text-muted-foreground first:border-t"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </article>
  )
}

export { ReviewReport }
