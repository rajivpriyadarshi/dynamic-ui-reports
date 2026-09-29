import { Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Says plainly that a figure the reader might expect is not in the record.
 *
 * Informational, never alarming: neutral border, muted text, no destructive variant.
 * A missing benchmark is a fact about the data, not an error in the portfolio.
 */
function DataLimitation({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Alert className={cn("bg-muted/40 text-muted-foreground", className)}>
      <Info className="size-4" />
      <AlertTitle className="text-foreground/80">{title}</AlertTitle>
      <AlertDescription className="text-xs leading-relaxed">
        {children}
      </AlertDescription>
    </Alert>
  )
}

export { DataLimitation }
