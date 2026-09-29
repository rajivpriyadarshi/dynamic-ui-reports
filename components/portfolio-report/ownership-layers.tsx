import {
  ENTITIES,
  PROPERTY,
  pct,
  usd,
} from "@/app/lab/portfolio-report/prashanth/data"

/**
 * The property total, split by who actually owns it.
 *
 * Set as a schedule rather than a chart because the finding is categorical, not
 * quantitative: one of the two houses is his, and the larger one is held by his wife's
 * living trust, where he is a beneficiary. A pie of 38/62 would obscure that; two rows
 * with the owner named in full do not.
 *
 * The bar above them exists only to carry the proportion, so it is one hairline-tall
 * strip rather than a second exhibit.
 */

const TOTAL = PROPERTY.reduce((sum, row) => sum + row.value, 0)

/** Largest first, so the strip's segments read in the same order as the rows below it. */
const ROWS = [...PROPERTY].sort((a, b) => b.value - a.value)

function OwnershipLayers() {
  return (
    <div className="space-y-8">
      <div>
        <div
          className="flex h-1.5 w-full overflow-hidden rounded-full"
          role="img"
          aria-label={ROWS.map(
            (row) => `${row.owner} ${pct(row.value / TOTAL, 0)}`
          ).join(", ")}
        >
          {ROWS.map((row) => (
            <div
              key={row.name}
              style={{
                flexBasis: `${(row.value / TOTAL) * 100}%`,
                backgroundColor:
                  row.ownerKind === "trust"
                    ? "color-mix(in oklab, var(--foreground) 80%, var(--background))"
                    : "color-mix(in oklab, var(--foreground) 28%, var(--background))",
              }}
            />
          ))}
        </div>

        <dl className="mt-1">
          {ROWS.map((row) => (
            <div
              key={row.name}
              className="grid gap-x-8 gap-y-1 border-b border-dotted py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_7rem] md:items-baseline"
            >
              <dt>
                <span className="text-sm font-medium">{row.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {row.where}
                </span>
              </dt>
              <dd className="text-[0.8125rem] text-muted-foreground">
                {row.owner}
              </dd>
              <dd className="text-right text-lg leading-none font-medium tracking-tight tabular-nums md:text-xl">
                {usd(row.value, 2)}
              </dd>
              <dd className="max-w-[52ch] text-xs leading-relaxed text-muted-foreground md:col-span-3">
                {row.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* the three names every figure in this report is ultimately booked against */}
      <div>
        <p className="text-[0.6875rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
          Capacities on the file
        </p>
        <ul className="mt-3 grid gap-x-10 gap-y-2.5 sm:grid-cols-3">
          {ENTITIES.map((entity) => (
            <li key={entity.name} className="border-t pt-2.5">
              <p className="text-[0.8125rem] font-medium">{entity.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {entity.kind} · {entity.jurisdiction}
              </p>
              <p className="mt-1 text-xs">{entity.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { OwnershipLayers }
