import feed from "./alphavantage-feed.json"
import {
  BY_CUSTODIAN,
  CLIENT,
  LISTED,
  OPEN_ACTIONS,
  POSITIONS,
  TECHNOLOGY,
  weightOfListed,
} from "@/app/lab/portfolio-report/prashanth/data"

/**
 * The news briefing's data layer: Prashanth's own record joined to a real news feed.
 *
 *   REAL — the client. `CLIENT`, `POSITIONS`, `BY_CUSTODIAN`, `TECHNOLOGY` and `OPEN_ACTIONS`
 *          from his fixture: five listed holdings worth US$25.22m across four custodians, and
 *          the open actions carried out of the 7 August review.
 *   REAL — the news. One captured Alpha Vantage `NEWS_SENTIMENT` response, 50 items published
 *          25–28 September 2026, stored verbatim in `./alphavantage-feed.json`.
 *   DERIVED — every count, share, weighted average, dollar exposure and classification below.
 *   EDITORIAL — which stories bear on him and why. Declared once, in `BEARING` and `STORY_NOTES`,
 *          with the reason attached to each, so a reader can disagree with a specific judgement
 *          rather than the whole page. Never a price or a forecast.
 *
 * The briefing exists because the feed and his statements each answer half the question. The
 * feed knows Apple lost a patent case; it does not know he holds US$5.95m of Apple split across
 * four custodians, so no statement he receives shows him the whole exposure. His statements know
 * the position; they do not know what happened. Only the join says what the week means to him.
 *
 * NOT PRESENT IN EITHER SOURCE, and therefore never asserted: price moves, volumes, returns,
 * forecasts. `NEWS_SENTIMENT` carries no market data. An earlier draft attributed a session's
 * price movement to news, which required inventing the movement; that fixture is deleted. The one
 * price on the page is triangulated from the feed's own filings and is labelled as such.
 */

/* -------------------------------------------------------------------------- */
/* The vendor payload, typed                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Alpha Vantage sends every score as a string. Parsed once here, at the edge, so no component
 * ever has to remember to coerce and no comparison silently becomes lexicographic.
 */
type RawItem = {
  title: string
  url: string
  time_published: string
  authors: string[]
  summary: string
  source: string
  topics: { topic: string; relevance_score: string }[]
  overall_sentiment_score: number
  overall_sentiment_label: string
  ticker_sentiment: {
    ticker: string
    relevance_score: string
    ticker_sentiment_score: string
    ticker_sentiment_label: string
  }[]
}

export type TickerMention = {
  ticker: string
  /** 0 < x <= 1, higher meaning the item is more about this ticker. */
  relevance: number
  /** −1 to 1. Bands as the vendor defines them, in `BANDS` below. */
  sentiment: number
  /** The vendor's own label for `sentiment`. Kept rather than recomputed, so the page can
   * show where the vendor disagrees with itself. */
  label: string
}

/**
 * What kind of item this is. The whole point of the briefing is that these are not equivalent,
 * and that a feed which presents them as fifty interchangeable "stories" misleads.
 *
 * Assigned by rule, in the order below, in `classify`. No item is hand-labelled.
 */
export type ItemClass =
  /** Ownership and regulatory paperwork: 13F position notices, Form 4/8K/13D alerts. Reports
   * a change in who holds the stock, never anything about the company. */
  | "filing"
  /** A held name appears, but the item is about something else — relevance below 0.75 on every
   * position he owns. */
  | "incidental"
  /** A later report of an event already counted. Same event, another newsroom. */
  | "echo"
  /** Something happened, at a company he owns, reported first. */
  | "report"

export type Item = {
  index: number
  title: string
  url: string
  source: string
  /** ISO-ish display form of `time_published`, e.g. "25 Sep 23:30". */
  at: string
  /** The raw `YYYYMMDDTHHMMSS`, kept for sorting. */
  stamp: string
  summary: string
  overall: number
  overallLabel: string
  mentions: TickerMention[]
  kind: ItemClass
  /** Set on `echo` and on the item they echo, so the page can show the cluster. */
  cluster: string | null
}

