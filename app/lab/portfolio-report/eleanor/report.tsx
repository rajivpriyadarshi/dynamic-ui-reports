import {
  ALLOCATION,
  AS_OF,
  BALANCE_SHEET,
  BANK_ACCOUNTS,
  CHANGES,
  COMMITMENTS,
  CLIENT,
  ENTITIES,
  FAMILY,
  FAMILY_BUSINESS,
  LIQUIDITY,
  OPEN_ACTIONS,
  PRIVATE_FUNDS,
  PROPERTY,
  SECURITIES,
  SOURCES,
  STALE,
  STALE_THRESHOLD_MONTHS,
  STALE_VALUE,
  UPCOMING,
  pct,
  sgd,
  sgdCompact,
  signedPct,
} from "./data"
import { AllocationBreakdown } from "@/components/portfolio-report/allocation-breakdown"
import { AsAtMap } from "@/components/portfolio-report/as-at-map"
import { ChangeLedger } from "@/components/portfolio-report/change-ledger"
import { CostToMarket } from "@/components/portfolio-report/cost-to-market"
import { EntityStructure } from "@/components/portfolio-report/entity-structure"
import {
  Chapter,
  Eyebrow,
  Figure,
  Narrative,
} from "@/components/portfolio-report/chapter"
import { DataLimitation } from "@/components/portfolio-report/data-limitation"
import { DecisionOrder } from "@/components/portfolio-report/decision-order"
import { RealisableSplit } from "@/components/portfolio-report/realisable-split"
import {
  DecisionList,
  type Decision,
} from "@/components/portfolio-report/decision-list"
import { EventTimeline } from "@/components/portfolio-report/event-timeline"
import { JurisdictionSpread } from "@/components/portfolio-report/jurisdiction-spread"
import { LiquidityLadder } from "@/components/portfolio-report/liquidity-ladder"
import { ReadoutMetrics } from "@/components/portfolio-report/readout-metrics"
import { ValuationAge } from "@/components/portfolio-report/valuation-age"
import { Separator } from "@/components/ui/separator"

/**
 * Eleanor's report. Written from her file, and shorter than Prashanth's in the places
 * where her file holds less.
 *
 * The difference that matters: her record carries no return history and no benchmark, so
 * chapter 03 does not attempt performance attribution. It says what the record supports —
 * a gain on cost, per mandate — and then says plainly what it cannot support. Filling that
 * chapter to match his would mean inventing a series, which would make the one chapter a
 * reader is most likely to trust the one chapter that is fiction.
 *
 * Nothing on this page is synthetic. There is no demo-data file for her.
 */

const staleShare = STALE_VALUE / BALANCE_SHEET.totalAssets
const oldest = STALE[0]
/**
 * The next outflow, taken from the schedule rather than from the fund with the largest
 * uncalled balance — Meridian's S$2.5m is the biggest but carries no date at all.
 */
const firstOutflow = COMMITMENTS[0]

/** Of the uncalled commitments, the part that actually has a date against it. */
const datedUnfunded = PRIVATE_FUNDS.filter(
  (fund) => fund.callDue !== null
).reduce((total, fund) => total + fund.unfunded, 0)

/** The two outflows her file marks medium-confidence, and could therefore move. */
const uncertainTiming = COMMITMENTS.filter(
  (row) => row.confidence === "medium"
).reduce((total, row) => total + row.amount, 0)

