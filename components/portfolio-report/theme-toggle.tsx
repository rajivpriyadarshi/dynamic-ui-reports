"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

/**
 * Paper or screen.
 *
 * Sits beside the client switcher and borrows its chrome exactly, because the two are
 * the same kind of thing: controls belonging to the reading device, not marks on the
 * document. One icon, no label, no third "system" option — the page defaults to light
 * and this is the one switch that changes it.
 */

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  // The resolved theme is not known until the client runs, so nothing is committed to
  // until then; the button keeps its footprint so the cluster does not shift.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const dark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex w-11 items-center justify-center rounded-md border bg-background/90 text-muted-foreground shadow-xs backdrop-blur-sm transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {mounted &&
        (dark ? (
          <Sun aria-hidden className="size-4" />
        ) : (
          <Moon aria-hidden className="size-4" />
        ))}
    </button>
  )
}

export { ThemeToggle }