/** The vendor's own band definitions, lifted verbatim from the payload so they cannot drift. */
export const BANDS = feed.sentiment_score_definition
export const RELEVANCE_DEFINITION = feed.relevance_score_definition

const RAW = feed.feed as RawItem[]

/* -------------------------------------------------------------------------- */
/* Classification                                                              */
/* -------------------------------------------------------------------------- */

/** The three single names in the book. VOO and TBILL are the point of the coverage section. */
const HELD = POSITIONS.map((position) => position.ticker)

/**
 * Two events in this window were reported more than once. The members are declared here rather
 * than detected, because deciding that two headlines describe one event is a judgement and
 * should be visible as one; the *consequence* — which member is the first report and which are
 * echoes — is then derived from the timestamps.
 */
const CLUSTERS: Record<string, { label: string; matches: RegExp }> = {
  haptics: {
    label: "Taction patent verdict",
    matches: /5\.7 [Bb]illion/,
  },
  antitrust: {
    label: "X Corp drops Apple from its antitrust suit",
    matches: /^Musk's X Corp/,
  },
}

const clusterOf = (title: string) =>
  Object.keys(CLUSTERS).find((key) => CLUSTERS[key].matches.test(title)) ?? null

/** 13F instant alerts and Form N notices. Both are paperwork, not news about a company. */
const isFiling = (item: RawItem) =>
  item.source === "MarketBeat" || /^Form (4|8K|13D)/.test(item.title)

/** The relevance floor separating "this item is about a company he owns" from "a company he
 * owns is mentioned in it". Set at the vendor's own scale; every genuine report about a held
 * name in this window scores above 0.95, and every passing mention below 0.75. */
const RELEVANCE_FLOOR = 0.75

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** `YYYYMMDDTHHMMSS` is not parseable as-is. Treated as UTC, which is what the vendor sends. */
const isoOf = (stamp: string) =>
  `${stamp.slice(0, 4)}-${stamp.slice(4, 6)}-${stamp.slice(6, 8)}T${stamp.slice(9, 11)}:${stamp.slice(11, 13)}:${stamp.slice(13, 15)}Z`

const displayTime = (stamp: string) =>
  `${Number(stamp.slice(6, 8))} ${MONTHS[Number(stamp.slice(4, 6)) - 1]} ${stamp.slice(9, 11)}:${stamp.slice(11, 13)}`

/** Earliest published member of each cluster, which is the report; the rest are echoes. */
const FIRST_IN_CLUSTER = new Map<string, string>()
for (const item of RAW) {
  const key = clusterOf(item.title)
  if (!key) continue
  const held = FIRST_IN_CLUSTER.get(key)
  if (!held || item.time_published < held) FIRST_IN_CLUSTER.set(key, item.time_published)
}

export const ITEMS: Item[] = RAW.map((item, index) => {
  const mentions: TickerMention[] = item.ticker_sentiment.map((mention) => ({
    ticker: mention.ticker,
    relevance: Number(mention.relevance_score),
    sentiment: Number(mention.ticker_sentiment_score),
    label: mention.ticker_sentiment_label,
  }))

  const cluster = clusterOf(item.title)
  const topHeld = Math.max(
    0,
    ...mentions.filter((mention) => HELD.includes(mention.ticker)).map((mention) => mention.relevance)
  )

  const kind: ItemClass = isFiling(item)
    ? "filing"
    : topHeld < RELEVANCE_FLOOR
      ? "incidental"
      : cluster && FIRST_IN_CLUSTER.get(cluster) !== item.time_published
        ? "echo"
        : "report"

  return {
    index,
    title: item.title,
    url: item.url,
    source: item.source,
    at: displayTime(item.time_published),
    stamp: item.time_published,
    summary: item.summary,
    overall: item.overall_sentiment_score,
    overallLabel: item.overall_sentiment_label,
    mentions,
    kind,
    cluster,
  }
})

