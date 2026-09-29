import type { DevelopmentStory } from "./top-developments"

export type NewsTone = "positive" | "negative" | "neutral"

export type SentimentSummary = {
  headline: string
  summary: string
  bearish: number
  neutral: number
  bullish: number
}

export type BriefingHero = {
  eyebrow: string
  dateline: string
  marketSession: string
  title: string
  summary: string
  sentiment?: SentimentSummary
}

export type NextSignal = {
  ticker: string
  name: string
  signal: string
  whyItMatters: string
}

export type NewsTheme = {
  id: string
  title: string
  icon: "network" | "legal" | "trend"
  tickers: string[]
  developmentCount: number
  articleCount: number
  body: string
  signal: string
  tone: NewsTone
}

export type NewsSource = {
  id: string
  title: string
  publisher: string
  publishedAt: string
  signal: string
  tone: NewsTone
  url?: string
}

export type NewsBriefing = {
  recipient: string
  reportDate: string
  hero: BriefingHero
  holdings: DevelopmentStory[]
  nextSignals?: NextSignal[]
  portfolioWatch?: string
  themes?: NewsTheme[]
  themeFootnote?: string
  sources?: NewsSource[]
  articleCount?: number
  referenceNote?: string
}
