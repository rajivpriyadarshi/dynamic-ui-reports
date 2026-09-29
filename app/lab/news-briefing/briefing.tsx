import {
  ACTION_BEARING,
  ACTIONS_UNTOUCHED,
  ATTENTION,
  AVERAGING,
  BEARING,
  COMPOSITION,
  CONCENTRATION,
  CONFLICTS,
  COVERAGE,
  FILINGS,
  ITEMS,
  NOT_AVAILABLE,
  SIGNAL,
  STORIES,
  STORY_JUDGEMENTS,
  VERDICT,
  WINDOW,
  bandOf,
  pct,
  usd,
} from "./data"
import { CLIENT } from "@/app/lab/portfolio-report/prashanth/data"
import { ActionBearing } from "@/components/news-briefing/action-bearing"
import {
  BookCoverage,
  type CoverageRow,
} from "@/components/news-briefing/book-coverage"
import { BriefingSection, Lede } from "@/components/news-briefing/briefing"
import { FeedComposition } from "@/components/news-briefing/feed-composition"
import { SentimentSpread } from "@/components/news-briefing/sentiment-spread"
import {
  StoryRelevance,
  type StoryGroup,
} from "@/components/news-briefing/story-relevance"
import { Separator } from "@/components/ui/separator"

/**
 * A news briefing for one client, over one real news feed.
 *
 * Both sources are his: five listed positions worth US$25.22m across four custodians, and a
 * captured Alpha Vantage `NEWS_SENTIMENT` response of 50 items published over the last two and a
 * half days. Nothing is invented. `NEWS_SENTIMENT` carries no prices, so no figure on this page
 * is a valuation or a forecast — every dollar amount is his own position size from his statements.
 *
 * The page answers the question in the order he would ask it.
 *
 *   1. What happened that reaches my money. Twelve of the fifty items are the first report of
 *      something; one bears on a decision already open on his file, three are material events,
 *      and eight are commentary or paperwork. Each carries the money it touches and the custodian
 *      split of that money, which is the part neither source holds alone.
 *
 *   2. Does any of it change what we are already doing. Three of his four open actions cannot be
 *      reached by a ticker-keyed feed at all. Saying so plainly is the most useful output here.
 *
 *   3. What the feed did not tell him. Its attention is close to the inverse of his exposure:
 *      fifty items on 23.6% of the book and nothing whatever on the 37.7% held in an index fund.
 *      All of the coverage lands inside the one sector that is already 56.6% of his holdings.
 *
 *   4. Why the briefing is four stories and not fifty — the method, kept last and kept short,
 *      because it is justification rather than news. Including the one place the source is
 *      actively misleading: averaging its own scores turns a US$5.7bn adverse verdict Neutral.
 */

