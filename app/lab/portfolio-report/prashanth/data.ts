/**
 * Prashanth Ranganathan — the figures this report stands on.
 *
 * Ported from the pinned fixture in `oneview-webapp/app/lab/generative-ui/prashanth.ts`
 * (`PRASHANTH_BUNDLE`), which distils `03_prashanth_ranganathan.json` as at
 * 27 August 2026. Provenance is carried through rather than flattened, because the
 * report says on the page which figures are recorded and which are estimated.
 *
 *   RECORDED   Balance sheet: bank balances, the twenty brokerage positions across
 *              four custodians, the Dalvey Road valuation, the nine private marks,
 *              the three digital holdings, liabilities, open actions, the September
 *              capital call. Totalled, not adjusted.
 *   CONVERTED  His book is USD but holds SGD, INR and AUD positions. Aggregates use
 *              the fixed rates in `FX` — fixed, not live, so two runs agree.
 *   ESTIMATED  Returns, the benchmark, and the month-by-month history. His record
 *              carries a cost basis and a market value and nothing in between. The
 *              estimate is anchored to the one performance statement his file makes
 *              — the 7 August meeting note, "Portfolio +14% YTD, LGT outperforming"
 *              — and reconciles: the indexed series ends at exactly +14.0%.
 *
 * Nothing here computes a figure the underlying analysis did not state. Values that
 * ARE derived (the listed-book total, contribution shares) are arithmetic over these
 * figures and are marked as such at the point of derivation.
 *
 * Synthetic values are NOT in this file. See ./portfolio-report-demo-data.ts.
 */

export const AS_OF = "27 August 2026";
export const PERFORMANCE_AS_OF = "31 August 2026";

/** Conversion rates every aggregate was struck at. Disclosed on the page. */
export const FX = { USD: 1, SGD: 0.78, INR: 0.012, AUD: 0.66 } as const;

export const CLIENT = {
  name: "Prashanth Ranganathan",
  entity: "PRTR Holdings",
  reviewedOn: "7 August 2026",
} as const;

/* -------------------------------------------------------------------------- */
/* Balance sheet — RECORDED                                                    */
/* -------------------------------------------------------------------------- */

export const BALANCE_SHEET = {
  netWorth: 55.4,
  totalAssets: 60.1,
  borrowing: 4.6,
  /** Borrowing / total assets, as stated by the analysis. */
  leverage: "7.7%",
  /** A guarantee from PRTR Holdings to LGT that sits outside the borrowing figure. */
  guaranteeOffBalanceSheet: 2.0,
  netWorthDelta: { value: 2.18, label: "since 28 June" },
} as const;

/* -------------------------------------------------------------------------- */
/* Performance — ESTIMATED                                                     */
/* -------------------------------------------------------------------------- */

/** Indexed to 31 December = 100. Ends at 114.0, i.e. +14.0% year to date. */
export const INDEXED_PERFORMANCE = [
  { month: "Dec", portfolio: 100 },
  { month: "Jan", portfolio: 101.9 },
  { month: "Feb", portfolio: 100.3 },
  { month: "Mar", portfolio: 104.2 },
  { month: "Apr", portfolio: 106.7 },
  { month: "May", portfolio: 109.2 },
  { month: "Jun", portfolio: 108.6 },
  { month: "Jul", portfolio: 111.6 },
  { month: "Aug", portfolio: 114 },
] as const;

export const YTD_RETURN = "+14.0%";

/**
 * The periods the estimate can speak to, and no more.
 *
 * Each row is read off `INDEXED_PERFORMANCE` — 1M is Jul→Aug, 3M May→Aug, 6M Feb→Aug
 * — so the table and the chart cannot disagree. There is no 1Y or since-inception
 * row: the series starts 31 December, and a longer period would have to be invented.
 */
export const PERIOD_RETURNS = [
  { period: "1M", window: "Jul → Aug", portfolio: 2.2, benchmark: 2.1, alpha: 0.1 },
  { period: "3M", window: "May → Aug", portfolio: 4.4, benchmark: 4.1, alpha: 0.3 },
  { period: "6M", window: "Feb → Aug", portfolio: 13.7, benchmark: 10.3, alpha: 3.4 },
  { period: "YTD", window: "Dec → Aug", portfolio: 14.0, benchmark: null, alpha: null },
] as const;

