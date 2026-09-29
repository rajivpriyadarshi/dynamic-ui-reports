import { redirect } from "next/navigation"

/**
 * The report used to live here, when there was only one client. It now lives at
 * /lab/portfolio-report with a switcher, and Prashanth is still the default — so this
 * route lands on exactly what it used to show.
 */
export default function PortfolioReportPrashanthPage() {
  redirect("/lab/portfolio-report")
}
