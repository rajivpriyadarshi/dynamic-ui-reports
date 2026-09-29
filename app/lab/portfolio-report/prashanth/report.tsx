import {
  ALLOCATION,
  AS_OF,
  BALANCE_SHEET,
  BANK_ACCOUNTS,
  CAPITAL_CALL,
  CHANGES,
  CLIENT,
  CONTRIBUTION,
  CUSTODIAN_COUNT,
  LIFESTYLE,
  LISTED,
  LIQUIDITY,
  NVDA_BY_CUSTODIAN,
  PERFORMANCE_AS_OF,
  PERIOD_RETURNS,
  POSITIONS,
  PRIVATE_BOOK,
  PROPERTY,
  SOURCES,
  TECHNOLOGY,
  UPCOMING,
  YTD_RETURN,
  pct,
  signedPp,
  usd,
  usdCompact,
} from "./data"
import { DEMO_TECHNOLOGY_BAND } from "./demo-data"
import { ActionOwnership } from "@/components/portfolio-report/action-ownership"
import { AllocationBreakdown } from "@/components/portfolio-report/allocation-breakdown"
import { CapitalFlow } from "@/components/portfolio-report/capital-flow"
import { ChangeLedger } from "@/components/portfolio-report/change-ledger"
import {
  Chapter,
  Eyebrow,
  Figure,
  Narrative,
} from "@/components/portfolio-report/chapter"
import { ConcentrationRisk } from "@/components/portfolio-report/concentration-risk"
import { ContributionAnalysis } from "@/components/portfolio-report/contribution-analysis"
import {
  DecisionList,
  type Decision,
} from "@/components/portfolio-report/decision-list"
import { EventTimeline } from "@/components/portfolio-report/event-timeline"
import { ExposureLens } from "@/components/portfolio-report/exposure-lens"
import { ExposureTrend } from "@/components/portfolio-report/exposure-trend"
import { GainComposition } from "@/components/portfolio-report/gain-composition"
import { HoldingsTable } from "@/components/portfolio-report/holdings-table"
import { LiabilityStack } from "@/components/portfolio-report/liability-stack"
import { LifestyleAssets } from "@/components/portfolio-report/lifestyle-assets"
import { LookThroughExposure } from "@/components/portfolio-report/look-through-exposure"
import { ManagerComparison } from "@/components/portfolio-report/manager-comparison"
import { OwnershipLayers } from "@/components/portfolio-report/ownership-layers"
import { PerformanceVsBenchmark } from "@/components/portfolio-report/performance-vs-benchmark"
import { ReadoutMetrics } from "@/components/portfolio-report/readout-metrics"
import { Separator } from "@/components/ui/separator"

const sixMonth = PERIOD_RETURNS.find((row) => row.period === "6M")!
const nvda = POSITIONS.find((position) => position.ticker === "NVDA")!
const nvdaLargestCustody = [...NVDA_BY_CUSTODIAN].sort(
  (a, b) => b.amount - a.amount
)[0]
const technologyShareOfGain = CONTRIBUTION.filter(
  (row) => row.group === "Technology"
).reduce((total, row) => total + row.share, 0)
const trustProperty = PROPERTY.find((row) => row.ownerKind === "trust")!
const cashTotal = BANK_ACCOUNTS.reduce((total, row) => total + row.value, 0)

/**
 * Small counts are spelled out in the display sentence in chapter 01, where a bare
 * numeral sits badly at 2rem beside the percentages that have to stay numeric. Kept
 * derived from the data rather than typed, so the word cannot drift from the count.
 */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six"] as const
const spell = (n: number) => WORDS[n] ?? String(n)

