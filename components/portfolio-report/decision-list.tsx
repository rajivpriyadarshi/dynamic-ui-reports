"use client"

import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

/**
 * What the next conversation has to decide.
 *
 * A numbered editorial list — the closing section of a research note, not a task board.
 * The decision itself and the figure behind it are always visible; only the longer
 * evidence folds away, so nothing a reader needs in order to answer is hidden.
 */

export type Decision = {
  question: string
  /** The figure that forces the decision. One line, always visible. */
  basis: string
  /** Who or what is waiting, if anyone. */
  owner?: string
  /** Longer supporting detail. Optional, and never the decision itself. */
  evidence?: React.ReactNode
}

function DecisionList({ decisions }: { decisions: Decision[] }) {
  return (
    <ol className="space-y-0">
      {decisions.map((decision, index) => (
        <li
          key={decision.question}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 border-t py-6 first:border-t-0 first:pt-0"
        >
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="space-y-2">
            <h4 className="max-w-[54ch] text-base leading-snug font-medium tracking-tight text-balance">
              {decision.question}
            </h4>
            <p className="max-w-[62ch] text-[0.8125rem] leading-relaxed text-muted-foreground">
              {decision.basis}
              {decision.owner && (
                <span className="text-foreground/70"> · {decision.owner}</span>
              )}
            </p>

            {decision.evidence && (
              <Collapsible className="pt-1">
                <CollapsibleTrigger className="group/trigger -mx-1 inline-flex items-center gap-1 rounded px-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
                  <ChevronRight className="size-3 transition-transform group-data-[panel-open]/trigger:rotate-90" />
                  Supporting detail
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="max-w-[62ch] border-l pl-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {decision.evidence}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

export { DecisionList }
