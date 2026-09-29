/**
 * Eleanor Whitfield's record, as it stands in her file.
 *
 * Provenance, the same three categories used for Prashanth:
 *
 *   RECORDED   — read straight off her file.
 *   CONVERTED  — her file states everything in SGD already, including the GBP account,
 *                which it carries as `balance_sgd_equivalent`. No FX is applied here.
 *   DERIVED    — arithmetic over recorded values, and nothing else.
 *
 * What her file does NOT contain, and what this report therefore does not show:
 *
 *   - Any monthly or indexed performance history. Her securities carry a cost basis and
 *     a market value and nothing in between, so there is no return series to plot and
 *     no benchmark to plot it against. Chapter 03 says so instead of inventing one.
 *   - Any per-holding purchase dates, so no holding period can be stated.
 *   - Any target allocation or policy limit, except one: a stated preference for at
 *     least S$7m of accessible liquidity. That number is hers, and it is the only
 *     threshold this report measures anything against.
 *
 * Unlike Prashanth's report there is no demo-data file for Eleanor. Nothing here is
 * invented, because her file happens to supply a complete story without it.
 */

/* -------------------------------------------------------------------------- */
/* Dates and identity — RECORDED                                              */
/* -------------------------------------------------------------------------- */

/**
 * Her file carries no single as-of date. The most recent valuations in it are the
 * 30 June marks on the Singapore residence and two of the private funds, so the
 * balance sheet is stated as at that date and the staleness of everything older is
 * measured from it. This is the subject of chapter 05.
 */
export const AS_OF = "30 June 2026";

/** The same date, machine-readable, for the exhibits that place her file on a timeline. */
export const AS_OF_ISO = "2026-06-30";

export const CLIENT = {
  name: "Eleanor Whitfield",
  entity: "Whitfield Family Trust",
  clientSince: "18 April 2011",
  jurisdiction: "Singapore",
  nationality: "British",
} as const;

/* -------------------------------------------------------------------------- */
/* Balance sheet — DERIVED from recorded values                                */
/* -------------------------------------------------------------------------- */

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/**
 * `country` is a machine-readable restatement of `where`, added so the jurisdiction
 * spread in chapter 01 can be computed rather than typed out. Nothing is inferred:
 * every code here is the country already named in `where`.
 */
export type Country = "SG" | "UK" | "US" | "FR";

export const BANK_ACCOUNTS = [
  { institution: "DBS Private Bank", where: "Singapore", country: "SG", currency: "SGD", value: 5.0 },
  { institution: "UBS", where: "Singapore", country: "SG", currency: "SGD", value: 3.5 },
  { institution: "HSBC UK", where: "United Kingdom", country: "UK", currency: "GBP", value: 2.5 },
] as const;

export type Holding = {
  name: string;
  kind: "Equity fund" | "Fixed income";
  marketValue: number;
  cost: number;
};

/** One mandate, at UBS. Four lines, no single securities. */
export const HOLDINGS: Holding[] = [
  { name: "Investment Grade Bond Portfolio", kind: "Fixed income", marketValue: 6.8, cost: 6.7 },
  { name: "UBS Global Equity Fund", kind: "Equity fund", marketValue: 4.2, cost: 3.6 },
  { name: "UBS Global Dividend Fund", kind: "Equity fund", marketValue: 3.1, cost: 2.9 },
  { name: "Short Duration Bond Portfolio", kind: "Fixed income", marketValue: 2.3, cost: 2.25 },
];

export const SECURITIES = {
  marketValue: sum(HOLDINGS.map((h) => h.marketValue)), // 16.40
  cost: sum(HOLDINGS.map((h) => h.cost)), // 15.45
  get gain() {
    return this.marketValue - this.cost; // 0.95
  },
  get returnOnCost() {
    return this.marketValue / this.cost - 1; // +6.1%
  },
  custodian: "UBS",
};

export const PROPERTY = [
  { name: "Singapore Residence", where: "Nassim Road, Singapore", country: "SG", kind: "Residential", value: 16.0, valuedOn: "30 June 2026" },
  { name: "UK Commercial Property", where: "Manchester, United Kingdom", country: "UK", kind: "Commercial", value: 14.0, valuedOn: "1 October 2025" },
  { name: "London Townhouse", where: "Kensington, London", country: "UK", kind: "Residential", value: 12.0, valuedOn: "15 April 2026" },
  { name: "Provence Holiday Home", where: "Provence, France", country: "FR", kind: "Residential", value: 6.0, valuedOn: "20 May 2026" },
] as const;