const DECISIONS: Decision[] = [
  {
    question: `Trim the NVIDIA position, or accept ${pct(TECHNOLOGY.weight, 1)} technology exposure as intended?`,
    basis: `NVIDIA is ${usd(nvda.marketValue, 2)}, or ${pct(nvda.marketValue / LISTED.marketValue, 1)} of his listed holdings, up from 9.1% in December without a single purchase.`,
    owner: "Raised at the 7 August review; open at UBS",
    evidence: (
      <>
        <p>
          The holding is spread across all {CUSTODIAN_COUNT} custodians, the
          biggest being {nvdaLargestCustody.custodian} at{" "}
          {usdCompact(nvdaLargestCustody.amount)}. Selling any of it means
          instructing more than one manager, and the open action names UBS only.
        </p>
        <p className="mt-3">
          Two things argue against selling. The three technology names produced{" "}
          {pct(technologyShareOfGain, 0)} of the {usd(LISTED.gain, 2)} gain, none
          of which has been realised, so selling would trigger a tax bill nothing
          on file has worked out. And the LGT loan is secured against these same
          shares, so selling them weakens the security behind it.
        </p>
      </>
    ),
  },
  {
    question:
      "Is the LGT discretionary mandate actually outperforming, and against what?",
    basis:
      "The 7 August note says it is, but nothing on file measures one manager separately from the others. The portfolio as a whole beat its benchmark by " +
      signedPp(sixMonth.alpha!) +
      " over six months.",
    owner: "Advisory — open, no date",
    evidence: (
      <p>
        Answering this needs returns for the LGT mandate on its own and a
        benchmark to judge them against. Neither exists today, so the claim can
        be neither confirmed nor disproved — while the LGT loan at 5.25% remains
        the most expensive borrowing he has.
      </p>
    ),
  },
  {
    question: `Confirm the ${usdCompact(CAPITAL_CALL.amount)} capital call is paid from Treasury bills, as agreed.`,
    basis: `Due ${CAPITAL_CALL.deadline}. It takes him from ${usd(LIQUIDITY.total, 2)} of ready cash to ${usd(LIQUIDITY.total - CAPITAL_CALL.amount, 2)}.`,
    owner: "Approved 7 August; not yet funded",
  },
  {
    question:
      "Does the LGT transfer timeline need renegotiating, or is Q4 still realistic?",
    basis:
      "It cannot begin until Withers completes the intermediary trust, expected October, and the counterparty has given no date.",
    owner: "Blocked externally",
  },
  {
    question: `Is the ${usd(trustProperty.value, 2)} Atherton house inside the plan or outside it?`,
    basis: `It is ${pct(trustProperty.value / BALANCE_SHEET.totalAssets, 0)} of everything he owns and his single largest asset, held by ${trustProperty.owner}. He is a beneficiary, not the legal owner.`,
    owner: "Never raised",
    evidence: (
      <p>
        Every allocation figure in <em>What he owns</em> includes it, and nothing
        on file says whether it should. The answer changes the concentration
        numbers: leave it out and technology becomes a bigger share of what he
        actually controls, not a smaller one.
      </p>
    ),
  },
  {
    question: `Should a preferred range for technology be written down at all?`,
    basis: `No limit is recorded anywhere, so ${pct(TECHNOLOGY.weight, 1)} is only high as a matter of opinion. Every review will argue this again until a number exists.`,
  },
]

/**
 * Prashanth's report, written for his file rather than assembled from a template.
 *
 * The seven chapters are the spine. Chapters 04 and 05 carry more than one section each
 * because his record has more than one finding in each — ownership, holdings and lifestyle
 * assets are all "what he holds"; concentration, custody, mandate measurement, liquidity
 * and borrowing are all "what needs attention". Adding chapters 08 and 09 instead would
 * have made the contents longer without making the argument clearer.
 */