/* -------------------------------------------------------------------------- */
/* The window                                                                  */
/* -------------------------------------------------------------------------- */

const STAMPS = ITEMS.map((item) => item.stamp).sort()

export const WINDOW = {
  items: ITEMS.length,
  /** What the vendor claims it returned, for the one place the page states the request. */
  claimed: Number(feed.items),
  from: displayTime(STAMPS[0]),
  to: displayTime(STAMPS[STAMPS.length - 1]),
  /**
   * Elapsed hours between the first and last item, not the count of distinct calendar dates.
   * The dates span four days and the window is barely more than two, so a day count would
   * overstate the window by most of a working week.
   */
  hours: Math.round(
    (Date.parse(isoOf(STAMPS[STAMPS.length - 1])) - Date.parse(isoOf(STAMPS[0]))) / 3_600_000
  ),
  /** Distinct tickers the feed touches, against the five he holds. */
  tickers: new Set(ITEMS.flatMap((item) => item.mentions.map((mention) => mention.ticker))).size,
}

/* -------------------------------------------------------------------------- */
/* Sentiment aggregation                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Relevance-weighted mean sentiment, which is the least-bad way to average these scores: an
 * item the vendor thinks is 0.6 about Apple should not count as much as one it thinks is 1.0.
 *
 * It is still an average, and the briefing's third section is about why that matters. Kept as
 * one function so the page can run it over different subsets and show the answers diverging.
 */
const weightedSentiment = (items: Item[], ticker: string) => {
  const mentions = items
    .map((item) => item.mentions.find((mention) => mention.ticker === ticker))
    .filter((mention): mention is TickerMention => mention !== undefined)
  if (mentions.length === 0) return null
  const weight = mentions.reduce((total, mention) => total + mention.relevance, 0)
  return mentions.reduce((total, mention) => total + mention.relevance * mention.sentiment, 0) / weight
}

/** The vendor's bands, applied to a number we computed, so an average carries the same label
 * language the feed itself uses. Thresholds transcribed from `BANDS`. */
export const bandOf = (score: number) =>
  score <= -0.35
    ? "Bearish"
    : score <= -0.15
      ? "Somewhat-Bearish"
      : score < 0.15
        ? "Neutral"
        : score < 0.35
          ? "Somewhat-Bullish"
          : "Bullish"

/* -------------------------------------------------------------------------- */
/* Coverage of the book                                                        */
/* -------------------------------------------------------------------------- */

export type Coverage = {
  ticker: string
  name: string
  weight: number
  marketValue: number
  /** Every item mentioning the position, at any relevance. */
  items: number
  /** Items that are a first report of something at the company itself. */
  reports: number
  /** Relevance-weighted mean across all mentions, or null where there are none. */
  sentiment: number | null
  /** The same average over `report` items only. Diverges from `sentiment` wherever the filings
   * and the incidental mentions outnumber the news, which is most of the book. */
  reportSentiment: number | null
}

export const COVERAGE: Coverage[] = POSITIONS.map((position) => {
  const mentioning = ITEMS.filter((item) =>
    item.mentions.some((mention) => mention.ticker === position.ticker)
  )
  const reports = mentioning.filter((item) => item.kind === "report")

  return {
    ticker: position.ticker,
    name: position.name,
    weight: weightOfListed(position.marketValue),
    marketValue: position.marketValue,
    items: mentioning.length,
    reports: reports.length,
    sentiment: weightedSentiment(mentioning, position.ticker),
    reportSentiment: weightedSentiment(reports, position.ticker),
  }
})

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

/**
 * The finding the coverage section exists for: the feed's attention and his exposure are close
 * to inverted. The largest holding in the book draws no coverage at all, because index funds do
 * not issue news, and a ticker-driven feed has nothing to say about 37.7% of his money.
 */
