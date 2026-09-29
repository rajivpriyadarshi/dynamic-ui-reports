import type { Bearing, Story } from "@/app/lab/news-briefing/data"
import { Attribution } from "@/components/news-briefing/briefing"

/**
 * The week's stories, ordered by what they bear on and weighted by his money.
 *
 * This is the briefing itself, and its ordering is the argument. A news feed hands over fifty
 * items in reverse chronological order; ranking them by the dollars they touch promotes an
 * opinion column, because the one item mentioning two of his holdings at once happens to be
 * commentary. So the primary key is a declared judgement — bears on a decision, material,
 * context, procedural — and exposure only orders within it. The judgement is printed, per story,
 * so a reader who disagrees can see exactly which line to argue with.
 *
 * Each story carries the money it reaches, which is the part neither source holds alone: the feed
 * knows Apple lost a patent case and does not know that US$5.95m of his listed book is Apple.
 *
 * The custodian split belongs to the position rather than to the story — it is identical on the
 * nine rows about Apple alone — so it is stated once in the section's prose instead of nine times
 * down the column. A first draft printed it per row and the column read as a repeating pattern
 * rather than as information. The same reasoning removes the per-ticker figure from single-holding
 * rows, where it only restated the exposure above it.
 *
 * The group heading carries the count and the definition, so the shape of the week reads before
 * any headline does: one decision, three material, and eight items that are neither.
 */

export type StoryGroup = {
  bearing: Bearing
  label: string
  definition: string
  stories: Story[]
}

const signed = (score: number) =>
  `${score >= 0 ? "+" : "−"}${Math.abs(score).toFixed(2)}`

const usd = (millions: number) => `US$${millions.toFixed(2)}m`

function StoryRelevance({ groups }: { groups: StoryGroup[] }) {
  /** One scale across every group, or the exposure bars compare nothing. */
  const scale = Math.max(
    ...groups.flatMap((group) => group.stories.map((story) => story.exposure))
  )

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.bearing}>
          {/* Same column geometry as the rows below, so the one exposure label reads as a
              column head instead of being repeated above all twelve figures. */}
          <div className="grid gap-x-10 border-b border-foreground/25 pb-2 lg:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="text-[0.9375rem] font-medium tracking-tight">
                {group.label}
              </h3>
              <span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
                {group.stories.length}
              </span>
              <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                {group.definition}
              </p>
            </div>
            <span className="hidden font-mono text-[0.625rem] tracking-[0.1em] text-muted-foreground uppercase lg:block">
              His exposure
            </span>
          </div>

          {group.stories.map((story) => (
            <article
              key={story.url}
              className="grid gap-x-10 gap-y-3 border-b py-5 lg:grid-cols-[minmax(0,1fr)_13rem]"
            >
              <div className="min-w-0">
                <h4 className="text-[0.9375rem] leading-snug text-balance">
                  {story.title}
                </h4>
                <Attribution
                  source={story.source}
                  at={story.at}
                  className="mt-1.5"
                />
                {story.note && (
                  <p className="mt-2.5 max-w-[62ch] border-l pl-3.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {story.note}
                  </p>
                )}
              </div>

              <dl className="lg:pt-0.5">
                <dt className="sr-only">His exposure</dt>
                <dd className="text-[1.375rem] leading-none font-medium tracking-tight tabular-nums">
                  {usd(story.exposure)}
                </dd>
                <dd
                  aria-hidden
                  className="mt-2.5 h-1 w-full bg-foreground/[0.06]"
                >
                  <div
                    className="h-full bg-foreground"
                    style={{ width: `${(story.exposure / scale) * 100}%` }}
                  />
                </dd>

                {/* On the nine single-position rows the breakdown would restate the figure
                    above it, so only a story reaching more than one holding gets one. */}
                <div className="mt-3 space-y-1">
                  {story.touches.map((touch) => (
                    <div
                      key={touch.ticker}
                      className="flex items-baseline gap-2.5 text-xs"
                    >
                      <dt className="font-mono text-[0.6875rem]">
                        {touch.ticker}
                      </dt>
                      {story.touches.length > 1 && (
                        <dd className="text-muted-foreground tabular-nums">
                          {usd(touch.marketValue)}
                        </dd>
                      )}
                      <dd className="ml-auto text-muted-foreground tabular-nums">
                        {signed(touch.sentiment)}
                      </dd>
                    </div>
                  ))}
                </div>
              </dl>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}

export { StoryRelevance }
