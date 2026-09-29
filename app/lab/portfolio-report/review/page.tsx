import type { Metadata } from "next"

import { ReviewReport } from "./report"
import { ThemeToggle } from "@/components/portfolio-report/theme-toggle"

export const metadata: Metadata = {
  title: "Portfolio review",
  description:
    "A portfolio review written from a single undated review note, with the gaps in that note stated rather than filled.",
}

/**
 * One report, so no client switcher — there is nothing to switch to. The theme toggle stays,
 * because it is a reading control rather than navigation.
 */
export default function PortfolioReviewPage() {
  return (
    <>
      <ReviewReport />
      <div className="fixed right-5 bottom-5 z-40 flex items-stretch gap-2 print:hidden">
        <ThemeToggle />
      </div>
    </>
  )
}
