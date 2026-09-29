/**
 * DEMO-ONLY VALUES. Not from Prashanth's record.
 *
 * Everything in this file is synthetic, and it is the only file in this report that is.
 * One constant, for one chart, disclosed on the page where it appears.
 *
 * An earlier version of this file also carried Apple and Microsoft custodian splits.
 * They have been deleted: the fixture records all five holdings at all four custodians,
 * so the real numbers were there the whole time and the synthetic ones were a worse
 * version of data that already existed.
 *
 * If this report were wired to live data, this constant is what would need replacing,
 * and nothing else.
 */

/**
 * DEMO-ONLY. A preferred range for technology exposure within the listed book.
 *
 * His file records the concentration as a flagged observation, not as a breach of a
 * stated policy — there is no investment policy statement, mandate or target range in
 * the source. This band is a plausible stand-in so `TargetRange` has a range to draw.
 * The measured 56.6% is real; where the band sits is not.
 */
export const DEMO_TECHNOLOGY_BAND = {
  min: 0.3,
  max: 0.4,
  label: "Preferred range",
  disclosure: "Illustrative range — his file records no stated policy limit.",
} as const;