/**
 * Portfolio and benchmark on one axis, both rebased to February = 100.
 *
 * February because that is the earliest month the benchmark is defined for: the three
 * real benchmark returns above fix it at Feb, May, Jul and Aug and nowhere else.
 * The five unobserved months are `null` rather than interpolated — the chart draws a
 * dashed line through what is known and does not imply a path between.
 *
 *   benchmark Aug = 110.3   (Feb → Aug, +10.3%)
 *   benchmark Jul = 110.3 / 1.021 = 108.0
 *   benchmark May = 110.3 / 1.041 = 106.0
 */
export const PERFORMANCE_VS_BENCHMARK = [
  { month: "Feb", portfolio: 100.0, benchmark: 100.0 },
  { month: "Mar", portfolio: 103.9, benchmark: null },
  { month: "Apr", portfolio: 106.4, benchmark: null },
  { month: "May", portfolio: 108.9, benchmark: 106.0 },
  { month: "Jun", portfolio: 108.3, benchmark: null },
  { month: "Jul", portfolio: 111.3, benchmark: 108.0 },
  { month: "Aug", portfolio: 113.7, benchmark: 110.3 },
] as const;

/* -------------------------------------------------------------------------- */
/* The listed book — RECORDED                                                  */
/* -------------------------------------------------------------------------- */

export type Position = {
  ticker: string;
  name: string;
  /** Broad classification of the instrument, not a GICS sector. */
  group: "Technology" | "Diversified index" | "Government";
  marketValue: number;
  cost: number;
  gain: number;
};

/** The complete listed book. Sums to US$25.22m, which is what makes NVDA 14.2%. */
export const POSITIONS: Position[] = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", group: "Diversified index", marketValue: 9.52, cost: 7.68, gain: 1.84 },
  { ticker: "AAPL", name: "Apple", group: "Technology", marketValue: 5.95, cost: 4.8, gain: 1.15 },
  { ticker: "MSFT", name: "Microsoft", group: "Technology", marketValue: 4.76, cost: 3.84, gain: 0.92 },
  { ticker: "NVDA", name: "NVIDIA", group: "Technology", marketValue: 3.57, cost: 2.88, gain: 0.69 },
  { ticker: "TBILL", name: "US Treasury bills", group: "Government", marketValue: 1.42, cost: 1.42, gain: 0 },
];

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/** Derived: arithmetic over POSITIONS, nothing added. */
export const LISTED = {
  marketValue: sum(POSITIONS.map((p) => p.marketValue)), // 25.22
  cost: sum(POSITIONS.map((p) => p.cost)), // 20.62
  gain: sum(POSITIONS.map((p) => p.gain)), // 4.60
};

export const weightOfListed = (marketValue: number) => marketValue / LISTED.marketValue;

/** Technology = the three single names. US$14.28m, 56.6% of the listed book. */
export const TECHNOLOGY = {
  marketValue: sum(POSITIONS.filter((p) => p.group === "Technology").map((p) => p.marketValue)),
  get weight() {
    return this.marketValue / LISTED.marketValue;
  },
};

/**
 * Contribution to the listed book's unrealised gain.
 *
 * Expressed two ways because each answers a different question: `pp` is the gain as
 * percentage points of the book at cost (US$20.62m), `share` is the slice of the
 * US$4.60m gain. Both are since cost, NOT year to date — his positions carry a cost
 * basis and a market value and nothing in between, so a year-to-date attribution
 * would have to be invented. The page says so where the chart appears.
 */
export const CONTRIBUTION = POSITIONS.filter((p) => p.gain !== 0)
  .map((p) => ({
    ticker: p.ticker,
    name: p.name,
    group: p.group,
    gain: p.gain,
    pp: (p.gain / LISTED.cost) * 100,
    share: p.gain / LISTED.gain,
  }))
  .sort((a, b) => b.pp - a.pp);

/** NVIDIA's share of the listed book, on the same nine custody snapshots. */
export const NVDA_WEIGHT_HISTORY = [
  { month: "Dec", weight: 9.1 },
  { month: "Jan", weight: 9.6 },
  { month: "Feb", weight: 9.4 },
  { month: "Mar", weight: 10.5 },
  { month: "Apr", weight: 11.3 },
  { month: "May", weight: 12.2 },
  { month: "Jun", weight: 12 },
  { month: "Jul", weight: 13.4 },
  { month: "Aug", weight: 14.2 },
] as const;

