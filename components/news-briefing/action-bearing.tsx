import type { ActionBearing } from "@/app/lab/news-briefing/data"

/**
 * His open actions against the week's news.
 *
 * The useful output of a weekly briefing is usually "nothing here changes what you are already
 * doing", and that sentence is worthless unless the rows are shown. Three of the four actions
 * carried out of his August review — a mandate review, a capital call, a trust transfer — cannot
 * be reached by a ticker-keyed news feed at all, and the reason differs in each case, so each
 * reason is printed rather than summarised into one.
 *
 * Deliberately the plainest component on the page. An action with news against it is set in the
 * foreground and an action without is not; there is no badge, because "nothing bears on this" is
 * the expected state and marking it as a status would make an ordinary week look eventful.
 */

function ActionBearing({ actions }: { actions: ActionBearing[] }) {
  return (
    <dl>
      {actions.map((action) => (
        <div
          key={action.text}
          className="grid gap-x-10 gap-y-2 border-t py-4 last:border-b md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]"
        >
          <dt className="text-[0.8125rem] leading-snug">
            {action.text}
            {(action.owner || action.due) && (
              <span className="mt-1 block font-mono text-[0.6875rem] text-muted-foreground">
                {[action.owner, action.due].filter(Boolean).join(" · ")}
              </span>
            )}
          </dt>

          <dd className="min-w-0">
            {action.stories.length > 0 ? (
              action.stories.map((story) => (
                <div key={story.title}>
                  <p className="text-[0.8125rem] leading-snug">{story.title}</p>
                  <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
                    {story.source} · {story.at}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {action.reason}
              </p>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export { ActionBearing }
