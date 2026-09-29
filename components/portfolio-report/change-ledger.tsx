import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

/**
 * What moved since the last review, read like a statement rather than a feed.
 *
 * One row per change: label, previous → current, and the sentence that explains it.
 * Rows are separated by rules, not wrapped in cards, and the order is by significance
 * rather than by date — which is also why this is not a timeline.
 */

/**
 * The shape is declared here rather than imported from one client's data file, because
 * two clients now use this and neither owns the contract.
 */
type Change = {
  label: string
  from: string
  to: string
  note: string
  status?: string
}

/** Only genuine states get a badge. "Noted" and "Approved" are not states, they are prose. */
const BADGED = ["Revaluation", "Pending"]

function ChangeLedger({
  changes,
  className,
}: {
  changes: Change[]
  className?: string
}) {
  return (
    <div className={className}>
      {changes.map((change, index) => (
        <div key={change.label}>
          {index > 0 && <Separator />}
          <div className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[minmax(0,15rem)_minmax(0,16rem)_minmax(0,1fr)] md:items-baseline">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium">{change.label}</span>
              {change.status && BADGED.includes(change.status) && (
                <Badge variant="outline" className="font-normal">
                  {change.status}
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-2 text-sm tabular-nums">
              <span className="text-muted-foreground">{change.from}</span>
              <ArrowRight
                aria-hidden
                className="size-3 shrink-0 translate-y-px text-muted-foreground/60"
              />
              <span className="font-medium">{change.to}</span>
            </div>

            <p
              className={cn(
                "max-w-[56ch] text-[0.8125rem] leading-relaxed text-muted-foreground"
              )}
            >
              {change.note}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export { ChangeLedger, type Change }
