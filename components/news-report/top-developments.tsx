"use client"

import * as React from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import styles from "@/app/lab/news-report/report.module.css"

type Tone = "positive" | "negative" | "neutral"
type Ticker = string

export type DevelopmentStory = {
  ticker: Ticker
  name: string
  exposure: string
  category: string
  relevance: string
  title: string
  body: string
  signal: string
  tone: Tone
  updates: { title: string; brief: string; signal: string; tone: Tone }[]
}

export function Company({ ticker }: { ticker: Ticker }) {
  return (
    <span className={styles.company} aria-hidden="true">
      {ticker === "MSFT" ? (
        <span className={styles.microsoft}>
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : ticker === "NVDA" ? (
        <Cpu />
      ) : ticker === "VOO" ? (
        <span className={styles.vanguard}>V</span>
      ) : ticker === "AAPL" ? (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.4 1.3c.1 1.5-.5 2.9-1.4 3.9-.9 1-2.1 1.6-3.5 1.5-.2-1.4.5-2.8 1.4-3.7.9-1 2.3-1.6 3.5-1.7ZM19.8 17.4c-.5 1.2-.8 1.8-1.5 2.9-.9 1.3-2.1 2.9-3.6 2.9-1.3 0-1.6-.8-3.4-.8-1.8 0-2.1.8-3.5.8-1.5 0-2.6-1.4-3.5-2.7C1.8 16.8 1.1 12 2.7 9.5c1.1-1.8 2.9-2.8 4.6-2.8 1.5 0 2.5.8 3.8.8 1.2 0 2-.8 3.8-.8 1.4 0 2.9.8 4 2.1-3.5 1.9-3 6.9.9 8.6Z" />
        </svg>
      ) : (
        <span className={styles.vanguard}>{ticker.slice(0, 1)}</span>
      )}
    </span>
  )
}

function Signal({ tone, children }: { tone: Tone; children: React.ReactNode }) {
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

function TopDevelopments({ stories }: { stories: DevelopmentStory[] }) {
  const railRef = React.useRef<HTMLDivElement>(null)
  const [position, setPosition] = React.useState({
    first: 0,
    visible: 2,
    atStart: true,
    atEnd: false,
  })
  const railId = React.useId()

  React.useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    const update = () => {
      const cards = Array.from(rail.children) as HTMLElement[]
      if (!cards.length) return
      const step =
        cards.length > 1
          ? cards[1].offsetLeft - cards[0].offsetLeft
          : cards[0].offsetWidth
      const visible = Math.max(1, Math.round(rail.clientWidth / step))
      setPosition({
        first: Math.round(rail.scrollLeft / step),
        visible,
        atStart: rail.scrollLeft < 2,
        atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
      })
    }
    update()
    rail.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(rail)
    return () => {
      rail.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [stories.length])

  const move = (direction: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const first = rail.children[0] as HTMLElement | undefined
    const second = rail.children[1] as HTMLElement | undefined
    const step =
      first && second ? second.offsetLeft - first.offsetLeft : rail.clientWidth
    rail.scrollTo({
      left: (Math.round(rail.scrollLeft / step) + direction) * step,
      behavior: "instant",
    })
  }

  return (
    <div
      className={styles.storyCarousel}
      id="holdings"
      role="region"
      aria-roledescription="carousel"
      aria-label="News by holding"
    >
      <div className={styles.carouselToolbar}>
        <p className={styles.eyebrow}>Ranked by relevance</p>
        <div className={styles.carouselControls}>
          <span aria-live="polite" aria-atomic="true">
            {position.first + 1}
            {position.visible > 1 &&
              `–${Math.min(position.first + position.visible, stories.length)}`}{" "}
            of {stories.length}
          </span>
          <Button
            aria-label="Previous holding"
            aria-controls={railId}
            onClick={() => move(-1)}
            disabled={position.atStart}
            size="icon-sm"
            variant="outline"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            aria-label="Next holding"
            aria-controls={railId}
            onClick={() => move(1)}
            disabled={position.atEnd}
            size="icon-sm"
            variant="outline"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </div>
      <div
        className={styles.storyGrid}
        id={railId}
        ref={railRef}
        tabIndex={0}
        aria-label="Holding stories. Use left and right arrow keys to browse."
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault()
            move(event.key === "ArrowRight" ? 1 : -1)
          }
        }}
      >
        {stories.map((story, index) => (
          <article
            className={styles.story}
            id={`holding-${story.ticker}`}
            key={story.ticker}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${stories.length}: ${story.name}`}
          >
            <header className={styles.holdingHeader}>
              <div className={styles.holdingName}>
                <Company ticker={story.ticker} />
                <div>
                  <p>{story.name}</p>
                  <span className={styles.eyebrow}>{story.ticker}</span>
                </div>
              </div>
              <div className={styles.holdingExposure}>
                <strong>{story.exposure}</strong>
                <span>Your exposure</span>
              </div>
            </header>
            <div className={styles.storyMeta}>
              <Badge
                variant={
                  story.relevance === "High relevance"
                    ? "destructive"
                    : "secondary"
                }
              >
                {story.relevance}
              </Badge>
              <span className={styles.eyebrow}>{story.category}</span>
            </div>
            <h3>{story.title}</h3>
            <p className={styles.storyBody}>{story.body}</p>
            <details className={styles.supportingUpdates}>
              <summary>
                <span>{story.updates.length} other updates</span>
                <span className={styles.updateSummaryMeta}>
                  <Signal tone={story.tone}>{story.signal}</Signal>
                  <ChevronDown
                    className={styles.summaryChevron}
                    aria-hidden="true"
                  />
                </span>
              </summary>
              <ul>
                {story.updates.map((update) => (
                  <li key={update.title}>
                    <div>{update.title}</div>
                    <Signal tone={update.tone}>{update.signal}</Signal>
                    <p className={styles.updateBrief}>{update.brief}</p>
                  </li>
                ))}
              </ul>
            </details>
          </article>
        ))}
      </div>
    </div>
  )
}
export { TopDevelopments }
