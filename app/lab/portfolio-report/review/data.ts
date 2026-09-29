/**
 * A portfolio review, written from a one-page summary and nothing else.
 *
 * This is the thin-input case. The source is a single review note — a total, a change,
 * eight attribution lines, three changes, five recommendations and five action items.
 * There is no holdings list, no cost basis, no jurisdiction, no entity structure, no
 * benchmark and no client name.
 *
 * Provenance:
 *
 *   RECORDED   Every figure below appears verbatim in the source note.
 *   DERIVED    Arithmetic over those figures, and nothing else. Each one is marked.
 *   ABSENT     Listed explicitly in `NOT_ON_FILE`. Nothing here is estimated or
 *              synthesised to fill those gaps, and no demo fixture accompanies this
 *              report — where the data runs out, the report stops.
 *
 * The source note contradicts itself twice. Both are recorded in `DISCREPANCIES` and
 * neither is resolved, because resolving one would mean choosing which of the client's
 * own figures to overwrite.
 */

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/* -------------------------------------------------------------------------- */
/* Identity and date — ABSENT                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The source note carries no client name and no date. "Since last review" is the only
 * temporal anchor in it, and the review it refers to is not dated either. So this report
 * cannot state an as-at date, and says so rather than assuming one.
 */
export const CLIENT = {
  name: null,
  asOf: null,
  priorReview: "not dated in the source",
} as const;

export const CURRENCY = "S$";

/* -------------------------------------------------------------------------- */
/* Headline — RECORDED                                                        */
/* -------------------------------------------------------------------------- */

export const PORTFOLIO = {
  /** S$ millions. */
  value: 25.4,
  /** Both figures as printed. They do not agree — see DISCREPANCIES. */
  changeAmount: 0.22356,
  changePct: 3.5,
} as const;

/** The client's own stated priorities, quoted. Not characterised. */
export const FOCUS = [
  "Prioritise downside protection and liquidity",
  "Manage USD and technology concentration",
  "Selectively pursue private-market opportunities",
] as const;

/* -------------------------------------------------------------------------- */
/* Attribution — RECORDED                                                     */
/* -------------------------------------------------------------------------- */

export type Attribution = { name: string; pp: number };

/**
 * The eight lines from the performance summary, in percentage points.
 *
 * The note does not say what they are contributions TO, over what period, or against
 * what benchmark. It gives eight signed numbers under the heading "performance summary",
 * and they very nearly sum to the headline change — which is the only evidence that they
 * are contributions rather than standalone returns. That reading is stated on the page as
 * an inference, not as fact.
 */
export const ATTRIBUTION: Attribution[] = [
  { name: "Energy", pp: 2.43 },
  { name: "Technology stocks", pp: 1.25 },
  { name: "Cash & FX impact", pp: 1.15 },
  { name: "Asia equity", pp: 0.8 },
  { name: "Private markets", pp: -0.32 },
  { name: "Healthcare sector", pp: -0.57 },
  { name: "Gold & commodities", pp: -0.59 },
  { name: "Emerging markets", pp: -0.78 },
];

/** DERIVED. +3.37. */
export const ATTRIBUTION_TOTAL = sum(ATTRIBUTION.map((row) => row.pp));

/** DERIVED. The four positive lines and the four negative ones. */
export const ATTRIBUTION_SPLIT = {
  gains: sum(ATTRIBUTION.filter((r) => r.pp > 0).map((r) => r.pp)), // +5.63
  drags: sum(ATTRIBUTION.filter((r) => r.pp < 0).map((r) => r.pp)), // −2.26
};

/* -------------------------------------------------------------------------- */
/* Contradictions in the source — RECORDED                                    */
/* -------------------------------------------------------------------------- */

/**
 * DERIVED. What the note's own numbers imply, so the reader can see the size of each gap
 * rather than being told there is one.
 */
export const DISCREPANCIES = {
  /** 0.22356 / 25.4 = 0.88%, against the 3.5% printed beside it. */
  changeImpliedPct: (PORTFOLIO.changeAmount / PORTFOLIO.value) * 100,
  /** 3.5% of the total would be S$889k, against the S$224k printed. */
  changeImpliedAmount: PORTFOLIO.value * (PORTFOLIO.changePct / 100),
  /** The attribution lines sum to 3.37 against a stated 3.5. */
  attributionGap: PORTFOLIO.changePct - ATTRIBUTION_TOTAL,
} as const;

/* -------------------------------------------------------------------------- */
/* What changed — RECORDED                                                    */
/* -------------------------------------------------------------------------- */

export const CHANGES = [
  {
    label: "Technology exposure",
    from: "21%",
    to: "29%",
    status: "Noted" as const,
    note: "An eight point increase. The note says it happened without an explicit decision, which makes it a drift rather than a position.",
  },
  {
    label: "Property purchase",
    from: "Not required",
    to: "~S$3m within 12 months",
    status: "Pending" as const,
    note: "A planned purchase. The note gives the amount and the window but no date, and does not say which property.",
  },
  {
    label: "Investment-grade bond",
    from: "Held",
    to: "Matures next month",
    status: "Pending" as const,
    note: "S$800k returning as cash. It is the only inflow in the note, and the only chance to rebalance without selling anything.",
  },
];

/* -------------------------------------------------------------------------- */
/* Concentration — RECORDED                                                   */
/* -------------------------------------------------------------------------- */

