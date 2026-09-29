import {
  CAPITAL_CALL,
  LIQUIDITY,
  usd,
  usdCompact,
} from "@/app/lab/portfolio-report/prashanth/data"
import { Card } from "@/components/ui/card"

/**
 * Where the September US$500k comes from, and what it leaves behind.
 *
 * A flow diagram made of type and hairlines rather than boxes: three stops on one line,
 * because that is all the transaction is. The bars beneath it are the consequence —
 * total liquidity before and after, on the same scale, so the reader can see that this
 * is comfortably covered and exactly how much room is left.
 *
 * The only Card on the page. It is here because this figure is a self-contained aside
 * from the narrative — a transaction schedule — rather than part of its argument.
 */

const AFTER = LIQUIDITY.total - CAPITAL_CALL.amount

function CapitalFlow() {
  return (
    <Card data-size="sm" className="gap-0 px-(--card-spacing)">
      <div className="grid items-start gap-y-6 sm:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1.2fr)_3.5rem_minmax(0,1fr)]">
        <Stop
          label="Source"
          title={CAPITAL_CALL.fundingSource}
          value={usd(LIQUIDITY.treasuryBills)}
          detail="Held at Goldman Sachs"
        />
        <Connector />
        <Stop
          label="Commitment"
          title={CAPITAL_CALL.fund}
          value={usdCompact(CAPITAL_CALL.amount)}
          detail={`Approved ${CAPITAL_CALL.approvedAt} · due ${CAPITAL_CALL.deadline}`}
          emphasis
        />
        <Connector />
        <Stop
          label="Remaining"
          title="Treasury bills after the call"
          value={usd(LIQUIDITY.treasuryBills - CAPITAL_CALL.amount)}
          detail="Unencumbered"
        />
      </div>

      <div className="mt-8 space-y-3 border-t pt-6">
        <p className="text-[0.6875rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
          Total liquidity
        </p>
        <LiquidityBar
          label="Today"
          value={LIQUIDITY.total}
          scale={LIQUIDITY.total}
        />
        <LiquidityBar
          label="After the call"
          value={AFTER}
          scale={LIQUIDITY.total}
          muted
        />
        <p className="pt-1 text-xs text-muted-foreground">
          Cash {usd(LIQUIDITY.cash)} plus Treasury bills{" "}
          {usd(LIQUIDITY.treasuryBills)}. The call consumes{" "}
          {Math.round((CAPITAL_CALL.amount / LIQUIDITY.total) * 100)}% of it.
        </p>
      </div>
    </Card>
  )
}

function Stop({
  label,
  title,
  value,
  detail,
  emphasis,
}: {
  label: string
  title: string
  value: string
  detail: string
  emphasis?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[0.625rem] font-medium tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </p>
      <p
        className={
          emphasis
            ? "text-xl leading-none font-medium tracking-tight tabular-nums"
            : "text-xl leading-none font-medium tracking-tight text-muted-foreground tabular-nums"
        }
      >
        {value}
      </p>
      <p className="text-[0.8125rem] leading-snug">{title}</p>
      <p className="text-xs leading-snug text-muted-foreground">{detail}</p>
    </div>
  )
}

/** A hairline with an arrowhead. Hidden on narrow screens, where the stops stack. */
function Connector() {
  return (
    <div aria-hidden className="hidden h-[4.5rem] items-center sm:flex">
      <span className="h-px flex-1 bg-border" />
      <svg width="5" height="7" viewBox="0 0 5 7" className="fill-border">
        <path d="M0 0 L5 3.5 L0 7 Z" />
      </svg>
    </div>
  )
}

function LiquidityBar({
  label,
  value,
  scale,
  muted,
}: {
  label: string
  value: number
  scale: number
  muted?: boolean
}) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_4rem] items-center gap-x-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span aria-hidden className="flex h-2.5 items-center">
        <span
          className={muted ? "h-2.5 bg-foreground/35" : "h-2.5 bg-foreground"}
          style={{ width: `${(value / scale) * 100}%` }}
        />
      </span>
      <span className="text-right text-[0.8125rem] tabular-nums">
        {usd(value, 2)}
      </span>
    </div>
  )
}

export { CapitalFlow }
