import { ArrowRight } from "lucide-react"

/**
 * The order the governance decisions have to happen in.
 *
 * This replaces a paragraph that said the same thing in sentences. The ordering is the
 * finding — the deed defines the committee's authority, the committee defines James's
 * role, and the role is what she wants settled before assets move — so it is set as a
 * chain, with the frozen step marked at the end rather than badged.
 */

const STEPS: { step: string; detail: string; frozen?: boolean }[] = [
  { step: "Revised trust deed", detail: "Under review at Withers" },
  { step: "Investment committee authority", detail: "Defined by the deed" },
  { step: "James's formal role", detail: "Defined by the committee" },
  { step: "Asset transfers", detail: "On hold until then", frozen: true },
]

function DecisionOrder() {
  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:items-stretch">
      {STEPS.map((item, index) => (
        <li
          key={item.step}
          className="flex flex-1 items-start gap-3 py-3 sm:py-0"
        >
          {index > 0 && (
            <ArrowRight
              aria-hidden
              className="mt-2.5 size-3.5 shrink-0 text-muted-foreground/60 sm:mx-1"
            />
          )}
          <div className="min-w-0 border-t-2 pt-2.5 sm:w-full">
            <p
              className={
                item.frozen
                  ? "text-[0.8125rem] font-medium text-muted-foreground"
                  : "text-[0.8125rem] font-medium"
              }
            >
              {item.step}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export { DecisionOrder }