export const TECHNOLOGY = {
  from: 21,
  to: 29,
  /** DERIVED. */
  get pointChange() {
    return this.to - this.from; // +8
  },
  /** DERIVED. The relative increase, which is larger than the point change suggests. */
  get relativeChange() {
    return this.to / this.from - 1; // +38.1%
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Liquidity — RECORDED amounts, DERIVED cover                                */
/* -------------------------------------------------------------------------- */

export type Flow = { name: string; amount: number; detail: string };

/** What is available. Both figures are in the note. */
export const SOURCES: Flow[] = [
  { name: "Cash", amount: 2.4, detail: "On hand" },
  { name: "Bond maturity", amount: 0.8, detail: "Next month" },
];

/** What it has to cover. Both figures are in the note. */
export const USES: Flow[] = [
  { name: "Property purchase", amount: 3.0, detail: "Within 12 months" },
  { name: "Education payment", amount: 0.042, detail: "September" },
];

export const COVER = {
  available: sum(SOURCES.map((s) => s.amount)), // 3.20
  required: sum(USES.map((u) => u.amount)), // 3.042
  get remaining() {
    return this.available - this.required; // 0.158
  },
  get covered() {
    return this.remaining >= 0;
  },
  /** DERIVED. How little is left over, as a share of what is needed. */
  get headroom() {
    return this.remaining / this.required; // 5.2%
  },
} as const;

/* -------------------------------------------------------------------------- */
/* What's coming — RECORDED                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Timing is quoted as the note states it. "Next month" and "within 12 months" are
 * relative and no absolute date is given, so none is invented here.
 */
export const UPCOMING = [
  {
    when: "Next month",
    title: "Investment-grade bond matures",
    detail: "S$800k returns as cash. The one inflow in the note.",
    status: "Pending" as const,
  },
  {
    when: "September",
    title: "Education payment",
    detail:
      "About 42,000. The note does not say which account funds it, and writes this one figure without the S$ prefix it uses everywhere else.",
    status: "Pending" as const,
  },
  {
    when: "Within 12 months",
    title: "Property purchase",
    detail:
      "About S$3m. No date inside the window, so it could fall before the bond proceeds are reinvested or long after.",
    status: "Pending" as const,
  },
];

/* -------------------------------------------------------------------------- */
/* Decisions — RECORDED, reordered by what gates what                         */
/* -------------------------------------------------------------------------- */

export const DECISIONS = [
  {
    question: "Should the technology and US equity weight be brought back down?",
    basis:
      "It moved from 21% to 29% without an explicit decision. Nothing on file states a limit, so there is no breach to point to — only a position nobody chose.",
  },
  {
    question: "Which money is being set aside for the property purchase?",
    basis:
      "Cash and the bond maturity together are S$3.20m against S$3.04m of commitments. It covers, with S$158k to spare, so the answer determines whether anything else can be funded this year.",
  },
  {
    question: "How are the bond proceeds reinvested?",
    basis:
      "S$800k returns next month. It is the only rebalancing opportunity in the note that does not require selling something, and it competes with ring-fencing the same money for the property.",
  },
  {
    question: "Is the aggregate USD exposure acceptable?",
    basis:
      "The note says higher US equity has increased sensitivity to USD movements, but gives no figure for total USD exposure. This cannot be answered from the note as it stands.",
  },
  {
    question: "How is the September education payment funded?",
    basis:
      "About 42,000 falls in September. The note names neither the source account nor, unambiguously, the currency.",
  },
];

/** Quoted from the note. None carries an owner or a due date. */
export const ACTIONS = [
  "Create an implementation plan for the technology and USD concentration review",
  "Create an implementation plan for ring-fencing the property money",
  "Evaluate reinvestment options for the bond proceeds",
  "Draft an email confirming how the education payment is funded",
] as const;

/** Already done, and recorded in the same list as the four open items above. */
export const COMPLETED = ["BMW insurance document received and added"] as const;

/* -------------------------------------------------------------------------- */
/* What the note does not contain — ABSENT                                    */
/* -------------------------------------------------------------------------- */

export const NOT_ON_FILE = [
  "Any holdings list, so no position, weight or line-item value can be shown",
  "Any cost basis, so no gain can be separated from the valuation",
  "Any benchmark, so the change cannot be compared with anything",
  "The period the attribution covers, so none of it can be annualised",
  "Any allocation beyond the technology weight, so the remaining 71% is uncategorised",
  "Any jurisdiction, currency or custodian breakdown",
  "Any entity or ownership structure",
  "The client's name, and the date of either this review or the last one",
] as const;

export const SOURCE_NOTE = {
  name: "Portfolio review note",
  detail: "single page, undated — the only source for this report",
} as const;

/* -------------------------------------------------------------------------- */
/* Formatting                                                                 */
/* -------------------------------------------------------------------------- */

/** S$ millions. The note states everything in S$; nothing is converted. */
export const sgd = (millions: number, decimals = 1) =>
  `${CURRENCY}${millions.toFixed(decimals)}m`;

export const sgdCompact = (millions: number) =>
  millions < 1 ? `${CURRENCY}${Math.round(millions * 1000)}k` : sgd(millions);

/**
 * For the liquidity figures, where rounding to one decimal would make the two bar totals
 * appear to differ by S$200k when the real gap is S$158k. Trailing zeros are dropped, so
 * S$3m stays S$3m — which is how the source writes it.
 */
export const sgdExact = (millions: number) =>
  millions < 1
    ? `${CURRENCY}${Math.round(millions * 1000)}k`
    : `${CURRENCY}${Number(millions.toFixed(3))}m`;

export const pct = (value: number, decimals = 1) => `${value.toFixed(decimals)}%`;

/** Takes PERCENTAGE POINTS, like the note. */
export const signedPct = (points: number, decimals = 1) =>
  `${points >= 0 ? "+" : "−"}${Math.abs(points).toFixed(decimals)}%`;

export const signedPp = (points: number, decimals = 2) =>
  `${points >= 0 ? "+" : "−"}${Math.abs(points).toFixed(decimals)}pp`;