/* -------------------------------------------------------------------------- */
/* Look-through — RECORDED for NVIDIA                                          */
/* -------------------------------------------------------------------------- */

/**
 * Every position by custodian, read straight off the four brokerage statements.
 *
 * Each column sums to the position in POSITIONS — which is the finding: no single
 * mandate shows NVIDIA at US$3.57m, because the largest slice of it is a third.
 */
export const BY_CUSTODIAN = {
  VOO: [
    { custodian: "LGT", amount: 3.36 },
    { custodian: "UBS", amount: 2.48 },
    { custodian: "IBKR", amount: 2.28 },
    { custodian: "Goldman Sachs", amount: 1.4 },
  ],
  AAPL: [
    { custodian: "LGT", amount: 2.1 },
    { custodian: "UBS", amount: 1.55 },
    { custodian: "IBKR", amount: 1.425 },
    { custodian: "Goldman Sachs", amount: 0.875 },
  ],
  MSFT: [
    { custodian: "LGT", amount: 1.68 },
    { custodian: "UBS", amount: 1.24 },
    { custodian: "IBKR", amount: 1.14 },
    { custodian: "Goldman Sachs", amount: 0.7 },
  ],
  NVDA: [
    { custodian: "LGT", amount: 1.26 },
    { custodian: "UBS", amount: 0.93 },
    { custodian: "IBKR", amount: 0.855 },
    { custodian: "Goldman Sachs", amount: 0.525 },
  ],
  TBILL: [
    { custodian: "LGT", amount: 0.56 },
    { custodian: "UBS", amount: 0.42 },
    { custodian: "IBKR", amount: 0.25 },
    { custodian: "Goldman Sachs", amount: 0.19 },
  ],
} as const;

export const NVDA_BY_CUSTODIAN = BY_CUSTODIAN.NVDA;

export const CUSTODIAN_COUNT = 4;

/** Every custodian holds every line, in the same rank order. */
export const CUSTODIAN_TOTALS = (
  ["LGT", "UBS", "IBKR", "Goldman Sachs"] as const
).map((custodian) => ({
  custodian,
  amount: Object.values(BY_CUSTODIAN).reduce(
    (total, rows) =>
      total + (rows.find((row) => row.custodian === custodian)?.amount ?? 0),
    0
  ),
}));

/* -------------------------------------------------------------------------- */
/* Allocation, private and digital books — RECORDED / CONVERTED                */
/* -------------------------------------------------------------------------- */

export const ALLOCATION = [
  { label: "Listed securities", weight: 0.42 },
  { label: "Real estate", weight: 0.346 },
  { label: "Lifestyle assets", weight: 0.116 },
  { label: "Digital assets", weight: 0.058 },
  { label: "Private investments", weight: 0.04 },
  { label: "Cash", weight: 0.02 },
] as const;

export const PRIVATE_MARKS = [
  { name: "Acme Technologies", value: 0.5 },
  { name: "XWeave", value: 0.4 },
  { name: "Trade Together", value: 0.35 },
  { name: "Kiwi", value: 0.3 },
  { name: "Kshana", value: 0.25 },
  { name: "I Own My Data", value: 0.2 },
  { name: "Strong Keep", value: 0.16 },
  { name: "Harmony", value: 0.15 },
  { name: "Upswing Technologies", value: 0.1 },
] as const;

export const PRIVATE_BOOK = { previous: 1.6, current: 2.4, remarkedOn: "13 August" } as const;

export const DIGITAL_HOLDINGS = [
  { name: "Bitcoin", value: 2.4 },
  { name: "Ethereum", value: 0.9 },
  { name: "Solana", value: 0.17 },
] as const;

/* -------------------------------------------------------------------------- */
/* Liquidity and the capital call — RECORDED                                   */
/* -------------------------------------------------------------------------- */

export const LIQUIDITY = {
  cash: 1.22,
  treasuryBills: 1.42,
  get total() {
    return this.cash + this.treasuryBills; // 2.64
  },
} as const;

export const CAPITAL_CALL = {
  amount: 0.5,
  fund: "GS Private Credit Partners IV",
  deadline: "15 September 2026",
  fundingSource: "Goldman Sachs Treasury bills",
  approvedAt: "7 August 2026",
} as const;

/* -------------------------------------------------------------------------- */
/* Liabilities — RECORDED                                                      */
/* -------------------------------------------------------------------------- */