export type PrivateFund = {
  name: string;
  where: string;
  country: Country;
  value: number;
  unfunded: number;
  valuedOn: string;
  callDue: string | null;
  stale?: boolean;
};

export const PRIVATE_FUNDS: PrivateFund[] = [
  { name: "Northstar PE Fund IV", where: "US", country: "US", value: 8.4, unfunded: 2.4, valuedOn: "31 March 2026", callDue: "12 October 2026" },
  { name: "Asia Growth Partners II", where: "Singapore", country: "SG", value: 5.7, unfunded: 1.1, valuedOn: "30 June 2026", callDue: "4 November 2026" },
  { name: "Meridian Infrastructure Fund", where: "Singapore", country: "SG", value: 4.5, unfunded: 2.5, valuedOn: "30 June 2026", callDue: null },
  { name: "Whitfield Ventures", where: "United Kingdom", country: "UK", value: 3.0, unfunded: 0, valuedOn: "31 March 2025", callDue: null, stale: true },
];

export const FAMILY_BUSINESS = {
  name: "Whitfield Manufacturing Ltd.",
  where: "United Kingdom",
  country: "UK",
  value: 19.0,
  ownership: 0.12,
  valuedOn: "31 December 2025",
  heldBy: "Whitfield Holdings Pte. Ltd.",
} as const;

export const CASH = sum(BANK_ACCOUNTS.map((a) => a.value)); // 11.00

export const ALLOCATION = [
  { label: "Real estate", weight: 48.0 / 116.0 },
  { label: "Private funds", weight: 21.6 / 116.0 },
  { label: "Family business", weight: 19.0 / 116.0 },
  { label: "Listed securities", weight: 16.4 / 116.0 },
  { label: "Cash", weight: 11.0 / 116.0 },
] as const;

export const LIABILITIES = [
  { name: "UK property refurbishment", kind: "Planned capital expenditure", value: 1.8, due: "15 December 2026" },
  { name: "Estimated tax payment", kind: "Tax payable", value: 0.9, due: "31 January 2027" },
] as const;

export const BALANCE_SHEET = {
  property: 48.0,
  privateFunds: 21.6,
  familyBusiness: 19.0,
  securities: 16.4,
  cash: CASH,
  get totalAssets() {
    return this.property + this.privateFunds + this.familyBusiness + this.securities + this.cash; // 116.0
  },
  liabilities: sum(LIABILITIES.map((l) => l.value)), // 2.70
  get netWorth() {
    return this.totalAssets - this.liabilities; // 113.30
  },
  /** Nothing here can be sold inside a quarter. */
  get illiquid() {
    return this.property + this.privateFunds + this.familyBusiness; // 88.6
  },
  get liquid() {
    return this.cash + this.securities; // 27.4
  },
  get illiquidShare() {
    return this.illiquid / this.totalAssets; // 76.4%
  },
};

/* -------------------------------------------------------------------------- */
/* Jurisdiction — DERIVED from the recorded locations                          */
/* -------------------------------------------------------------------------- */

/**
 * Where the balance sheet sits, by the country already named against each asset.
 *
 * Her file states a location for every property, every fund, the company and every
 * bank account. It states none for the managed portfolio: "UBS" is a custodian, not a
 * jurisdiction, and the UBS account in her cash list being a Singapore one is not
 * evidence about the mandate. That S$16.4m is therefore reported as unstated rather
 * than pushed into Singapore to make the figures tidy.
 */
const COUNTRY_NAMES: Record<Country, string> = {
  UK: "United Kingdom",
  SG: "Singapore",
  US: "United States",
  FR: "France",
};

const LOCATED: { country: Country; value: number }[] = [
  ...PROPERTY.map((row) => ({ country: row.country, value: row.value })),
  ...PRIVATE_FUNDS.map((row) => ({ country: row.country, value: row.value })),
  { country: FAMILY_BUSINESS.country, value: FAMILY_BUSINESS.value },
  ...BANK_ACCOUNTS.map((row) => ({ country: row.country, value: row.value })),
];

export const JURISDICTIONS = (
  Object.keys(COUNTRY_NAMES) as Country[]
)
  .map((country) => ({
    country,
    name: COUNTRY_NAMES[country],
    value: sum(
      LOCATED.filter((row) => row.country === country).map((row) => row.value)
    ),
    count: LOCATED.filter((row) => row.country === country).length,
  }))
  .filter((row) => row.value > 0)
  .sort((a, b) => b.value - a.value);

/** The managed portfolio, the only asset her file places nowhere. */
export const JURISDICTION_UNSTATED = BALANCE_SHEET.securities;

