/**
 * The two clients this report has been written for.
 *
 * Deliberately not a schema. Each client has a hand-written report body of their own,
 * because their files hold different things and the honest report for each is a different
 * document — Prashanth's is about concentration he did not choose, Eleanor's is about
 * liquidity against commitments and valuations that have aged. A template driven off a
 * common shape would have to flatten one of those into the other.
 *
 * What lives here is only what the switcher needs to label a choice.
 */

export type ClientKey = "prashanth" | "eleanor";

export type ClientSummary = {
  key: ClientKey;
  name: string;
  /** Surname first for the switcher, where the list is scanned rather than read. */
  short: string;
  entity: string;
  currency: string;
  asOf: string;
  /** The one thing this client's report is actually about. */
  subject: string;
};

export const CLIENTS: ClientSummary[] = [
  {
    key: "prashanth",
    name: "Prashanth Ranganathan",
    short: "Ranganathan",
    entity: "PRTR Holdings",
    currency: "USD",
    asOf: "27 August 2026",
    subject: "Concentration across four custodians",
  },
  {
    key: "eleanor",
    name: "Eleanor Whitfield",
    short: "Whitfield",
    entity: "Whitfield Family Trust",
    currency: "SGD",
    asOf: "30 June 2026",
    subject: "Liquidity against commitments, and valuation age",
  },
];

/** Prashanth is the default: his is the report this document was written against. */
export const DEFAULT_CLIENT: ClientKey = "prashanth";
