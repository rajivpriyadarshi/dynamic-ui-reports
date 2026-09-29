import { cn } from "@/lib/utils"

/**
 * The briefing's own editorial furniture.
 *
 * Deliberately not the report's `Chapter`. A report is a studied document and its chapters
 * are numbered because the reader is expected to move between them. A briefing is read once,
 * top to bottom, on the morning it is issued — so its sections are labelled like a wire
 * service rather than numbered like a note, and the rule runs after the label instead of
 * above it. The two products should not look like each other.
 */

/** A section boundary: a small mono label, then a hairline to the margin. */
function BriefingSection({
  label,
  className,
  children,
  ...props
}: React.ComponentProps<"section"> & { label: string }) {
  return (
    <section className={cn("scroll-mt-16", className)} {...props}>
      <div className="mb-7 flex items-center gap-4">
        <h2 className="shrink-0 font-mono text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-foreground/15" />
      </div>
      {children}
    </section>
  )
}

/** Source and time, always together and always monospaced. The briefing's signature. */
function Attribution({
  source,
  at,
  className,
}: {
  source: string
  at: string
  className?: string
}) {
  return (
    <p
      className={cn(
        "font-mono text-[0.6875rem] text-muted-foreground",
        className
      )}
    >
      {source} · {at}
    </p>
  )
}

/** Reading text. Narrower than the report's measure — this is skimmed, not studied. */
function Lede({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-[58ch] text-[0.9375rem] leading-[1.65] text-foreground/85 [&_strong]:font-medium [&_strong]:text-foreground [&_p+p]:mt-3.5",
        className
      )}
      {...props}
    />
  )
}

export { BriefingSection, Attribution, Lede }