/**
 * She is British and resident in Singapore, and neither is where most of the money is
 * — which is the reason this exhibit is in chapter 01 rather than in an appendix.
 */
export const LARGEST_JURISDICTION = JURISDICTIONS[0];

/* -------------------------------------------------------------------------- */
/* Liquidity and commitments — RECORDED                                        */
/* -------------------------------------------------------------------------- */

/** Her stated floor. The only threshold in her file. */
export const PREFERRED_RESERVE = 7.0;

export type CashFlow = {
  name: string;
  amount: number;
  on: string;
  /** The same date as `on`, machine-readable. */
  iso: string;
  when: string;
  confidence: "high" | "medium";
};

/** Every dated outflow in her file, in order. */
export const COMMITMENTS: CashFlow[] = [
  { name: "Northstar PE Fund IV capital call", amount: 2.4, on: "12 October 2026", iso: "2026-10-12", when: "12 Oct", confidence: "high" },
  { name: "Asia Growth Partners II capital call", amount: 1.1, on: "4 November 2026", iso: "2026-11-04", when: "4 Nov", confidence: "high" },
  { name: "UK property refurbishment", amount: 1.8, on: "15 December 2026", iso: "2026-12-15", when: "15 Dec", confidence: "medium" },
  { name: "Annual family distributions", amount: 0.75, on: "20 December 2026", iso: "2026-12-20", when: "20 Dec", confidence: "high" },
  { name: "Estimated tax payment", amount: 0.9, on: "31 January 2027", iso: "2027-01-31", when: "31 Jan", confidence: "medium" },
];

export const COMMITTED = sum(COMMITMENTS.map((c) => c.amount)); // 6.95

export const LIQUIDITY = {
  cash: CASH,
  committed: COMMITTED,
  reserve: PREFERRED_RESERVE,
  get after() {
    return this.cash - this.committed; // 4.05
  },
  get gap() {
    return this.reserve - this.after; // 2.95
  },
  get shareOfCash() {
    return this.committed / this.cash; // 63.2%
  },
  /** Undated, and on top of the dated calls above. */
  unfunded: sum(PRIVATE_FUNDS.map((f) => f.unfunded)), // 6.00
};

/* -------------------------------------------------------------------------- */
/* Valuation age — DERIVED from recorded valuation dates                       */
/* -------------------------------------------------------------------------- */

/**
 * Months between each mark and the 30 June 2026 reference date.
 *
 * Only assets her file dates are listed. Cash and listed securities are excluded:
 * both are priced continuously, so age is not a meaningful measure for them.
 */
export const VALUATION_AGE = [
  { name: "Whitfield Ventures", value: 3.0, valuedOn: "31 March 2025", iso: "2025-03-31", months: 15 },
  { name: "Whitfield Manufacturing (12%)", value: 19.0, valuedOn: "31 December 2025", iso: "2025-12-31", months: 6 },
  { name: "UK Commercial Property", value: 14.0, valuedOn: "1 October 2025", iso: "2025-10-01", months: 9 },
  { name: "London Townhouse", value: 12.0, valuedOn: "15 April 2026", iso: "2026-04-15", months: 2 },
  { name: "Provence Holiday Home", value: 6.0, valuedOn: "20 May 2026", iso: "2026-05-20", months: 1 },
  { name: "Northstar PE Fund IV", value: 8.4, valuedOn: "31 March 2026", iso: "2026-03-31", months: 3 },
  { name: "Asia Growth Partners II", value: 5.7, valuedOn: "30 June 2026", iso: "2026-06-30", months: 0 },
  { name: "Meridian Infrastructure Fund", value: 4.5, valuedOn: "30 June 2026", iso: "2026-06-30", months: 0 },
  { name: "Singapore Residence", value: 16.0, valuedOn: "30 June 2026", iso: "2026-06-30", months: 0 },
] as const;

/** Her file calls a valuation stale past nine months; two assets are at or past it. */
export const STALE_THRESHOLD_MONTHS = 9;

export const STALE = VALUATION_AGE.filter(
  (row) => row.months >= STALE_THRESHOLD_MONTHS
);

export const STALE_VALUE = sum(STALE.map((row) => row.value)); // 33.0

/* -------------------------------------------------------------------------- */
/* Entities and family — RECORDED                                              */
/* -------------------------------------------------------------------------- */

export const ENTITIES = [
  {
    name: "Whitfield Family Trust",
    kind: "Discretionary trust",
    jurisdiction: "SG",
    role: "Settlor and beneficiary",
    holds: "Asia Growth Partners II · Meridian Infrastructure Fund",
  },
  {
    name: "Whitfield Holdings Pte. Ltd.",
    kind: "Family holding company",
    jurisdiction: "SG",
    role: "Ultimate beneficial owner",
    holds: "12% of Whitfield Manufacturing Ltd.",
  },
] as const;