export const ATTENTION = {
  marketValue: LISTED.marketValue,
  positions: POSITIONS.length,
  covered: COVERAGE.filter((entry) => entry.items > 0),
  uncovered: COVERAGE.filter((entry) => entry.items === 0),
  get uncoveredWeight() {
    return sum(this.uncovered.map((entry) => entry.weight))
  },
  get uncoveredValue() {
    return sum(this.uncovered.map((entry) => entry.marketValue))
  },
  /** Share of all 50 items that mention the most-covered position. */
  get concentration() {
    const top = COVERAGE.reduce((best, entry) => (entry.items > best.items ? entry : best))
    return { ticker: top.ticker, weight: top.weight, share: top.items / ITEMS.length }
  },
}

/* -------------------------------------------------------------------------- */
/* What the fifty items are made of                                            */
/* -------------------------------------------------------------------------- */

export type Composition = {
  kind: ItemClass
  label: string
  count: number
  note: string
}

const COMPOSITION_NOTES: Record<ItemClass, { label: string; note: string }> = {
  report: {
    label: "First reports",
    note: "Something happened at a company he owns, reported here first. This is the part of the feed worth reading.",
  },
  echo: {
    label: "Repeat reports",
    note: "Two events, retold. The patent verdict arrives six times from six newsrooms; a ticker count treats that as six pieces of bad news.",
  },
  filing: {
    label: "Filings and 13F alerts",
    note: "Who bought the stock last quarter, and Form 4 notices for companies he does not own. Machine-generated, and the largest class in the feed.",
  },
  incidental: {
    label: "Passing mentions",
    note: "A held name appears below the relevance floor: a UPS warning-signs page, a Phoenix apartment sale, a Yahoo page that failed to load.",
  },
}

/** Ordered by usefulness, deliberately not by count — the smallest class is the one that matters. */
const COMPOSITION_ORDER: ItemClass[] = ["report", "echo", "filing", "incidental"]

export const COMPOSITION: Composition[] = COMPOSITION_ORDER.map((kind) => ({
  kind,
  label: COMPOSITION_NOTES[kind].label,
  count: ITEMS.filter((item) => item.kind === kind).length,
  note: COMPOSITION_NOTES[kind].note,
}))

export const SIGNAL = {
  reports: ITEMS.filter((item) => item.kind === "report").length,
  total: ITEMS.length,
  get share() {
    return this.reports / this.total
  },
  /** The single largest source in the feed, which is not a newsroom. */
  get topSource() {
    const counts = new Map<string, number>()
    for (const item of ITEMS) counts.set(item.source, (counts.get(item.source) ?? 0) + 1)
    const [source, count] = [...counts].sort((a, b) => b[1] - a[1])[0]
    return { source, count, share: count / ITEMS.length }
  },
}

/* -------------------------------------------------------------------------- */
/* The one story large enough to matter                                        */
/* -------------------------------------------------------------------------- */

const clusterMembers = (key: string) =>
  ITEMS.filter((item) => item.cluster === key).sort((a, b) => (a.stamp < b.stamp ? -1 : 1))

const HAPTICS = clusterMembers("haptics")

/**
 * The averaging problem, stated as arithmetic rather than asserted.
 *
 * Across all fifty items Apple's relevance-weighted sentiment is faintly positive and the
 * vendor's own bands call it Neutral. Across the six reports of the patent verdict it is
 * Bearish. The difference is not disagreement about Apple; it is twenty-four filing notices
 * outvoting the largest patent award in US history.
 */
export const AVERAGING = {
  ticker: "AAPL",
  all: weightedSentiment(ITEMS, "AAPL") as number,
  reportsOnly: weightedSentiment(
    ITEMS.filter((item) => item.kind === "report"),
    "AAPL"
  ) as number,
  filingsOnly: weightedSentiment(
    ITEMS.filter((item) => item.kind === "filing"),
    "AAPL"
  ) as number,
  cluster: {
    key: "haptics",
    label: CLUSTERS.haptics.label,
    /** The award, as reported. Stated because it is the only figure in the whole feed large
     * enough to be worth a portfolio decision, and the feed's own scores do not carry it. */
    award: "US$5.7bn",
    reports: HAPTICS.length,
    mean: sum(
      HAPTICS.map((item) => item.mentions.find((m) => m.ticker === "AAPL")?.sentiment ?? 0)
    ) / HAPTICS.length,
    members: HAPTICS.map((item) => ({
      source: item.source,
      at: item.at,
      title: item.title,
      sentiment: item.mentions.find((m) => m.ticker === "AAPL")?.sentiment ?? 0,
      label: item.mentions.find((m) => m.ticker === "AAPL")?.label ?? "",
    })),
  },
}

