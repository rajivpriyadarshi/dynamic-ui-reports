import type { Metadata } from "next"

import { EleanorReport } from "./eleanor/report"
import { PrashanthReport } from "./prashanth/report"
import { ReportViewer } from "./report-viewer"

export const metadata: Metadata = {
  title: "Portfolio analysis",
  description:
    "Portfolio analysis for two clients, written from their files rather than generated from a template.",
}

export default function PortfolioReportPage() {
  return (
    <ReportViewer
      reports={{
        prashanth: <PrashanthReport />,
        eleanor: <EleanorReport />,
      }}
    />
  )
}