/** Involvement is quoted from her file, not characterised. */
export const FAMILY = [
  { name: "James Whitfield", relationship: "Eldest child", born: 1984, note: "Interested in a more formal investment role" },
  { name: "Sophie Whitfield", relationship: "Middle child", born: 1987, note: "Exploring philanthropy and an education-focused foundation" },
  { name: "Daniel Whitfield", relationship: "Youngest child", born: 1991, note: "Limited involvement in family wealth decisions" },
] as const;

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
    label: "Trust documents",
    from: "Original deed",
    to: "Revised — under review",
    status: "Pending",
    note: "Successor trustees, distribution powers and investment committee authority all change. She needs to review it and has not yet done so.",
  },
  {
    label: "James's role",
    from: "No formal role",
    to: "Requested",
    status: "Noted",
    note: "Raised by email. She is open to discussing it but has not decided, and the revised deed would give an investment committee real authority.",
  },
  {
    label: "Sophie's philanthropy",
    from: "Not discussed",
    to: "S$2–3m foundation explored",
    status: "Noted",
    note: "Education-focused. Structure undecided — separate vehicle or inside the existing family structure.",
  },
  {
    label: "Asset transfers",
    from: "Open",
    to: "On hold",
    status: "Pending",
    note: "Her instruction: nothing moves until the governance discussion concludes. This blocks work that would otherwise be routine.",
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
    when: "12 October 2026",
    title: "Northstar PE Fund IV capital call",
    detail: "S$2.40m. The largest single payment, and the soonest.",
    status: "Pending",
  },
  {
    when: "4 November 2026",
    title: "Asia Growth Partners II capital call",
    detail: "S$1.10m. Held inside the Whitfield Family Trust.",
    status: "Pending",
  },
  {
    when: "15 December 2026",
    title: "UK property refurbishment",
    detail: "S$1.80m. The date is less certain than the others, so this one may move.",
    status: "Pending",
  },
  {
    when: "20 December 2026",
    title: "Annual family distributions",
    detail: "S$750k, and the only recurring item on the schedule.",
    status: "Pending",
  },
  {
    when: "31 January 2027",
    title: "Estimated tax payment",
    detail: "S$900k. The date is less certain, and this is the last of the five.",
    status: "Pending",
  },
  {
    when: "Undated",
    title: "Governance decision",
    detail: "Asset transfers are frozen until this concludes, so it gates the trust work rather than following it.",
    status: "Blocked",
    dependsOn: "Revised trust documents to be reviewed",
  },
];

export const OPEN_ACTIONS = [
  { text: "Prepare options for a family investment committee structure", owner: "Advisory", due: null },
  { text: "Create a funding plan for the S$6.95m of commitments", owner: null, due: "before 12 October" },
  { text: "Obtain an updated Whitfield Ventures valuation", owner: null, due: null },
  { text: "Review trust distribution provisions with legal counsel", owner: "Legal", due: null },
  { text: "Arrange a philanthropy session with Sophie", owner: null, due: null },
] as const;

/* -------------------------------------------------------------------------- */
/* Sources — RECORDED                                                          */
/* -------------------------------------------------------------------------- */

export const SOURCES = [
  { name: "Bank and custody balances", detail: "as at 30 June 2026" },
  { name: "Property valuations", detail: "four dates, Oct 2025 – Jun 2026" },
  { name: "Private fund valuations", detail: "four dates, Mar 2025 – Jun 2026" },
  { name: "Family business valuation", detail: "31 December 2025" },
  { name: "Governance meeting note", detail: "family governance and succession" },
  { name: "Cash reserve she asked for", detail: "at least S$7m accessible" },
] as const;

/* -------------------------------------------------------------------------- */
/* Formatting                                                                  */
/* -------------------------------------------------------------------------- */

/** S$ millions. Her file states everything in SGD, so nothing is converted. */
export const sgd = (millions: number, decimals = 1) =>
  `S$${millions.toFixed(decimals)}m`;

export const sgdCompact = (millions: number) =>
  millions < 1 ? `S$${Math.round(millions * 1000)}k` : sgd(millions);

export const pct = (fraction: number, decimals = 1) =>
  `${(fraction * 100).toFixed(decimals)}%`;

export const signedPct = (fraction: number, decimals = 1) =>
  `${fraction >= 0 ? "+" : "−"}${Math.abs(fraction * 100).toFixed(decimals)}%`;