export const FACILITIES = [
  { name: "Mortgage — Dalvey Road", counterparty: "DBS", value: 3.28, rate: "3.85%" },
  { name: "Margin facility", counterparty: "LGT", value: 0.9, rate: "5.25%" },
  { name: "ATO tax payable — FY2025", counterparty: null, value: 0.42, rate: null },
  { name: "Credit cards", counterparty: null, value: 0.04, rate: null },
] as const;

/* -------------------------------------------------------------------------- */
/* Who owns what — RECORDED                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The two properties, and the fact that the larger one is not in his name.
 *
 * His file records Dalvey Road under `real_estate` and the Atherton house under the
 * Tara Ranganathan Living Trust's `holds_assets` — so the US$20.76m of property on the
 * balance sheet is two assets under two different owners, and the bigger one is the one
 * he only benefits from. Both are already inside the US$60.1m; this is the split, not
 * an addition.
 */
export const PROPERTY = [
  {
    name: "101 Dalvey Road, Apt 0201",
    where: "Singapore",
    owner: "Prashanth Ranganathan",
    ownerKind: "personal" as const,
    value: 7.956,
    cost: 6.552,
    note: "Valued 27 August. Mortgaged to DBS.",
  },
  {
    name: "385 Fletcher Drive, Atherton",
    where: "California",
    owner: "Tara Ranganathan Living Trust",
    ownerKind: "trust" as const,
    value: 12.8,
    cost: 8.5,
    note: "Held in trust. He is a beneficiary, not the legal owner.",
  },
] as const;

export const ENTITIES = [
  {
    name: "Prashanth Ranganathan",
    kind: "Individual",
    jurisdiction: "SG",
    role: "Legal owner",
  },
  {
    name: "PRTR",
    kind: "Company / family office vehicle",
    jurisdiction: "SG",
    role: "Ultimate beneficial owner",
  },
  {
    name: "Tara Ranganathan Living Trust",
    kind: "Living trust",
    jurisdiction: "US",
    role: "Beneficiary",
  },
] as const;

/** Cash, which is smaller than it looks and spread across four books. */
export const BANK_ACCOUNTS = [
  { institution: "DBS Bank", where: "Singapore", currency: "SGD", value: 0.601 },
  { institution: "Emirates NBD", where: "UAE", currency: "USD", value: 0.44 },
  { institution: "HSBC", where: "India", currency: "INR", value: 0.108 },
  { institution: "HSBC (GIFT City)", where: "India", currency: "INR", value: 0.067 },
] as const;

/* -------------------------------------------------------------------------- */
/* Lifestyle assets — RECORDED / CONVERTED                                     */
/* -------------------------------------------------------------------------- */

/**
 * The US$7.0m of assets that are owned to be used rather than to compound.
 *
 * Carried at market against cost because that is the whole point: the listed book is
 * +24% on cost and this is below it. Household furnishings are recorded at cost only —
 * his file has no market value for them — so they are excluded rather than guessed at.
 */
export type LifestyleAsset = {
  name: string;
  detail: string;
  /** Things with engines depreciate; things in cases have not. */
  kind: "vehicle" | "collectible";
  value: number;
  cost: number;
};

export const LIFESTYLE_ASSETS: LifestyleAsset[] = [
  { name: "Princess V50 yacht", detail: "ONE°15 Marina, Sentosa", kind: "vehicle", value: 3.6, cost: 4.4 },
  { name: "Southeast Asian art", detail: "12 contemporary pieces", kind: "collectible", value: 1.7, cost: 0.84 },
  { name: "Watches", detail: "Patek Philippe, Audemars Piguet — 6 pieces", kind: "collectible", value: 0.64, cost: 0.56 },
  { name: "Porsche 911 Turbo S", detail: "Garaged Melbourne", kind: "vehicle", value: 0.502, cost: 0.554 },
  { name: "Wine cellar", detail: "Bordeaux and Burgundy, ~400 bottles", kind: "collectible", value: 0.36, cost: 0.19 },
  { name: "BMW iX xDrive50", detail: "Registered Singapore", kind: "vehicle", value: 0.195, cost: 0.262 },
];

const lifestyleGroup = (kind?: LifestyleAsset["kind"]) => {
  const rows = kind
    ? LIFESTYLE_ASSETS.filter((item) => item.kind === kind)
    : LIFESTYLE_ASSETS;
  const value = sum(rows.map((item) => item.value));
  const cost = sum(rows.map((item) => item.cost));
  return { value, cost, change: value / cost - 1 };
};

