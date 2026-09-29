import type { ItemClass } from "@/app/lab/news-briefing/data"

/**
 * What the fifty items actually are.
 *
 * The vendor returns a flat list, which invites the reader to treat its length as the amount of
 * news. It is not: three quarters of this feed is machine-generated paperwork and passing
 * mentions, and the events that did occur arrive several times each. This component is the
 * briefing's honesty about its own raw material — it is the reason the rest of the page is
 * short.
 *
 * One segmented bar, ordered by usefulness rather than by size, so reading left to right is
 * reading down a gradient of how much a class deserves attention. The tones are a single-hue
 * ramp, which is legitimate here precisely because the classes are ordered on one dimension;
 * four distinct colours would imply four unrelated kinds.
 */

export type CompositionBand = {
  kind: ItemClass
  label: string
  count: number
  note: string
}

const TONES = [
  "var(--foreground)",
  "color-mix(in oklab, var(--foreground) 52%, var(--background))",
  "color-mix(in oklab, var(--foreground) 26%, var(--background))",
  "color-mix(in oklab, var(--foreground) 12%, var(--background))",
]

function FeedComposition({
  bands,
  total,
}: {
  /** Ordered from most to least worth reading. */
  bands: CompositionBand[]
  total: number
}) {
  return (
    <div className="space-y-7">
      <div aria-hidden className="flex h-3 w-full gap-px">
        {bands.map((band, index) => (
          <span
            key={band.kind}
            style={{
              width: `${(band.count / total) * 100}%`,
              backgroundColor: TONES[index] ?? TONES[TONES.length - 1],
            }}
          />
        ))}
      </div>

      <dl className="space-y-0">
        {bands.map((band) => (
          <div
            key={band.kind}
            className="grid gap-x-6 gap-y-1 border-b py-3 first:border-t md:grid-cols-[minmax(0,12rem)_4rem_minmax(0,1fr)] md:items-baseline"
          >
            <dt className="text-[0.8125rem] font-medium">{band.label}</dt>
            <dd className="text-[0.8125rem] tabular-nums md:text-right">
              {band.count} of {total}
            </dd>
            <dd className="max-w-[60ch] text-xs leading-relaxed text-muted-foreground">
              {band.note}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export { FeedComposition }
