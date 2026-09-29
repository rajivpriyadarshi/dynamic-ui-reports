"use client"

import * as React from "react"

import {
  DEFAULT_CLIENT,
  type ClientKey,
} from "@/app/lab/portfolio-report/clients"
import { ClientSwitcher } from "@/components/portfolio-report/client-switcher"
import { ThemeToggle } from "@/components/portfolio-report/theme-toggle"

/**
 * Holds which client's report is on screen.
 *
 * Both report bodies are rendered on the server and handed in as elements, so switching is
 * a swap rather than a fetch — and neither report has to become a client component to make
 * the switcher work. This file is the only stateful thing in the report.
 */
function ReportViewer({
  reports,
}: {
  reports: Record<ClientKey, React.ReactNode>
}) {
  const [active, setActive] = React.useState<ClientKey>(DEFAULT_CLIENT)

  return (
    <>
      {reports[active]}

      {/* The reading controls, bottom-right and outside the measure so they never cover
          the text. Not printed: on paper there is one client and one colour scheme. */}
      <div className="fixed right-5 bottom-5 z-40 flex items-stretch gap-2 print:hidden">
        <ThemeToggle />
        <ClientSwitcher active={active} onChange={setActive} />
      </div>
    </>
  )
}

export { ReportViewer }
