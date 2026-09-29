# Portfolio Analysis — Prashanth Ranganathan

Implementation plan for `/lab/portfolio-report-prashanth`.

## Inspection findings

**Project** — `shadcn-app`, Next 16, shadcn preset `b6sByO3Bi` (`base-vega` style,
olive base). Components live in `components/ui`, primitives are **Base UI** (so
triggers take `render`, not `asChild`). Charts are shadcn `chart.tsx` + Recharts 3.8.

**Theme** — `--chart-1 … --chart-5` is a *monochrome olive ramp*
(L 0.88 → 0.286, chroma ≤ 0.031). `--destructive` is the only saturated token.
Radius `0.625rem`. Font Inter via `--font-sans`; `--font-heading` inherits.

Consequence for this report: restraint is the theme's default, not something to
impose. No new colour tokens are introduced.

| role | token |
| --- | --- |
| portfolio / primary series | `--foreground` |
| benchmark / comparison | `--chart-2`, dashed |
| technology (meaningful highlight) | `--foreground` |
| everything receding | `--chart-1`, `--muted` |
| breach marker only | `--destructive` |

**Data** — real source is `oneview-webapp/app/lab/generative-ui/prashanth.ts`
(`PRASHANTH_BUNDLE`). Ported to `./data.ts` with provenance preserved. Every
aggregate reconciles:

- listed book = 9.52 + 5.95 + 4.76 + 3.57 + 1.42 = **US$25.22m**
- NVDA 3.57 / 25.22 = **14.2%** — matches the fixture's stated figure
- alloc.class × US$60.1m reproduces cash 1.20 ≈ 1.22, private 2.40 ≈ 2.36, digital 3.49 ≈ 3.47
- unrealised gain 4.60 / cost 20.62 = **+22.3pp**; shares are exactly 40 / 25 / 20 / 15%

## Honest-data decisions

The fixture carries cost basis and market value "and nothing in between", so three
of the brief's suggested elements had no data behind them. Resolved without
inventing figures:

1. **YTD / 1Y / 3Y toggle → 1M / 3M / 6M / YTD.** The series starts 31 December;
   1Y and 3Y cannot exist. `perf.returns` gives real 1M/3M/6M portfolio, benchmark
   and alpha.
2. **Benchmark line** is observed at Feb, May, Jul, Aug only (derivable from the
   three real period returns). Drawn as a dashed line through those four points
   with `connectNulls` rather than interpolating the five unobserved months.
3. **Currency and custodian lenses dropped** from `ExposureLens`; per-currency and
   per-custodian market values are not broken out in the source. Lenses are
   Security / Sector / Private / Digital — all real. Custodian detail survives
   where it genuinely exists: NVIDIA's split, in `LookThroughExposure`.
4. **Technology concentration** = AAPL + MSFT + NVDA = US$14.28m = **56.6% of the
   listed book**, derived from real market values, not the brief's illustrative 48%.

Only two values are synthetic. Both live in `portfolio-report-demo-data.ts`,
labelled demo-only, and both are disclosed on the page:

- the 30–40% preferred technology band (a policy figure, not in his IPS)
- Apple and Microsoft custodian splits (so the look-through selector has more than
  one state; NVIDIA's split is real)

## Composition

Widths alternate deliberately. Narrative sits in a `max-w-[62ch]` column;
analytical elements break to the full `1100px` measure.

| chapter | treatment | width |
| --- | --- | --- |
| 01 Readout | one dominant sentence, then 4 inline metrics on rules | narrow → full |
| 02 What changed | `ChangeLedger`, statement-like rows | full |
| 03 What drove performance | `PerformanceVsBenchmark` large; `ContributionAnalysis` smaller | full → 2/3 |
| 04 Current portfolio | `AllocationBreakdown` stacked bar; `ExposureLens` tabs; `LookThroughExposure` full-bleed; `HoldingsTable` compact | mixed |
| 05 What needs attention | four issues, four different visual forms | mixed |
| 06 What's coming | `EventTimeline` + `DependencyFlow` | narrow-ish |
| 07 Decisions | numbered editorial list | narrow |

## Components

Semantic, purpose-built, using project tokens only:

`ReadoutMetrics` · `ChangeLedger` · `PerformanceVsBenchmark` ·
`ContributionAnalysis` · `AllocationBreakdown` · `ExposureLens` ·
`LookThroughExposure` · `ConcentrationRisk` · `TargetRange` · `ExposureTrend` ·
`ManagerComparison` · `CapitalFlow` · `EventTimeline` · `DependencyFlow` ·
`DecisionList` · `DataLimitation`

shadcn primitives used intentionally: `Table` (holdings), `Tabs` variant `line`
(lenses), `ToggleGroup` (periods), `Separator` (rhythm), `Badge` (real states
only), `Tooltip` (chart detail), `Collapsible` (supporting evidence), `Alert`
(inside `DataLimitation`). `Card` is used **once**, for the capital-flow figure.
`Progress` is not used — it cannot express a target range.