function PrashanthReport() {
  return (
    <article className="mx-auto max-w-[1100px] px-6 py-16 sm:px-10 lg:py-24">
      {/* masthead */}
      <header className="mb-16">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <Eyebrow>Portfolio analysis</Eyebrow>
          <p className="font-mono text-xs text-muted-foreground">
            As at {AS_OF}
          </p>
        </div>
        <h1 className="mt-4 text-[2.5rem] leading-[1.05] font-medium tracking-tight">
          {CLIENT.name}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {CLIENT.entity} · prepared following the quarterly review of{" "}
          {CLIENT.reviewedOn}
        </p>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 01 — the story, in one sentence and four figures                   */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c01" number="01" title="Where things stand">
        <div className="grid items-end gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <p className="max-w-[32ch] text-[2rem] leading-[1.2] font-medium tracking-tight text-balance">
            The portfolio is up {YTD_RETURN} this year, but three technology
            names produced most of it — and the largest is split across{" "}
            {spell(CUSTODIAN_COUNT)} custodians, so no statement shows it whole.
          </p>

          {/* the sentence's "but", made checkable */}
          <GainComposition className="lg:pb-2" />
        </div>

        <Narrative className="mt-10">
          <p>
            Almost all of the {usd(BALANCE_SHEET.netWorthDelta.value)} increase
            comes from the {PRIVATE_BOOK.remarkedOn} revaluation of his private
            holdings rather than from market returns. So this report is about
            concentration and the September commitment, not about the headline
            number.
          </p>
        </Narrative>

        <ReadoutMetrics
          className="mt-12"
          metrics={[
            {
              label: "Net worth",
              value: usd(BALANCE_SHEET.netWorth),
              detail: `Up ${usd(BALANCE_SHEET.netWorthDelta.value)} ${BALANCE_SHEET.netWorthDelta.label}`,
            },
            {
              label: "Return, six months",
              value: `+${sixMonth.portfolio.toFixed(1)}%`,
              detail: `${signedPp(sixMonth.alpha!)} against benchmark · estimated`,
            },
            {
              label: "Technology holdings",
              value: pct(TECHNOLOGY.weight, 1),
              detail: `${usd(TECHNOLOGY.marketValue, 2)} in three names`,
            },
            {
              label: "Ready cash",
              value: usd(LIQUIDITY.total, 2),
              detail: `${usdCompact(CAPITAL_CALL.amount)} committed by ${CAPITAL_CALL.deadline.replace(" 2026", "")}`,
            },
          ]}
        />
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 02 — the ledger, full measure                                      */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c02" number="02" title="What changed" className="mt-20">
        <Narrative className="mb-8">
          <p>
            Four things moved since the last review, and only one of them is the
            market.
          </p>
        </Narrative>
        <ChangeLedger changes={CHANGES} />
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 03 — performance: one wide exhibit, then a narrower one            */}
      {/* ------------------------------------------------------------------ */}
      <Chapter
        id="c03"
        number="03"
        title="How the portfolio has done"
        className="mt-20"
      >
        <Figure
          label="Indexed, February = 100"
          title="The portfolio has run ahead of its benchmark since February, and the gap widened rather than closed"
          note={
            <>
              Estimated to {PERFORMANCE_AS_OF} from the one performance note on
              file. The benchmark is only measured at four dates; the dashed line
              joins them and says nothing about the path in between.
            </>
          }
        >
          <PerformanceVsBenchmark />
        </Figure>

        <Separator className="my-14" />

        <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start">
          <Figure
            label="Contribution to unrealised gain"
            title="Three names produced most of it"
            note={
              <>
                Measured since purchase, not year-to-date: the file holds what he
                paid and what it is worth now, with nothing in between.
              </>
            }
          >
            <ContributionAnalysis />
          </Figure>

          <Narrative className="max-w-none lg:pt-2">
            <p>
              <strong>
                {pct(technologyShareOfGain, 0)} of the {usd(LISTED.gain, 2)} gain
                came from Apple, Microsoft and NVIDIA.
              </strong>{" "}
              The Vanguard index holds the same three companies, so he depends on
              them more than any single line here shows. That is why the rest of
              this report is about concentration rather than performance.
            </p>
          </Narrative>
        </div>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 04 — the portfolio: bar, lenses, look-through, ownership, evidence  */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c04" number="04" title="What he owns" className="mt-20">
        <Figure
          label={`Total assets ${usd(BALANCE_SHEET.totalAssets)}`}
          title="Three quarters of everything he owns is listed shares and Singapore property"
          note={
            <>
              Set against {usd(BALANCE_SHEET.borrowing)} of borrowing, which is{" "}
              {BALANCE_SHEET.leverage} of assets, plus a{" "}
              {usd(BALANCE_SHEET.guaranteeOffBalanceSheet)} guarantee to LGT that
              sits outside that figure.
            </>
          }
        >
          <AllocationBreakdown
            allocation={ALLOCATION}
            totalAssets={BALANCE_SHEET.totalAssets}
            money={usd}
          />
        </Figure>

        <div className="mt-14 max-w-[880px]">
          <Figure
            label="Exposure lens"
            title="The same holdings, cut four ways"
          >
            <ExposureLens />
          </Figure>
        </div>

        {/* the widest exhibit on the page — this is the finding */}
        <div className="mt-16 border-y py-12">
          <Figure
            label="Look-through"
            title={`${nvda.name} is one position held four times`}
          >
            <LookThroughExposure />
          </Figure>
        </div>

        {/* who owns it — a categorical finding, so a schedule rather than a chart */}
        <div className="mt-16 max-w-[900px]">
          <Figure
            label="Ownership"
            title={`His largest single asset is not in his own name`}
            note={
              <>
                These are the same {usd(BALANCE_SHEET.totalAssets)} as above, split
                by who legally owns each part. Nothing is added to the total.
              </>
            }
          >
            <OwnershipLayers />
          </Figure>
        </div>

        {/* cash: small enough to set narrow, and the narrowest block in the chapter */}
        <div className="mt-14 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-start">
          <div>
            <Eyebrow>Cash, {usd(cashTotal, 2)}</Eyebrow>
            <dl className="mt-4">
              {[...BANK_ACCOUNTS]
                .sort((a, b) => b.value - a.value)
                .map((account) => (
                  <div
                    key={account.institution}
                    className="flex items-baseline justify-between gap-6 border-b border-dotted py-2.5"
                  >
                    <dt className="text-[0.8125rem]">
                      {account.institution}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {account.where} · {account.currency}
                      </span>
                    </dt>
                    <dd className="text-[0.8125rem] tabular-nums">
                      {usdCompact(account.value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
          <Narrative className="max-w-none text-[0.8125rem] lg:pt-6">
            <p>
              Four accounts, three currencies,{" "}
              {pct(cashTotal / BALANCE_SHEET.totalAssets, 1)} of assets — and every
              balance is smaller than the September payment, which is why that
              payment comes out of Treasury bills instead.
            </p>
          </Narrative>
        </div>

        <div className="mt-14">
          <Figure
            label="Holdings"
            title="Every listed holding"
            note={
              <>
                Each holding's gain is exactly 24.0% of what he paid, because the
                file records one figure for the whole portfolio and it has been
                spread across the five rows. Per-holding percentages would be
                meaningless, so they are not shown.
              </>
            }
          >
            <HoldingsTable
              holdings={POSITIONS}
              currency="US$"
              totalLabel="All listed holdings"
            />
          </Figure>
        </div>

        <Separator className="my-16" />

        {/* the assets that are not investments, measured the one way that suits them */}
        <div className="max-w-[900px]">
          <Figure
            label={`Lifestyle assets ${usd(LIFESTYLE.value, 2)}`}
            title="The things with engines have lost money; the things in cases have not"
          >
            <LifestyleAssets />
          </Figure>
        </div>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 05 — the analytical heart: five issues, five different forms       */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c05" number="05" title="What needs attention" className="mt-20">
        {/* 5A */}
        <section>
          <h3 className="max-w-[44ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            Technology is {pct(TECHNOLOGY.weight, 1)} of his listed holdings, and
            nobody decided that
          </h3>
          <Narrative className="mt-4">
            <p>
              {usd(TECHNOLOGY.marketValue, 2)} of {usd(LISTED.marketValue, 2)}, in
              three companies in one industry. No purchase caused it — the three
              simply grew faster than everything around them.
            </p>
          </Narrative>

          <div className="mt-10">
            <ConcentrationRisk />
          </div>

          <div className="mt-12 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start">
            <Figure
              label={`${nvda.ticker} share of listed holdings, monthly`}
              title="Eight of the last nine months were higher than the one before"
            >
              <ExposureTrend />
            </Figure>
            <Narrative className="max-w-none lg:pt-2">
              <p>
                This feeds itself: the more a holding rises, the more of the
                portfolio's return depends on it continuing to rise. Nothing in
                the portfolio is positioned for one sector falling.
              </p>
            </Narrative>
          </div>
        </section>

        <Separator className="my-16" />

        {/* 5B */}
        <section>
          <h3 className="max-w-[46ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            No custody statement shows the {nvda.ticker} position
          </h3>
          {/* No second custody chart: chapter 04 already carries that evidence. The
              exhibit here is the action list, where the same absence of ownership
              shows up as blank columns. */}
          <div className="mt-8 grid gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
            <ActionOwnership />
            <Narrative className="max-w-none text-[0.8125rem] lg:pt-1">
              <p>
                The largest single custody line is{" "}
                {nvdaLargestCustody.custodian} at{" "}
                {usdCompact(nvdaLargestCustody.amount)},{" "}
                {pct(nvdaLargestCustody.amount / nvda.marketValue, 0)} of the
                holding. No single manager is responsible for the position being
                this large, so no single manager will act on it. The open action
                names UBS only because UBS happens to hold the biggest share.
              </p>
            </Narrative>
          </div>
        </section>

        <Separator className="my-16" />

        {/* 5C */}
        <section>
          <h3 className="max-w-[46ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            The portfolio is beating its benchmark, but nobody can say which
            manager is doing it
          </h3>
          <div className="mt-8 grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-start">
            <ManagerComparison />
            <Narrative className="max-w-none lg:pt-1">
              <p>
                Over one month the {signedPp(sixMonth.alpha!)} six-month gap
                narrows to {signedPp(PERIOD_RETURNS[0].alpha!)}, which is small
                enough to be noise in an estimated series.
              </p>
              <p>
                LGT carries the 5.25% loan, the pending transfer and the{" "}
                {usd(BALANCE_SHEET.guaranteeOffBalanceSheet)} guarantee — the
                manager that matters most and the one we can measure least. Until
                there are returns for each manager separately, “LGT is doing well”
                is a memory, not a fact.
              </p>
            </Narrative>
          </div>
        </section>

        <Separator className="my-16" />

        {/* 5D */}
        <section>
          <h3 className="max-w-[46ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            The September payment is covered, but there is less room after it
          </h3>
          <Narrative className="mt-4 mb-10">
            <p>
              Comfortable today. It is worth noting only because it is the second
              claim on the same cash: the {PRIVATE_BOOK.remarkedOn} revaluation
              took his private holdings to {usd(PRIVATE_BOOK.current)}, and
              private holdings cannot pay their own calls.
            </p>
          </Narrative>
          <CapitalFlow />
        </section>

        <Separator className="my-16" />

        {/* 5E — the borrowing, set narrow: four lines and one rate that matters */}
        <section>
          <h3 className="max-w-[48ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            His most expensive loan is secured against his most concentrated
            holding
          </h3>
          <div className="mt-8 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:items-start">
            <LiabilityStack />
            <Narrative className="max-w-none text-[0.8125rem] lg:pt-1">
              <p>
                At {BALANCE_SHEET.leverage} of assets, this is not a question
                about whether he can repay. The problem is that it all runs
                through one relationship: the collateral, the concentration and
                the manager we cannot measure are the same party.
              </p>
            </Narrative>
          </div>
        </section>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 06 — the schedule, narrow                                          */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c06" number="06" title="What's coming" className="mt-20">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-start">
          <EventTimeline events={UPCOMING} />
          <Narrative className="max-w-none text-[0.8125rem] lg:pt-1">
            <p>
              Two of the three dates are not his to set, so the capital call is
              the only one he can close this quarter. Nothing else on file has a
              date against it — this is the whole schedule, not a selection from
              it.
            </p>
          </Narrative>
        </div>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 07 — decisions, narrowest                                          */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c07" number="07" title="What to decide" className="mt-20">
        <div className="max-w-[760px]">
          <DecisionList decisions={DECISIONS} />
        </div>
      </Chapter>

      {/* sources */}
      <footer className="mt-20 border-t pt-8">
        <Eyebrow>Basis of preparation</Eyebrow>
        <dl className="mt-5 grid max-w-[880px] gap-x-10 gap-y-2.5 text-xs sm:grid-cols-2">
          {SOURCES.map((source) => (
            <div key={source.name} className="flex justify-between gap-4">
              <dt className="text-foreground/75">{source.name}</dt>
              <dd className="text-right text-muted-foreground">
                {source.detail}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[80ch] text-xs leading-relaxed text-muted-foreground">
          Everything he owns and owes comes from his client file, at purchase
          price or last valuation. Returns, the benchmark and the monthly history
          are estimated. One figure is demo-only, and it is labelled where it
          appears: the {Math.round(DEMO_TECHNOLOGY_BAND.min * 100)}–
          {Math.round(DEMO_TECHNOLOGY_BAND.max * 100)}% technology range in{" "}
          <em>What needs attention</em>.
        </p>
      </footer>
    </article>
  )
}

export { PrashanthReport }