function NewsBriefing() {
  const rows: CoverageRow[] = COVERAGE.map((entry) => ({
    ticker: entry.ticker,
    name: entry.name,
    weight: entry.weight,
    attention: entry.items / WINDOW.items,
    items: entry.items,
    reports: entry.reports,
    sentiment: entry.reportSentiment,
    band: entry.reportSentiment === null ? null : bandOf(entry.reportSentiment),
  }))

  const groups: StoryGroup[] = STORY_JUDGEMENTS.counts
    .filter((entry) => entry.count > 0)
    .map((entry) => ({
      bearing: entry.bearing,
      label: BEARING[entry.bearing].label,
      definition: BEARING[entry.bearing].definition,
      stories: STORIES.filter((story) => story.bearing === entry.bearing),
    }))

  const material = STORIES.filter((story) => story.bearing === "material")
  /** The stories the briefing is actually about: the decision and the material events. */
  const acted = STORIES.filter(
    (story) => story.bearing === "decision" || story.bearing === "material"
  )
  const verdict = VERDICT
  const largest = COVERAGE.reduce((best, entry) =>
    entry.weight > best.weight ? entry : best
  )

  const spreadMarks = [
    {
      id: "cluster",
      score: AVERAGING.cluster.mean,
      label: `The ${AVERAGING.cluster.reports} reports of the ${AVERAGING.cluster.award} verdict, averaged`,
      emphasis: true,
    },
    {
      id: "reports",
      score: AVERAGING.reportsOnly,
      label: `${SIGNAL.reports} first reports only`,
    },
    {
      id: "all",
      score: AVERAGING.all,
      label: `All ${WINDOW.items} items, as the feed arrives`,
    },
    {
      id: "filings",
      score: AVERAGING.filingsOnly,
      label: "The 13F and Form 4 notices alone",
    },
  ]

  return (
    <div className="mx-auto max-w-[1040px] px-6 py-16 sm:px-10 lg:py-20">
      <header className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
            News briefing · {CLIENT.entity}
          </p>
          <p className="font-mono text-[0.6875rem] text-muted-foreground">
            {WINDOW.from} — {WINDOW.to}
          </p>
        </div>
        <h1 className="mt-4 max-w-[36ch] text-[2.5rem] leading-[1.05] font-medium tracking-tight">
          Of {WINDOW.items} items this week, {acted.length} reach his book. The
          consequential one is a {AVERAGING.cluster.award} verdict against
          Apple.
        </h1>
        <p className="mt-3.5 max-w-[70ch] text-sm text-muted-foreground">
          {WINDOW.items} items across {WINDOW.hours} hours, read against{" "}
          {CLIENT.name}&apos;s {ATTENTION.positions} listed positions,{" "}
          {usd(ATTENTION.marketValue)}. {STORY_JUDGEMENTS.total} are the first
          report of anything; {STORY_JUDGEMENTS.total - acted.length} of those
          are commentary or paperwork. Dollar amounts below are his
          position sizes, not valuations — this source carries no prices.
        </p>
      </header>

      <div className="space-y-16 lg:space-y-20">
        <BriefingSection label="What reaches the book" id="stories">
          <Lede className="mb-10">
            <p>
              The week&apos;s one consequential event is an adverse patent
              verdict against Apple of {AVERAGING.cluster.award}, reported first
              by {verdict.source} on {verdict.at} and retold{" "}
              {AVERAGING.cluster.reports - 1} more times before the window
              closed. It reaches <strong>{usd(verdict.exposure)}</strong> —{" "}
              {pct(
                COVERAGE.find((entry) => entry.ticker === "AAPL")!.weight
              )}{" "}
              of the listed book. That exposure is not in
              one place:{" "}
              {CONCENTRATION.custodians
                .map((slice) => `${slice.custodian} ${slice.amount.toFixed(2)}`)
                .join(", ")}
              . The largest statement he receives shows him{" "}
              {pct(CONCENTRATION.largestCustodianShare, 0)} of what the verdict
              reaches, which is why the figure above appears nowhere on his
              custody reporting.
            </p>
            <p>
              Ranked below by what each story bears on rather than by how much
              money it happens to mention. That distinction matters: the item
              touching the most money in the window is{" "}
              {usd(STORY_JUDGEMENTS.richest.exposure)} across both technology
              names, and it is an opinion column that reports nothing. Ordering
              by dollars would have made it the lede.
            </p>
          </Lede>
          <StoryRelevance groups={groups} />
        </BriefingSection>

        <BriefingSection label="Against what is already open" id="actions">
          {/* The narrowest block on the page. Four rows and two short columns; giving it the
              full measure would leave the reasons floating in white space. */}
          <Lede className="mb-9">
            <p>
              <strong>
                {ACTIONS_UNTOUCHED} of the {ACTION_BEARING.length} actions
              </strong>{" "}
              carried out of the {CLIENT.reviewedOn} review are untouched by
              anything in this window, for a different reason in each case. The
              fourth — the NVIDIA overweight — is reached by exactly one item,
              and it is an argument for holding NVIDIA over Apple rather than a
              development at either company. Enough to raise the question again,
              not enough to answer it.
            </p>
          </Lede>
          <div className="max-w-[48rem]">
            <ActionBearing actions={ACTION_BEARING} />
          </div>
        </BriefingSection>

        <BriefingSection label="What the feed did not cover" id="coverage">
          <Lede className="mb-9">
            <p>
              The feed is keyed on tickers, so it sees the book the way a
              newsroom does rather than the way he holds it.{" "}
              <strong>{largest.name}</strong> is{" "}
              <strong>{pct(largest.weight)}</strong> of the listed book and
              appears in none of the {WINDOW.items} items — index funds do not
              issue news, and nothing in this source is watching the index they
              track. Together with his Treasury bills that is{" "}
              <strong>{pct(ATTENTION.uncoveredWeight)}</strong> of the money,{" "}
              {usd(ATTENTION.uncoveredValue)}, entirely unreported on.
            </p>
            <p>
              Everything it did cover sits inside one sector. Technology is{" "}
              {usd(CONCENTRATION.technology)} —{" "}
              {pct(CONCENTRATION.technologyWeight)} of his listed holdings — and
              it is the whole of the book this feed reports on at all. A feed
              this shaped
              will always report his concentration back to him as news flow, and
              will never mention the {pct(ATTENTION.uncoveredWeight, 0)} that
              offsets it.
            </p>
            <p>
              Microsoft and NVIDIA each draw one first report in the window — an
              opinion column and a which-to-buy comparison. The sentiment beside
              them below is one writer&apos;s tone on a sample of one, which is
              why neither appears among the material events above.
            </p>
          </Lede>
          <BookCoverage rows={rows} />
        </BriefingSection>

        <BriefingSection label="Why four and not fifty" id="method">
          <div className="grid gap-x-16 gap-y-9 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
            <Lede>
              <p>
                <strong>{SIGNAL.reports}</strong> of the {WINDOW.items} items —{" "}
                {pct(SIGNAL.share, 0)} — are the first report of something
                happening at a company he owns. The rest is retelling, paperwork
                and passing mentions. {acted.length} of those {SIGNAL.reports}
                survive the second cut, which is the one above: an event with a
                consequence, or a bearing on something already open.
              </p>
              <p>
                The single largest source is {SIGNAL.topSource.source}, at{" "}
                {SIGNAL.topSource.count} items, and it is not a newsroom:{" "}
                {FILINGS.aapl} of them are the same article about who bought
                Apple in {FILINGS.quarter}, with a different institution&apos;s
                name in it. {FILINGS.repeated} repeat the identical{" "}
                {FILINGS.consensusTarget} consensus target and the identical{" "}
                {FILINGS.institutionalOwnership} ownership figure. That is the
                only market data in the feed, and it is a quarter old.
              </p>
            </Lede>
            <FeedComposition bands={COMPOSITION} total={WINDOW.items} />
          </div>

          <Separator className="my-12" />

          <Lede className="mb-10">
            <p>
              One thing this source will do to a reader who trusts its own
              summary statistics. Across all {WINDOW.items} items
              Apple&apos;s relevance-weighted sentiment is{" "}
              <strong>{signed(AVERAGING.all)}</strong>, which the vendor&apos;s
              own bands call <strong>{bandOf(AVERAGING.all)}</strong>. Across the
              six reports of the {AVERAGING.cluster.award} verdict it is{" "}
              <strong>{signed(AVERAGING.cluster.mean)}</strong> —{" "}
              {bandOf(AVERAGING.cluster.mean)}. Nothing about Apple differs
              between those two numbers; the filing notices outvoted the verdict.
            </p>
          </Lede>
          <SentimentSpread
            marks={spreadMarks}
            reports={AVERAGING.cluster.members}
            clusterLabel={AVERAGING.cluster.label}
            award={AVERAGING.cluster.award}
          />

          <p className="mt-10 max-w-[68ch] border-l pl-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
            The classification behind every count above — first report, repeat,
            filing, passing mention — is ours and not the vendor&apos;s, and is
            applied by rule to all {ITEMS.length} items rather than chosen item
            by item: anything from a 13F alert service or headed{" "}
            <span className="font-mono">Form 4</span> is a filing, anything
            scoring below 0.75 relevance on every position he holds is a passing
            mention, and where two headlines describe one event the earlier one
            is the report. What each story <em>bears on</em> is a judgement, not
            a rule; all {STORY_JUDGEMENTS.total} are assigned individually with
            the reason printed beside the headline, and{" "}
            {STORY_JUDGEMENTS.unassigned === 0
              ? "none were left to a default"
              : `${STORY_JUDGEMENTS.unassigned} fell to the default`}
            . Separately, in {CONFLICTS.length} items the feed&apos;s headline
            sentiment and its score for the position he holds fall in different
            bands — usually because the negativity belongs to Alphabet, which he
            does not own — so no figure here reads{" "}
            <span className="font-mono">overall_sentiment_label</span> as the
            sentiment on a holding.
          </p>
        </BriefingSection>
      </div>

      <footer className="mt-20">
        <Separator className="mb-7" />
        <h2 className="font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
          What this briefing cannot tell him
        </h2>
        <ul className="mt-5 grid max-w-[88ch] gap-x-10 gap-y-2.5 sm:grid-cols-2">
          {NOT_AVAILABLE.map((item) => (
            <li
              key={item}
              className="text-[0.8125rem] leading-relaxed text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}

const signed = (score: number) =>
  `${score >= 0 ? "+" : "−"}${Math.abs(score).toFixed(2)}`

export { NewsBriefing }
