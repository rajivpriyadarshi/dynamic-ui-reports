import type { ReactNode } from "react"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Gavel,
  Network,
  TrendingUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Company } from "./top-developments"
import type {
  BriefingHero as BriefingHeroData,
  NewsSource,
  NewsTheme,
  NewsTone,
  NextSignal,
  SentimentSummary,
} from "./report-types"
import styles from "@/app/lab/news-report/report.module.css"

function Signal({ tone, children }: { tone: NewsTone; children: ReactNode }) {
  const Icon =
    tone === "positive"
      ? ArrowUpRight
      : tone === "negative"
        ? ArrowDownRight
        : AudioLines
  return (
    <span className={styles.signal} data-tone={tone}>
      <Icon aria-hidden="true" />
      {children}
    </span>
  )
}

export function NewsSentiment({ sentiment }: { sentiment: SentimentSummary }) {
  const total = sentiment.bearish + sentiment.neutral + sentiment.bullish
  if (total === 0) return null

  const categories = [
    [sentiment.bearish, "Bearish", "negative"],
    [sentiment.neutral, "Neutral", "neutral"],
    [sentiment.bullish, "Bullish", "positive"],
  ] as const

  return (
    <div className={styles.summaryStrip}>
      <figure
        className={styles.mood}
        aria-label={`News sentiment: ${sentiment.headline}. ${sentiment.bullish} bullish, ${sentiment.neutral} neutral, and ${sentiment.bearish} bearish signals.`}
      >
        <div className={styles.moodOverview}>
          <div>
            <figcaption>News sentiment</figcaption>
            <p className={styles.moodHeadline}>{sentiment.headline}</p>
            <p className={styles.moodSummary}>{sentiment.summary}</p>
          </div>
          <div className={styles.moodChart}>
            <div
              className={styles.sentimentBar}
              style={{
                gridTemplateColumns: categories
                  .map(([count]) => `${Math.max(count, 0.001)}fr`)
                  .join(" "),
              }}
              aria-hidden="true"
            >
              {categories.map(([, label, tone]) => (
                <span key={label} data-tone={tone} />
              ))}
            </div>
            <div className={styles.moodLabels}>
              {categories.map(([count, label, tone]) => (
                <div key={label}>
                  <strong data-tone={tone}>{count}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </figure>
    </div>
  )
}

export function ReportHero({ hero }: { hero: BriefingHeroData }) {
  return (
    <header className={styles.hero}>
      <div className={styles.dateline}>
        <p>{hero.eyebrow}</p>
        <p>
          {hero.dateline} <span>·</span> {hero.marketSession}
        </p>
      </div>
      <div className={styles.heroGrid}>
        <div>
          <h1>{hero.title}</h1>
          <p className={styles.intro}>{hero.summary}</p>
        </div>
      </div>
      {hero.sentiment && <NewsSentiment sentiment={hero.sentiment} />}
    </header>
  )
}

export function ReportSection({
  id,
  title,
  subtitle,
  children,
  link,
}: {
  id: string
  title: string
  subtitle: string
  children: ReactNode
  link?: { label: string; href: string }
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <Separator />
      <header className={styles.sectionHeader}>
        <div>
          <div className={styles.sectionTitle}>
            <h2 id={`${id}-title`}>{title}</h2>
          </div>
          <p>{subtitle}</p>
        </div>
        {link && (
          <a className={styles.textLink} href={link.href}>
            {link.label}
            <ArrowRight aria-hidden="true" />
          </a>
        )}
      </header>
      {children}
    </section>
  )
}

export function NextSignals({
  items,
  portfolioWatch,
}: {
  items: NextSignal[]
  portfolioWatch?: string
}) {
  return (
    <>
      <div className={styles.nextSignals}>
        {items.map((item) => (
          <article key={item.ticker}>
            <a className={styles.holdingName} href={`#holding-${item.ticker}`}>
              <Company ticker={item.ticker} />
              <div>
                <h3>{item.name}</h3>
                <span className={styles.eyebrow}>{item.ticker}</span>
              </div>
            </a>
            <div>
              <p className={styles.eyebrow}>Next signal</p>
              <p>{item.signal}</p>
            </div>
            <div>
              <p className={styles.eyebrow}>Why it matters</p>
              <p>{item.whyItMatters}</p>
            </div>
          </article>
        ))}
      </div>
      {portfolioWatch && (
        <p className={styles.marketWatch}>
          <span className={styles.eyebrow}>Across the portfolio</span>
          {portfolioWatch}
        </p>
      )}
    </>
  )
}

const themeIcons = { network: Network, legal: Gavel, trend: TrendingUp }

export function ThemeConnections({
  items,
  footnote,
}: {
  items: NewsTheme[]
  footnote?: string
}) {
  return (
    <>
      <div className={styles.themes}>
        {items.map((theme) => {
          const Icon = themeIcons[theme.icon]
          return (
            <article key={theme.id}>
              <div className={styles.themeHeading}>
                <Icon aria-hidden="true" />
                <h3>{theme.title}</h3>
              </div>
              <div className={styles.tickers}>
                {theme.tickers.map((ticker) => (
                  <Badge
                    key={ticker}
                    variant="secondary"
                    render={<a href={`#holding-${ticker}`} />}
                  >
                    {ticker}
                  </Badge>
                ))}
              </div>
              <p className={styles.themeCount}>
                {theme.developmentCount} developments · {theme.articleCount}{" "}
                articles
              </p>
              <p className={styles.themeBody}>{theme.body}</p>
              <Signal tone={theme.tone}>{theme.signal}</Signal>
            </article>
          )
        })}
      </div>
      {footnote && <p className={styles.footnote}>{footnote}</p>}
    </>
  )
}

export function SourceCoverage({ items }: { items: NewsSource[] }) {
  return (
    <ol className={styles.sources}>
      {items.map((source, index) => (
        <li key={source.id} id={source.id}>
          <span className={styles.sourceNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3>
              {source.url ? (
                <a href={source.url}>{source.title}</a>
              ) : (
                source.title
              )}
            </h3>
            <p>
              {source.publisher}
              <span> · </span>
              {source.publishedAt}
            </p>
          </div>
          <Signal tone={source.tone}>{source.signal}</Signal>
        </li>
      ))}
    </ol>
  )
}
