import { cn } from "@/lib/utils"

/**
 * Draws the one dependency in the schedule, as an elbow back to the event it waits on.
 *
 * Deliberately a hairline and a sentence rather than a second diagram. There is exactly
 * one dependency in his file — the LGT transfer cannot start until the Withers trust
 * completes — and a Gantt chart to express a single edge would be all chrome.
 */
function DependencyFlow({
  dependsOn,
  className,
}: {
  dependsOn: string
  className?: string
}) {
  return (
    <div className={cn("flex items-start gap-2 pt-1", className)}>
      <span
        aria-hidden
        className="mt-1.5 h-3 w-4 shrink-0 rounded-bl-[3px] border-b border-l border-muted-foreground/40"
      />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Waits on <span className="text-foreground/80">{dependsOn}</span>
      </p>
    </div>
  )
}

export { DependencyFlow }
