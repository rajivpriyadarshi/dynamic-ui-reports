import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { ThemeToggle } from "@/components/portfolio-report/theme-toggle"
import { TopDevelopments } from "@/components/news-report/top-developments"
import {
  NextSignals,
  ReportHero,
  ReportSection,
  SourceCoverage,
  ThemeConnections,
} from "@/components/news-report/report-components"
import { briefing } from "./report-data"
import styles from "./report.module.css"

export const metadata: Metadata = {
  title: "News report · Prashanth",
  description:
    "A static portfolio news briefing for Prashanth, based on the supplied report reference.",
}

export default function NewsReportPage() {
  return (
    <main className={styles.report} id="top">
      <ReportHero hero={briefing.hero} />

      <ReportSection
        id="developments"
        title="What matters most"
        subtitle="The key developments and their relevance to your holdings."
      >
        <TopDevelopments stories={briefing.holdings} />
      </ReportSection>

      {briefing.nextSignals && briefing.nextSignals.length > 0 && (
        <ReportSection
          id="what-happens-next"
          title="What happens next"
          subtitle="The next signals to look for — and what they could clarify."
        >
          <NextSignals
            items={briefing.nextSignals}
            portfolioWatch={briefing.portfolioWatch}
          />
        </ReportSection>
      )}

      {briefing.themes && briefing.themes.length > 0 && (
        <ReportSection
          id="themes"
          title="Themes in motion"
          subtitle="How the individual stories connect across your portfolio."
        >
          <ThemeConnections
            items={briefing.themes}
            footnote={briefing.themeFootnote}
          />
        </ReportSection>
      )}

      {briefing.sources && briefing.sources.length > 0 && (
        <ReportSection
          id="sources"
          title="Sources & coverage"
          subtitle={`Selected coverage · ${briefing.sources.length} of the ${briefing.articleCount ?? briefing.sources.length} articles in this briefing.`}
        >
          <SourceCoverage items={briefing.sources} />
        </ReportSection>
      )}

      <footer className={styles.footer}>
        <p>
          News briefing <span> / </span> {briefing.recipient} <span> / </span>{" "}
          {briefing.reportDate}
        </p>
        {briefing.referenceNote && <p>{briefing.referenceNote}</p>}
        <a className={styles.textLink} href="#top">
          Back to top <ArrowUpRight aria-hidden="true" />
        </a>
      </footer>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
    </main>
  )
}