/* -------------------------------------------------------------------------- */
/* The stories, ranked by what they bear on rather than by volume              */
/* -------------------------------------------------------------------------- */

/**
 * How much a story bears on him, and why that has to be declared rather than computed.
 *
 * The obvious ranking is by dollar exposure: multiply each story by the market value of the
 * positions it touches and sort. That ranking puts an opinion column at the top of his briefing,
 * because the one item in the window that happens to mention both Microsoft and Apple touches
 * US$10.71m and says nothing. Volume ranking has the same failure in a different direction.
 *
 * So bearing is assigned first and exposure orders within it. The assignment is a judgement and
 * is written down as one, with a reason per story, so he can disagree with a specific line
 * instead of with the sort.
 */
export type Bearing = "decision" | "material" | "context" | "procedural"

export const BEARING: Record<Bearing, { label: string; definition: string }> = {
  decision: {
    label: "Bears on a decision",
    definition: `Speaks to something already open on his file from the ${CLIENT.reviewedOn} review.`,
  },
  material: {
    label: "Material",
    definition: "A real event at a company he owns, with a financial consequence.",
  },
  context: {
    label: "Context",
    definition: "Commentary or comparison. No new fact about a company he owns.",
  },
  procedural: {
    label: "Procedural",
    definition: "Real, and too small to matter at his size.",
  },
}

const BEARING_ORDER: Bearing[] = ["decision", "material", "context", "procedural"]

/**
 * The editorial layer, and the only one on the page. Matched by title so the judgement sits next
 * to the headline it applies to. Any first report that matches nothing falls to `context` and is
 * counted in `STORY_JUDGEMENTS.unassigned`, which the page prints, so a silent miss cannot hide.
 */
const STORY_NOTES: { matches: RegExp; bearing: Bearing; note: string }[] = [
  {
    matches: /Which is the Better Stock to Buy/,
    bearing: "decision",
    note: "Reaches the NVIDIA overweight that has been open since August. It is an argument, not a development — but it is the only item in fifty that touches the question.",
  },
  {
    matches: /5\.7 Billion/,
    bearing: "material",
    note: "The largest figure attached to any company in the window, and the only one of an order that could move a position this size.",
  },
  {
    matches: /Renews its Global Patent License/,
    bearing: "material",
    note: "A multi-year licensing overhang settled. Removes a cost question rather than answering one.",
  },
  {
    matches: /Drop Apple From AI Antitrust/,
    bearing: "material",
    note: "A claim withdrawn, not defeated. The second-largest legal item in the window and it resolves in his favour.",
  },
  {
    matches: /fool's errand/,
    bearing: "context",
    note: "Touches the most money of any item here — both technology single names — and reports nothing. This is what a dollar-weighted ranking would have led with.",
  },
  {
    matches: /Alphabet vs\. Apple/,
    bearing: "context",
    note: "A comparison against a company he does not hold.",
  },
  {
    matches: /Apple Pay Launch in India/,
    bearing: "context",
    note: "The feed's own summary calls it an ecosystem-retention move rather than a near-term revenue event.",
  },
  {
    matches: /Italy's Labor Dispute/,
    bearing: "context",
    note: "A launch-week complication in one country.",
  },
  {
    matches: /This Week in Appleverse/,
    bearing: "context",
    note: "A weekly roundup. Everything in it appears elsewhere in this same feed.",
  },
  {
    matches: /\$250 million iPhone settlement/,
    bearing: "procedural",
    note: "A settlement of a size that does not register against the company, let alone against his holding.",
  },
  {
    matches: /gift card scam settlement/,
    bearing: "procedural",
    note: "US$1.25m, and eligibility guidance for Canadian claimants.",
  },
  {
    matches: /^Apple Overview$/,
    bearing: "procedural",
    note: "A futures quote page, not an article. It entered the feed with a relevance score high enough to pass every filter.",
  },
]