export const LIFESTYLE = {
  ...lifestyleGroup(),
  vehicles: lifestyleGroup("vehicle"),
  collectibles: lifestyleGroup("collectible"),
  excluded: "Household furnishings, recorded at cost only",
} as const;

/* -------------------------------------------------------------------------- */
/* What changed, what's coming, what's open — RECORDED                         */
/* -------------------------------------------------------------------------- */

export type Change = {
  label: string;
  from: string;
  to: string;
  note: string;
  status?: "Revaluation" | "Approved" | "Noted" | "Pending";
};

export const CHANGES: Change[] = [
  {
    label: "Private investments",
    from: "US$1.6m",
    to: "US$2.4m",
    status: "Revaluation",
    note: "Nine holdings revalued on 13 August. This is a revaluation, not a return, and it accounts for almost all of the US$2.2m rise in net worth.",
  },
  {
    label: "NVIDIA, share of listed holdings",
    from: "12.0%",
    to: "14.2%",
    status: "Noted",
    note: "Flagged at the 7 August review at US$3.6m. Held across all four custodians, so no single statement shows the whole position.",
  },
  {
    label: "Goldman Treasury bills",
    from: "US$1.4m",
    to: "US$0.9m once called",
    status: "Approved",
    note: "US$500k earmarked for the GS Private Credit Partners IV call, approved 7 August and due by 15 September.",
  },
  {
    label: "Withers intermediary trust",
    from: "In progress",
    to: "Documents expected October",
    status: "Pending",
    note: "The LGT asset transfer cannot begin until the trust completes. No date from the counterparty yet.",
  },
];

export type UpcomingEvent = {
  when: string;
  title: string;
  detail: string;
  status?: "In progress" | "Pending" | "Blocked";
  dependsOn?: string;
};

export const UPCOMING: UpcomingEvent[] = [
  {
    when: "Q3 2026",
    title: "GS Private Credit capital call",
    detail: "US$500k, funded from the Goldman Treasury bills. Due by 15 September.",
    status: "In progress",
  },
  {
    when: "Q4 2026",
    title: "Withers to complete the intermediary trust",
    detail: "Enables the LGT transfer. Awaiting the counterparty.",
    status: "Pending",
  },
  {
    when: "Q4 2026 – Q1 2027",
    title: "LGT asset transfer",
    detail: "Cannot begin until the trust completes.",
    status: "Blocked",
    dependsOn: "Withers to complete the intermediary trust",
  },
];

export const OPEN_ACTIONS = [
  { text: "Review the LGT discretionary mandate against benchmark", owner: "Advisory", due: null },
  { text: "Fund the US$500k GS Private Credit Partners IV call", owner: null, due: "by 15 September" },
  { text: "Review the NVIDIA overweight at UBS", owner: null, due: null },
  { text: "Coordinate the LGT transfer timeline once Withers finalises the trust", owner: null, due: "October" },
] as const;

/* -------------------------------------------------------------------------- */
/* Sources — RECORDED                                                          */
/* -------------------------------------------------------------------------- */

export const SOURCES = [
  { name: "Custody positions", detail: "as at 27 August 2026" },
  { name: "PRTR family office records", detail: "as at 27 August 2026" },
  { name: "Property valuation — Dalvey Road", detail: "as at 27 August 2026" },
  { name: "Quarterly review meeting note", detail: "7 August 2026" },
  { name: "Performance estimate", detail: "to 31 August 2026" },
  { name: "Converted at", detail: "0.78 SGD/USD · 0.0120 INR/USD · 0.66 AUD/USD" },
] as const;

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

/** US$ millions, one decimal — the unit every figure on this page is stated in. */
export const usd = (millions: number, decimals = 1) =>
  `US$${millions.toFixed(decimals)}m`;

/** Sub-million amounts read better in thousands. */
export const usdCompact = (millions: number) =>
  millions < 1 ? `US$${Math.round(millions * 1000)}k` : usd(millions);

export const pct = (fraction: number, decimals = 1) =>
  `${(fraction * 100).toFixed(decimals)}%`;

export const signedPp = (points: number, decimals = 1) =>
  `${points >= 0 ? "+" : "−"}${Math.abs(points).toFixed(decimals)}pp`;

export const signedPct = (points: number, decimals = 1) =>
  `${points >= 0 ? "+" : "−"}${Math.abs(points).toFixed(decimals)}%`;
