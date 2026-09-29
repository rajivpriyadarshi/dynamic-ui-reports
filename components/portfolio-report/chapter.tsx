import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

/**
 * The report's editorial structure — the elements a printed research note would have.
 * Not containers: no borders, no backgrounds, no shadows. They set measure and rhythm.
 */

/** A chapter. The rule above it is the boundary; nothing here is a card. */
function Chapter({
  number,
  title,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { number: string; title: string }) {
  return (
    <section className={cn("scroll-mt-16", className)} {...props}>
      <Separator className="mb-6" />
      <header className="mb-8 flex items-baseline gap-4">
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {number}
        </span>
        <h2 className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {title}
        </h2>
      </header>
      {children}
    </section>
  )
}

/** Small label above a figure or a statement. Understated on purpose. */
function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[0.6875rem] font-medium tracking-[0.1em] text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

/** Narrative prose. Constrained measure, generous leading — this is reading text. */
function Narrative({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-[62ch] text-[0.9375rem] leading-[1.7] text-foreground/85 [&_strong]:font-medium [&_strong]:text-foreground [&_p+p]:mt-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * An analytical exhibit. A heading, the thing itself, and optionally the note that
 * says what the reader should take from it or what its data cannot support.
 */
function Figure({
  label,
  title,
  note,
  className,
  children,
  ...props
}: React.ComponentProps<"figure"> & {
  label?: string
  title?: string
  note?: React.ReactNode
}) {
  return (
    <figure className={cn("m-0", className)} {...props}>
      {(label || title) && (
        <div className="mb-5 space-y-1.5">
          {label && <Eyebrow>{label}</Eyebrow>}
          {title && (
            <h3 className="max-w-[48ch] text-lg leading-snug font-medium tracking-tight text-balance">
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
      {note && (
        <figcaption className="mt-4 max-w-[70ch] text-xs leading-relaxed text-muted-foreground">
          {note}
        </figcaption>
      )}
    </figure>
  )
}

/** A number that carries weight, with its label beneath rather than above. */
function Figures({
  value,
  label,
  tone = "default",
  className,
}: {
  value: React.ReactNode
  label: React.ReactNode
  tone?: "default" | "muted"
  className?: string
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div
        className={cn(
          "text-2xl leading-none font-medium tracking-tight tabular-nums",
          tone === "muted" && "text-muted-foreground"
        )}
      >
        {value}
      </div>
      <div className="text-xs leading-snug text-muted-foreground">{label}</div>
    </div>
  )
}

export { Chapter, Eyebrow, Narrative, Figure, Figures }
