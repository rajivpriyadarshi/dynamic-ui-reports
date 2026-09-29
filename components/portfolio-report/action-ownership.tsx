import { OPEN_ACTIONS } from "@/app/lab/portfolio-report/prashanth/data"

/**
 * The four open actions on file, and how many of them name someone.
 *
 * This is the evidence for the section it sits in: the position is spread across four
 * statements, so no mandate owns it — and the action list shows the same absence, three
 * of four items with no owner recorded. Set as a schedule rather than a chart because the
 * quantity is presence or absence, not magnitude. Missing values are drawn as rules in
 * the column where a name would be, which is the whole exhibit.
 */

const UNOWNED = OPEN_ACTIONS.filter((action) => action.owner === null).length

function ActionOwnership() {
  return (
    <div>
      <div
        aria-hidden
        className="grid grid-cols-[minmax(0,1fr)_5.5rem_7.5rem] gap-x-5 border-b pb-2 text-[0.5625rem] font-medium tracking-[0.12em] text-muted-foreground uppercase"
      >
        <span>Open action</span>
        <span>Owner</span>
        <span className="text-right">Due</span>
      </div>

      <dl>
        {OPEN_ACTIONS.map((action) => (
          <div
            key={action.text}
            className="grid grid-cols-[minmax(0,1fr)_5.5rem_7.5rem] items-baseline gap-x-5 border-b border-dotted py-3"
          >
            <dt className="text-[0.8125rem] text-foreground/85">
              {action.text}
            </dt>
            <dd className="text-[0.8125rem] text-muted-foreground">
              {action.owner ?? (
                <span aria-label="No owner recorded" className="text-foreground/25">
                  ———
                </span>
              )}
            </dd>
            <dd className="text-right text-[0.8125rem] text-muted-foreground tabular-nums">
              {action.due ?? (
                <span aria-label="No date recorded" className="text-foreground/25">
                  ———
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex items-baseline justify-between gap-4">
        <p className="text-[0.6875rem] font-medium tracking-[0.1em] uppercase">
          Unassigned
        </p>
        <p className="text-xl leading-none font-medium tracking-tight tabular-nums">
          {UNOWNED} of {OPEN_ACTIONS.length}
        </p>
      </div>
    </div>
  )
}

export { ActionOwnership }
