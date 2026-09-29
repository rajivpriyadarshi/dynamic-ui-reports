import { Badge } from "@/components/ui/badge"
import { DependencyFlow } from "@/components/portfolio-report/dependency-flow"

/**
 * What is scheduled, in order, on one hairline.
 *
 * These three items really are chronological, which is the only reason this is a
 * timeline and the change ledger in chapter 02 is not. Small period, thin rule, small
 * node, strong title — and no bars, no lanes, no percentage-complete.
 *
 * Only Pending and Blocked carry a badge. Those are the two states that mean someone
 * outside the family office controls the date; the capital call's status is in its own
 * sentence, and badging all three would just repeat the timeline back to itself.
 *
 * And a badge only earns its place when it marks an exception. Eleanor's schedule is
 * five Pending items and one Blocked one, so "Pending" describes the schedule rather
 * than any row in it; a status held by most of the list is dropped and stated in prose
 * instead. Prashanth's three items are three different states, so all three are badged.
 */

/** Declared here, not imported from one client's data file: two clients use this. */
type UpcomingEvent = {
  when: string
  title: string
  detail: string
  status?: string
  dependsOn?: string
}

const BADGED = ["Pending", "Blocked"]

function EventTimeline({ events }: { events: UpcomingEvent[] }) {
  const unremarkable = new Set(
    BADGED.filter(
      (status) =>
        events.filter((event) => event.status === status).length >
        events.length / 2
    )
  )

  const badged = (event: UpcomingEvent) =>
    event.status !== undefined &&
    BADGED.includes(event.status) &&
    !unremarkable.has(event.status)

  return (
    <ol className="relative border-l pl-6">
      {events.map((event) => (
        <li key={event.title} className="relative pb-7 last:pb-0">
          <span
            aria-hidden
            className="absolute top-[0.45rem] -left-[calc(1.5rem+2.5px)] size-[5px] rounded-full bg-foreground"
          />
          <p className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
            {event.when}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h4 className="text-[0.9375rem] font-medium">{event.title}</h4>
            {badged(event) && (
              <Badge variant="outline" className="font-normal">
                {event.status}
              </Badge>
            )}
          </div>
          <p className="mt-1 max-w-[58ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
            {event.detail}
          </p>
          {event.dependsOn && <DependencyFlow dependsOn={event.dependsOn} />}
        </li>
      ))}
    </ol>
  )
}

export { EventTimeline, type UpcomingEvent }
