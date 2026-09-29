/**
 * How total assets are split, as one bar rather than a donut.
 *
 * A single bar keeps the classes in rank order and makes the two large ones — listed
 * securities and property, three quarters of the book between them — comparable by
 * length, which a donut makes people judge by angle instead.
 *
 * The shades run strong to faint in the same order as the weights, so the ramp restates
 * the ranking rather than introducing six arbitrary colours.
 *
 * They are opacities of `--foreground` rather than the `--chart-1…5` tokens, which this
 * preset defines identically in light and dark. Using the ramp literally would put the
 * *darkest* shade on the largest class — correct on white, and inverted on black, where
 * the smallest classes would be the ones that pop. Opacity of the foreground keeps
 * prominence tracking weight in both.
 */

const SHADES = [0.82, 0.62, 0.45, 0.32, 0.22, 0.13]

const pct = (fraction: number, decimals = 1) =>
  `${(fraction * 100).toFixed(decimals)}%`

const shade = (index: number) =>
  `color-mix(in oklab, var(--foreground) ${SHADES[index] * 100}%, var(--background))`

type Slice = { label: string; weight: number }

function AllocationBreakdown({
  allocation,
  totalAssets,
  money,
}: {
  allocation: readonly Slice[]
  totalAssets: number
  /** The client's own currency formatter — nothing here assumes US dollars. */
  money: (millions: number) => string
}) {
  return (
    <div className="space-y-5">
      <div
        className="flex h-11 w-full overflow-hidden rounded-sm"
        role="img"
        aria-label={allocation
          .map((slice) => `${slice.label} ${pct(slice.weight, 1)}`)
          .join(", ")}
      >
        {allocation.map((slice, index) => (
          <div
            key={slice.label}
            style={{
              flexBasis: `${slice.weight * 100}%`,
              backgroundColor: shade(index),
            }}
          />
        ))}
      </div>

      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {allocation.map((slice, index) => (
          <div
            key={slice.label}
            className="flex items-baseline gap-2.5 border-b pb-2.5"
          >
            <span
              aria-hidden
              className="size-2 shrink-0 translate-y-[-1px] rounded-[2px]"
              style={{ backgroundColor: shade(index) }}
            />
            <dt className="min-w-0 flex-1 truncate text-[0.8125rem]">
              {slice.label}
            </dt>
            <dd className="text-[0.8125rem] tabular-nums">
              <span className="font-medium">{pct(slice.weight, 1)}</span>
              <span className="ml-2 text-muted-foreground">
                {money(slice.weight * totalAssets)}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { AllocationBreakdown }
