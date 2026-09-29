import type { Metadata } from "next"

import { NewsBriefing } from "./briefing"
import { ThemeToggle } from "@/components/portfolio-report/theme-toggle"

export const metadata: Metadata = {
  title: "News briefing · PRTR Holdings",
  description:
    "Fifty news items read against Prashanth Ranganathan's listed holdings: the four stories that reach his money, what they leave untouched on his file, and why the other forty-six are not in the briefing.",
}

/**
 * One book, one captured feed, so no switcher. The theme toggle is shared with the reports
 * because it is a reading control rather than part of either product.
 */
export default function NewsBriefingPage() {
  return (
    <>
      <NewsBriefing />
      <div className="fixed right-5 bottom-5 z-40 flex items-stretch gap-2 print:hidden">
        <ThemeToggle />
      </div>
    </>
  )
}