export type Story = {
  title: string
  url: string
  source: string
  at: string
  summary: string
  bearing: Bearing
  note: string
  /** Positions the item is genuinely about, with his money against each. */
  touches: { ticker: string; name: string; marketValue: number; sentiment: number }[]
  /** Sum of `touches`, which is the exposure the story reaches. */
  exposure: number
  /** Where that exposure actually sits. The feed cannot know this and no single custodian
   * statement shows the whole of it. */
  custodians: { custodian: string; amount: number }[]
}

const custodiansFor = (tickers: string[]) => {
  const totals = new Map<string, number>()
  for (const ticker of tickers) {
    for (const slice of BY_CUSTODIAN[ticker as keyof typeof BY_CUSTODIAN] ?? []) {
      totals.set(slice.custodian, (totals.get(slice.custodian) ?? 0) + slice.amount)
    }
  }
  return [...totals]
    .map(([custodian, amount]) => ({ custodian, amount }))
    .sort((a, b) => b.amount - a.amount)
}

const REPORTS = ITEMS.filter((item) => item.kind === "report")

export const STORIES: Story[] = REPORTS.map((item) => {
  const judgement = STORY_NOTES.find((entry) => entry.matches.test(item.title))
  const touches = item.mentions
    .filter((mention) => HELD.includes(mention.ticker) && mention.relevance >= RELEVANCE_FLOOR)
    .map((mention) => {
      const position = POSITIONS.find((entry) => entry.ticker === mention.ticker)!
      return {
        ticker: position.ticker,
        name: position.name,
        marketValue: position.marketValue,
        sentiment: mention.sentiment,
      }
    })
    .sort((a, b) => b.marketValue - a.marketValue)

  return {
    title: item.title,
    url: item.url,
    source: item.source,
    at: item.at,
    summary: item.summary,
    bearing: judgement?.bearing ?? "context",
    note: judgement?.note ?? "",
    touches,
    exposure: sum(touches.map((entry) => entry.marketValue)),
    custodians: custodiansFor(touches.map((entry) => entry.ticker)),
  }
}).sort(
  (a, b) =>
    BEARING_ORDER.indexOf(a.bearing) - BEARING_ORDER.indexOf(b.bearing) ||
    b.exposure - a.exposure ||
    // Most of the reports touch the same single position, so exposure ties constantly. Broken by
    // how strongly the feed scores the position it is about, which keeps the verdict above the
    // two lesser legal items rather than leaving three equal rows in arrival order.
    Math.max(...b.touches.map((touch) => Math.abs(touch.sentiment))) -
      Math.max(...a.touches.map((touch) => Math.abs(touch.sentiment)))
)

/** The week's lead, resolved by name rather than by position in the sort. */
export const VERDICT = STORIES.find((story) =>
  CLUSTERS.haptics.matches.test(story.title)
)!

export const STORY_JUDGEMENTS = {
  total: STORIES.length,
  unassigned: REPORTS.filter(
    (item) => !STORY_NOTES.some((entry) => entry.matches.test(item.title))
  ).length,
  counts: BEARING_ORDER.map((bearing) => ({
    bearing,
    count: STORIES.filter((story) => story.bearing === bearing).length,
  })),
  /** Highest exposure regardless of bearing — the item a dollar sort would have promoted. */
  richest: STORIES.reduce((best, story) => (story.exposure > best.exposure ? story : best)),
}

/* -------------------------------------------------------------------------- */
/* His concentration, which is where all the news lands                        */
/* -------------------------------------------------------------------------- */