const DECISIONS: Decision[] = [
  {
    question: `How are the ${sgd(LIQUIDITY.committed, 2)} of commitments funded — and does the ${sgd(LIQUIDITY.reserve)} reserve still stand?`,
    basis: `Cash is ${sgd(LIQUIDITY.cash, 2)}. Paying all five dated items leaves ${sgd(LIQUIDITY.after, 2)}, which is ${sgd(LIQUIDITY.gap, 2)} below the minimum she set herself.`,
    owner: `First due ${firstOutflow.on} — ${sgdCompact(firstOutflow.amount)}, ${firstOutflow.name}`,
    evidence: (
      <>
        <p>
          There are three ways out, and nothing on file names any of them: sell
          from the {sgd(SECURITIES.marketValue, 2)} managed portfolio, borrow
          against a property, or lower the reserve. Only the first is available
          without arranging a new loan, and it means selling bonds to cover a gap
          the private funds created.
        </p>
        <p className="mt-3">
          There is also {sgd(LIQUIDITY.unfunded, 2)} the four funds have not yet
          called. Only {sgd(datedUnfunded, 1)} of it has a date; the managers can
          ask for the rest whenever they choose, so it is not in the sequence
          above.
        </p>
      </>
    ),
  },
  {
    question: `Commission a fresh valuation for ${oldest.name}?`,
    basis: `Last valued ${oldest.valuedOn} — ${oldest.months} months before this report — and still shown at ${sgd(oldest.value)}.`,
    owner: "Open action, no date",
    evidence: (
      <p>
        Two assets are past the nine-month line her file sets, and together they
        are {sgd(STALE_VALUE)}, or {pct(staleShare, 0)} of everything she owns.
        Revalue them and net worth changes — the figure every other decision here
        is measured against.
      </p>
    ),
  },
  {
    question:
      "What formal investment role, if any, should James have — and does it need the revised deed to be signed first?",
    basis:
      "The revised trust documents change investment committee authority, and her instruction is that no assets move until the governance discussion concludes.",
    owner: "Raised by her; no decision taken",
    evidence: (
      <p>
        These two are the same decision, which is why they are one item. The
        deed defines what an investment committee may do; the committee is the
        thing James would be joining. Deciding his role before reading the deed
        decides it twice.
      </p>
    ),
  },
  {
    question: `Should Sophie's foundation sit inside the family structure or beside it?`,
    basis:
      "S$2–3m of initial funding is contemplated. No structure has been chosen, and the choice has tax and control consequences in two jurisdictions.",
    owner: "Philanthropy session not yet arranged",
  },
  {
    question: `Is a ${pct(FAMILY_BUSINESS.ownership, 0)} minority holding in one private company an acceptable ${pct(FAMILY_BUSINESS.value / BALANCE_SHEET.totalAssets, 0)} of assets?`,
    basis: `${sgd(FAMILY_BUSINESS.value)} in ${FAMILY_BUSINESS.name}, valued ${FAMILY_BUSINESS.valuedOn}. A minority stake cannot force a sale or a distribution.`,
    evidence: (
      <p>
        This is not a recommendation to sell — there may be no buyer, and the
        holding is part of why the family structure exists at all. It is a
        question about whether having this much in one company is deliberate,
        because nothing on file says it was ever decided.
      </p>
    ),
  },
]

