import {
  BALANCE_SHEET,
  ENTITIES,
  FAMILY_BUSINESS,
  PRIVATE_FUNDS,
  SECURITIES,
  pct,
  sgd,
} from "@/app/lab/portfolio-report/eleanor/data"

/**
 * Which entity holds what — and how much of the balance sheet no entity is recorded for.
 *
 * Her file names an owner twice: two private funds sit in the family trust, and the 12%
 * manufacturing stake sits in the holding company. It says nothing about the other
 * S$86.8m. That silence is the exhibit, so the third group is labelled for what it is —
 * no entity recorded — rather than guessed at as "held personally".
 *
 * Set as an indented structure rather than a chart: the quantity is containment, and the
 * point is which branch each asset hangs from. The rules are the diagram; there are no
 * boxes.
 */

const held = (name: string) =>
  PRIVATE_FUNDS.find((fund) => fund.name === name)!.value

const TRUST_FUND_NAMES = ["Asia Growth Partners II", "Meridian Infrastructure Fund"]

type Branch = {
  name: string
  kind?: string
  role?: string
  items: { name: string; value: number }[]
  /** No owner recorded in her file, as opposed to an entity she has. */
  unattributed?: boolean
}

const BRANCHES: Branch[] = [
  {
    name: ENTITIES[0].name,
    kind: `${ENTITIES[0].kind} · ${ENTITIES[0].jurisdiction}`,
    role: ENTITIES[0].role,
    items: TRUST_FUND_NAMES.map((name) => ({ name, value: held(name) })),
  },
  {
    name: ENTITIES[1].name,
    kind: `${ENTITIES[1].kind} · ${ENTITIES[1].jurisdiction}`,
    role: ENTITIES[1].role,
    items: [
      {
        name: `${pct(FAMILY_BUSINESS.ownership, 0)} of ${FAMILY_BUSINESS.name}`,
        value: FAMILY_BUSINESS.value,
      },
    ],
  },
  {
    name: "No entity recorded",
    role: "Her file names no holder for these",
    unattributed: true,
    items: [
      { name: "Real estate, four properties", value: BALANCE_SHEET.property },
      { name: "Northstar PE Fund IV", value: held("Northstar PE Fund IV") },
      { name: "Whitfield Ventures", value: held("Whitfield Ventures") },
      {
        name: `Managed portfolio at ${SECURITIES.custodian}`,
        value: BALANCE_SHEET.securities,
      },
      { name: "Cash, three accounts", value: BALANCE_SHEET.cash },
    ],
  },
]

const total = (branch: Branch) =>
  branch.items.reduce((sum, item) => sum + item.value, 0)

function EntityStructure() {
  return (
    <div className="max-w-[44rem] space-y-8">
      {BRANCHES.map((branch) => {
        const subtotal = total(branch)

        return (
          <div key={branch.name}>
            <div className="flex items-baseline justify-between gap-6 border-b border-foreground/20 pb-2.5">
              <div className="min-w-0">
                <p
                  className={
                    branch.unattributed
                      ? "text-[0.875rem] font-medium text-muted-foreground"
                      : "text-[0.875rem] font-medium"
                  }
                >
                  {branch.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {[branch.kind, branch.role].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex shrink-0 items-baseline gap-2.5">
                <span className="text-lg leading-none font-medium tracking-tight tabular-nums">
                  {sgd(subtotal)}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {pct(subtotal / BALANCE_SHEET.totalAssets, 1)}
                </span>
              </div>
            </div>

            {/* The indent and the rule down its left edge are the containment. */}
            <ul className="mt-1 ml-3 border-l border-foreground/25 pl-5">
              {branch.items.map((item) => (
                <li
                  key={item.name}
                  className="relative flex items-baseline justify-between gap-6 py-[0.4375rem]"
                >
                  <span
                    aria-hidden
                    className="absolute top-1/2 -left-5 w-3 border-t border-foreground/25"
                  />
                  <span className="text-[0.8125rem] text-foreground/85">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-[0.8125rem] text-muted-foreground tabular-nums">
                    {sgd(item.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export { EntityStructure }