/**
 * Why the feed's lopsidedness is not only the feed's problem. Everything it covers sits inside
 * one sector, and that sector is 56.6% of his listed holdings. The silence over VOO and the
 * Treasury bills is the other half of the same fact.
 */
export const CONCENTRATION = {
  technology: TECHNOLOGY.marketValue,
  technologyWeight: TECHNOLOGY.weight,
  /** Market value of positions any story in the window is genuinely about. */
  reportedOn: sum(
    POSITIONS.filter((position) =>
      STORIES.some((story) => story.touches.some((touch) => touch.ticker === position.ticker))
    ).map((position) => position.marketValue)
  ),
  custodians: custodiansFor(["AAPL"]),
  custodianCount: BY_CUSTODIAN.AAPL.length,
  largestCustodianShare:
    Math.max(...BY_CUSTODIAN.AAPL.map((slice) => slice.amount)) /
    POSITIONS.find((position) => position.ticker === "AAPL")!.marketValue,
}

/* -------------------------------------------------------------------------- */
/* What the window means for what is already open                              */
/* -------------------------------------------------------------------------- */

export type ActionBearing = {
  text: string
  owner: string | null
  due: string | null
  /** Stories in the window that speak to this action. Usually none, which is the finding. */
  stories: { title: string; source: string; at: string }[]
  /** Why nothing in the window reaches it, where nothing does. */
  reason: string
}

/**
 * His four open actions against the window. Three of them cannot be touched by a ticker-keyed
 * news feed at all — they concern mandates, a capital call and a trust — and the fourth is
 * reached by exactly one item, which is an opinion piece. Printed as a table of four rows
 * because "the news changes nothing you are already working on" is the most useful sentence a
 * weekly briefing can produce, and it is only credible if the rows are shown.
 */
const ACTION_LINKS: { matches: RegExp; story: RegExp | null; reason: string }[] = [
  {
    matches: /LGT discretionary mandate/,
    story: null,
    reason:
      "Nothing. Benchmark performance is not in this source, and the feed has no coverage of the index fund the mandate would be measured against.",
  },
  {
    matches: /Private Credit Partners/,
    story: null,
    reason:
      "Nothing. No item in the window touches private credit, and the feed carries no rates coverage that would bear on the Treasury bills funding it.",
  },
  {
    matches: /NVIDIA overweight/,
    story: /Which is the Better Stock to Buy/,
    reason: "",
  },
  {
    matches: /Withers/,
    story: null,
    reason: "Nothing. Trust and transfer mechanics are outside anything a news feed reports.",
  },
]

export const ACTION_BEARING: ActionBearing[] = OPEN_ACTIONS.map((action) => {
  const link = ACTION_LINKS.find((entry) => entry.matches.test(action.text))
  const stories = link?.story
    ? STORIES.filter((story) => link.story!.test(story.title)).map((story) => ({
        title: story.title,
        source: story.source,
        at: story.at,
      }))
    : []
  return {
    text: action.text,
    owner: action.owner,
    due: action.due,
    stories,
    reason: link?.reason ?? "Not assessed against this window.",
  }
})

export const ACTIONS_UNTOUCHED = ACTION_BEARING.filter(
  (action) => action.stories.length === 0
).length

/* -------------------------------------------------------------------------- */
/* What the largest class in the feed actually contains                        */
/* -------------------------------------------------------------------------- */

/**
 * The filing notices, counted rather than characterised. Seventeen of the twenty-four are the
 * same article about Apple with a different institution's name in it, and eleven of those repeat
 * the identical consensus target and the identical institutional-ownership figure — which is the
 * only market data anywhere in the feed, and it is a quarter old.
 */
export const FILINGS = {
  total: ITEMS.filter((item) => item.kind === "filing").length,
  aapl: ITEMS.filter((item) => item.kind === "filing" && /AAPL/.test(item.title)).length,
  /** Count of filing items repeating the same consensus figure, verbatim. */
  repeated: ITEMS.filter((item) => /340\.14/.test(item.summary)).length,
  consensusTarget: "US$340.14",
  institutionalOwnership: "67.73%",
  quarter: "the second quarter",
}