function EleanorReport() {
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
          {CLIENT.entity} · client since {CLIENT.clientSince}
        </p>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* 01 — the summary                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c01" number="01" title="Where things stand">
        {/* The chapter's right-hand margin, running the full height of it
            chapter rather than starting at the narrative: her assets are in four
            countries and nothing else in the report says so, which is why it
            sits this early rather than in an appendix. */}
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:items-start">
          <div>
            <p className="max-w-[34ch] text-[2rem] leading-[1.2] font-medium tracking-tight text-balance">
              {pct(BALANCE_SHEET.illiquidShare, 0)} of the balance sheet cannot
              be sold this quarter, and the next six months commit{" "}
              {pct(LIQUIDITY.shareOfCash, 0)} of the cash.
            </p>

            <Narrative className="mt-10">
              <p>
                Net worth is {sgd(BALANCE_SHEET.netWorth)} against{" "}
                {sgd(BALANCE_SHEET.liabilities, 1)} of liabilities, so the
                balance sheet is not borrowed against and there is no question
                about whether she can pay what she owes. The question is shape:{" "}
                {sgd(BALANCE_SHEET.illiquid)} sits in property, private funds
                and one minority company holding, and the{" "}
                {sgd(LIQUIDITY.committed, 2)} of commitments falling due between
                October and January has to come out of the{" "}
                {sgd(BALANCE_SHEET.liquid, 1)} that does not.
              </p>
              <p>
                Two of the numbers above are older than they look — see{" "}
                <em>What needs attention</em>.
              </p>
            </Narrative>
          </div>

          <JurisdictionSpread />
        </div>

        <ReadoutMetrics
          className="mt-12"
          metrics={[
            {
              label: "Net worth",
              value: sgd(BALANCE_SHEET.netWorth),
              detail: `${sgd(BALANCE_SHEET.totalAssets)} of assets, ${sgd(BALANCE_SHEET.liabilities, 1)} of liabilities`,
            },
            {
              label: "Hard to sell",
              value: pct(BALANCE_SHEET.illiquidShare, 1),
              detail: `${sgd(BALANCE_SHEET.illiquid)} needs longer than three months to sell`,
            },
            {
              label: "Cash",
              value: sgd(LIQUIDITY.cash, 1),
              detail: `${sgd(LIQUIDITY.committed, 2)} committed by 31 January`,
            },
            {
              label: "Below her minimum",
              value: `−${sgd(LIQUIDITY.gap, 2)}`,
              detail: `Her stated reserve is ${sgd(LIQUIDITY.reserve)}`,
            },
          ]}
        />
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 02 — what changed. Same title as Prashanth's: the difference between
          the two clients is that all four of hers are about control rather than
          markets, and that belongs in the first sentence, not in the title. A
          title has to tell the reader what is in the section. */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c02" number="02" title="What changed" className="mt-20">
        <Narrative className="mb-8">
          <p>
            Four things moved since the last review, and not one of them is the
            market. All four are about who controls the money rather than what
            she holds.
          </p>
        </Narrative>
        <ChangeLedger changes={CHANGES} />
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 03 — deliberately the shortest chapter: the data is not there. Same
          title as Prashanth's, phrased so it works whether the answer is full
          or thin. The chapter then says plainly how little can be answered,
          which is more use to a reader than a title hinting at it. */}
      {/* ------------------------------------------------------------------ */}
      <Chapter
        id="c03"
        number="03"
        title="How the portfolio has done"
        className="mt-20"
      >
        {/* Her mandate names are long and carry the y-axis, so the aside is kept
            narrow — the exhibit needs the room more than it does. */}
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:items-start">
          <Figure
            label={`Managed portfolio at ${SECURITIES.custodian}`}
            title={`${signedPct(SECURITIES.returnOnCost)} since purchase, and the two equity funds account for almost all of it`}
            note={
              <>
                Each bar runs from what she paid to what it is worth now, in
                Singapore dollars. It is a gain, not a return: no period is
                attached to it, because no purchase dates are recorded.
              </>
            }
          >
            <CostToMarket />
          </Figure>

          <DataLimitation
            title="There is no performance history on file"
            className="lg:mt-12"
          >
            For each mandate there is one purchase price and one current value,
            with nothing in between, and no benchmark to compare against. So
            this report cannot say what the portfolio returned this year, how
            that compares, or which mandate drove it — and it does not estimate
            any of those.
          </DataLimitation>
        </div>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 04 — everything she owns, at full width. His chapter 04 is a portfolio,
          hers is a whole balance sheet with one small portfolio inside it, but
          the reader's question is the same one either way. */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c04" number="04" title="What she owns" className="mt-20">
        <Figure
          label={`Total assets ${sgd(BALANCE_SHEET.totalAssets)}`}
          title="Real estate alone is larger than everything that can be sold"
          note={
            <>
              Every figure is in Singapore dollars, as recorded, including the UK
              account. No exchange rate is applied here.
            </>
          }
        >
          <AllocationBreakdown
            allocation={ALLOCATION}
            totalAssets={BALANCE_SHEET.totalAssets}
            money={sgd}
          />
        </Figure>

        {/* the two illiquid books, side by side, because they are read together */}
        <div className="mt-16 grid gap-x-14 gap-y-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Real estate · {sgd(BALANCE_SHEET.property)}</Eyebrow>
            <dl className="mt-4">
              {PROPERTY.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-baseline gap-x-5 border-b border-dotted py-3"
                >
                  <dt className="min-w-0">
                    <span className="text-[0.8125rem]">{row.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {row.where} · valued {row.valuedOn}
                    </span>
                  </dt>
                  <dd className="text-right text-[0.8125rem] tabular-nums">
                    {sgd(row.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <Eyebrow>Private funds · {sgd(BALANCE_SHEET.privateFunds)}</Eyebrow>
            <dl className="mt-4">
              {PRIVATE_FUNDS.map((row) => (
                <div
                  key={row.name}
                  className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-baseline gap-x-5 border-b border-dotted py-3"
                >
                  <dt className="min-w-0">
                    <span className="text-[0.8125rem]">{row.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {row.where} · valued {row.valuedOn}
                      {row.unfunded > 0 &&
                        ` · ${sgdCompact(row.unfunded)} uncalled`}
                    </span>
                  </dt>
                  <dd className="text-right text-[0.8125rem] tabular-nums">
                    {sgd(row.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* one holding, one number, deliberately given its own measure */}
        <div className="mt-16 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-baseline">
          <div>
            <Eyebrow>Family business</Eyebrow>
            <p className="mt-3 text-[2.25rem] leading-none font-medium tracking-tight tabular-nums">
              {sgd(FAMILY_BUSINESS.value)}
            </p>
            <p className="mt-3 text-sm">
              {pct(FAMILY_BUSINESS.ownership, 0)} of {FAMILY_BUSINESS.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {FAMILY_BUSINESS.where} · held by {FAMILY_BUSINESS.heldBy} ·
              valued {FAMILY_BUSINESS.valuedOn}
            </p>
          </div>
          <Narrative className="max-w-none text-[0.8125rem]">
            <p>
              This is{" "}
              {pct(FAMILY_BUSINESS.value / BALANCE_SHEET.totalAssets, 1)} of
              assets in a single unlisted company, and it is a minority position
              — so she cannot force a sale, a dividend or a fresh valuation. It
              is valued at the last figure the company produced.
            </p>
          </Narrative>
        </div>

        <Separator className="my-16" />

        {/* cash, narrow — three accounts and one total */}
        <div className="max-w-[30rem]">
          <div>
            <Eyebrow>Cash · {sgd(LIQUIDITY.cash, 1)}</Eyebrow>
            <dl className="mt-4">
              {BANK_ACCOUNTS.map((account) => (
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
                    {sgd(account.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

        </div>

        {/* structure, at full width — the widest thing in the chapter, because the
            indent is the information and it needs the room to be legible */}
        <Figure
          className="mt-16"
          label="Held through"
          title="Only two groups of assets have a named holder"
          note={
            <>
              The two entities and what they hold are on file. The third group is
              everything left once those are taken out, and no owner is named for
              any of it — one of the things the frozen governance discussion
              below would settle.
            </>
          }
        >
          <EntityStructure />
        </Figure>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 05 — four issues, four forms                                        */}
      {/* ------------------------------------------------------------------ */}
      <Chapter
        id="c05"
        number="05"
        title="What needs attention"
        className="mt-20"
      >
        {/* 5A — the one with a number she set herself */}
        <section>
          <h3 className="max-w-[46ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            Cash drops below the minimum she set herself at the first capital
            call, and never recovers
          </h3>
          <Narrative className="mt-4 mb-10">
            <p>
              {sgd(LIQUIDITY.cash, 2)} today, {sgd(LIQUIDITY.committed, 2)}{" "}
              committed across five dated items, {sgd(LIQUIDITY.after, 2)} left.
              That is {sgd(LIQUIDITY.gap, 2)} short of the{" "}
              {sgd(LIQUIDITY.reserve)} she wants to keep in reserve, and the
              first payment on 12 October takes her under it on its own.
            </p>
          </Narrative>
          <LiquidityLadder />
          <Narrative className="mt-10">
            <p>
              None of the five is optional, so the question is not whether to pay
              but what to sell. The only thing she can sell quickly is the bond
              portfolio that exists to be the reserve.
            </p>
          </Narrative>
        </section>

        <Separator className="my-16" />

        {/* 5B — the dot plot, at full width */}
        <section>
          <h3 className="max-w-[48ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            {sgd(STALE_VALUE)} of what she owns was last valued more than nine
            months ago
          </h3>
          <Narrative className="mt-4 mb-10">
            <p>
              {STALE.map((row) => row.name).join(" and ")} are the two, together{" "}
              {pct(staleShare, 0)} of assets. Her own file already flags the
              first as <em>stale</em>, and the nine-month line below is hers, not
              one introduced here.
            </p>
          </Narrative>
          <ValuationAge />
          <Narrative className="mt-10">
            <p>
              Net worth, and every percentage in <em>What she owns</em>, is
              calculated from these valuations. The cheapest fix is the oldest
              one: {oldest.name} at {sgd(oldest.value)} is a single manager
              statement away from being current, and is already an open action
              with no date against it.
            </p>
          </Narrative>
        </section>

        <Separator className="my-16" />

        {/* 5C — the same total as chapter 04, cut by what can actually be sold */}
        <section>
          <h3 className="max-w-[48ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            {pct(BALANCE_SHEET.illiquidShare, 1)} of her money is hard to sell,
            and nobody has ever written that down as the plan
          </h3>
          <div className="mt-8">
            <RealisableSplit />
          </div>
          <Narrative className="mt-10">
            <p>
              No target allocation is recorded anywhere, so{" "}
              {pct(BALANCE_SHEET.illiquidShare, 1)} is neither inside a limit nor
              outside one — it cannot be called a breach, and it cannot be called
              deliberate. Agreeing a number is what the committee discussion is
              for.
            </p>
          </Narrative>
        </section>

        <Separator className="my-16" />

        {/* 5D — the freeze, and who is waiting on it */}
        <section>
          <h3 className="max-w-[48ch] text-2xl leading-tight font-medium tracking-tight text-balance">
            Nothing can be moved or restructured until one question is settled
          </h3>
          <div className="mt-8">
            <DecisionOrder />
          </div>

          <div className="mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start">
            <Narrative className="max-w-none">
              <p>
                This order is fixed rather than a preference, and it has a cost:
                the cash shortfall above would normally be closed by moving
                assets between entities, which is exactly what is frozen.
              </p>
            </Narrative>

            <div>
              <Eyebrow>Who is waiting on it</Eyebrow>
              <dl className="mt-4">
                {FAMILY.map((member) => (
                  <div
                    key={member.name}
                    className="border-b border-dotted py-3"
                  >
                    <dt className="text-[0.8125rem] font-medium">
                      {member.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {member.relationship}
                      </span>
                    </dt>
                    <dd className="mt-0.5 text-xs text-muted-foreground">
                      {member.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 06 — the schedule                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c06" number="06" title="What's coming" className="mt-20">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,32rem)_minmax(0,1fr)] lg:items-start">
          <EventTimeline events={UPCOMING} />
          <Narrative className="max-w-none text-[0.8125rem] lg:pt-1">
            <p>
              Five dates and one item with no date. All five are still to be
              paid, and the undated one holds up the rest: while transfers are
              frozen, the only way to meet a call is to sell something rather
              than move it.
            </p>
            <p>
              Two of the amounts are less certain — the refurbishment and the tax
              payment — so {sgd(uncertainTiming, 1)} of the{" "}
              {sgd(LIQUIDITY.committed, 2)} could land in a different quarter.
              That moves the shortfall rather than closing it.
            </p>
            <p>
              A further {sgd(LIQUIDITY.unfunded, 2)} of fund commitments has not
              been called and has no date, so it is not on this timeline at all.
            </p>
          </Narrative>
        </div>
      </Chapter>

      {/* ------------------------------------------------------------------ */}
      {/* 07 — decisions                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Chapter id="c07" number="07" title="What to decide" className="mt-20">
        <div className="max-w-[760px]">
          <DecisionList decisions={DECISIONS} />
        </div>
      </Chapter>

      {/* sources */}
      <footer className="mt-20 border-t pt-8">
        <Eyebrow>Basis of preparation</Eyebrow>

        {/* The provenance, as a picture: a balance sheet stated at one date is really
            marks taken on seven, and this is the only place in the report where that
            spread is visible all at once. */}
        <div className="mt-7">
          <AsAtMap />
        </div>

        <dl className="mt-10 grid max-w-[880px] gap-x-10 gap-y-2.5 text-xs sm:grid-cols-2">
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
          Every figure on this page comes from her client file — at purchase price
          or last valuation, in Singapore dollars, as recorded there. Nothing here
          is estimated or made up, which is why there is no performance history:
          there is none on file. Valuations older than {STALE_THRESHOLD_MONTHS}{" "}
          months are named in <em>What needs attention</em>.{" "}
          {OPEN_ACTIONS.length} open actions are on file, and the five decisions
          above come from those and from questions she has raised herself.
        </p>
      </footer>
    </article>
  )
}

export { EleanorReport }