/* -------------------------------------------------------------------------- */
/* Where the vendor disagrees with itself                                      */
/* -------------------------------------------------------------------------- */

export type LabelConflict = {
  title: string
  source: string
  at: string
  overall: number
  overallLabel: string
  held: { ticker: string; sentiment: number; label: string }
  /** The unheld ticker in the same item carrying the sentiment the item's overall score
   * reflects. This is what makes the conflict explicable rather than just odd. */
  driver: { ticker: string; sentiment: number; label: string } | null
}

/**
 * Items whose headline sentiment and whose per-position sentiment land in different bands.
 *
 * Not an error on the vendor's part — an item can be bad news for one company and neutral for
 * another. It matters here because a briefing that reads `overall_sentiment_label` as "the
 * sentiment" will report bad news on positions he owns when the bad news belongs to a ticker
 * he does not. Every case below resolves the same way: the negativity is Alphabet's.
 */
const BAND_GAP = 0.2

export const CONFLICTS: LabelConflict[] = ITEMS.flatMap((item) => {
  const held = item.mentions.find(
    (mention) => HELD.includes(mention.ticker) && mention.relevance >= RELEVANCE_FLOOR
  )
  if (!held) return []
  if (bandOf(item.overall) === bandOf(held.sentiment)) return []
  if (Math.abs(item.overall - held.sentiment) < BAND_GAP) return []

  const driver =
    item.mentions
      .filter((mention) => !HELD.includes(mention.ticker))
      .sort((a, b) => a.sentiment - b.sentiment)[0] ?? null

  return [
    {
      title: item.title,
      source: item.source,
      at: item.at,
      overall: item.overall,
      overallLabel: item.overallLabel,
      held: { ticker: held.ticker, sentiment: held.sentiment, label: held.label },
      driver:
        driver && driver.sentiment < -BAND_GAP
          ? { ticker: driver.ticker, sentiment: driver.sentiment, label: driver.label }
          : null,
    },
  ]
}).sort((a, b) => Math.abs(b.overall - b.held.sentiment) - Math.abs(a.overall - a.held.sentiment))

/* -------------------------------------------------------------------------- */
/* What this source cannot answer                                             */
/* -------------------------------------------------------------------------- */

/**
 * Stated as a list because the absences are the most decision-relevant thing about the source,
 * and because the first item is what a reader will otherwise assume is here.
 */
export const NOT_AVAILABLE = [
  "Prices, price moves and volumes. NEWS_SENTIMENT returns none, so nothing on this page connects a story to what a position did, and no figure here is a valuation.",
  `The only market data in the feed is second-hand and a quarter old: a ${FILINGS.consensusTarget} consensus target and ${FILINGS.institutionalOwnership} institutional ownership, repeated inside ${FILINGS.repeated} filing notices about ${FILINGS.quarter}.`,
  `Any coverage of ${ATTENTION.uncovered.map((entry) => entry.ticker).join(" or ")} — ${pct(ATTENTION.uncoveredWeight, 0)} of the listed book.`,
  `Anything before ${WINDOW.from}. The window is ${WINDOW.hours} hours, which is too short to read a trend from.`,
  "A second vendor. Every score here is one provider's model, and the classification above is ours, not theirs.",
]

/* -------------------------------------------------------------------------- */
/* Formatters                                                                  */
/* -------------------------------------------------------------------------- */

export const usd = (millions: number, decimals = 2) => `US$${millions.toFixed(decimals)}m`

export function pct(fraction: number, decimals = 1) {
  return `${(fraction * 100).toFixed(decimals)}%`
}

/** Sentiment scores read best signed and at two places, which is the vendor's own precision. */
export const signedScore = (score: number, decimals = 2) =>
  `${score >= 0 ? "+" : "−"}${Math.abs(score).toFixed(decimals)}`
