import type { DevelopmentStory } from "@/components/news-report/top-developments"
import type { NewsBriefing } from "@/components/news-report/report-types"

// Static reference content, consolidated by holding rather than repeated by section.
export const stories: DevelopmentStory[] = [
  {
    ticker: "AAPL",
    name: "Apple",
    exposure: "$5.95M",
    category: "Legal",
    relevance: "High relevance",
    title: "A $5.7B patent verdict puts Apple in focus",
    body: "A US jury ruled that Apple must pay over $5.7 billion to Taction for infringing on haptic technology patents. Apple disputes the verdict and plans to appeal.",
    signal: "Mixed / negative skew",
    tone: "negative",
    updates: [
      {
        title: "Removed from antitrust case",
        brief:
          "Apple was dropped from Musk’s AI antitrust lawsuit, easing one legal concern.",
        signal: "Somewhat bullish",
        tone: "positive",
      },
      {
        title: "New AI hardware developments",
        brief:
          "AI hardware coverage adds a positive product story alongside the legal headlines.",
        signal: "Somewhat bullish",
        tone: "positive",
      },
    ],
  },
  {
    ticker: "NVDA",
    name: "NVIDIA",
    exposure: "$3.41M",
    category: "AI / Infrastructure",
    relevance: "Medium relevance",
    title: "AI infrastructure demand gathers momentum",
    body: "Expanded partnerships and strong demand for NVIDIA’s next-generation AI chips keep the infrastructure story moving, with analysts positive on the growth outlook.",
    signal: "Positive news flow",
    tone: "positive",
    updates: [
      {
        title: "New partner announcements",
        brief:
          "Expanded partnerships add to the news around NVIDIA’s AI infrastructure business.",
        signal: "Somewhat bullish",
        tone: "positive",
      },
      {
        title: "Analyst price target increases",
        brief:
          "Higher analyst targets reflect a positive outlook for AI chip demand.",
        signal: "Somewhat bullish",
        tone: "positive",
      },
    ],
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    exposure: "$4.12M",
    category: "AI / Products",
    relevance: "Medium relevance",
    title: "Copilot expands across Microsoft 365",
    body: "New Copilot features broaden Microsoft’s AI offering. Analyst commentary remains constructive on customer adoption and revenue potential.",
    signal: "Positive news flow",
    tone: "positive",
    updates: [
      {
        title: "Positive analyst commentary",
        brief:
          "Analysts see potential for Copilot adoption to support revenue growth.",
        signal: "Somewhat bullish",
        tone: "positive",
      },
      {
        title: "Enterprise adoption updates",
        brief:
          "Coverage tracks how businesses are adopting Microsoft’s AI products.",
        signal: "Neutral",
        tone: "neutral",
      },
    ],
  },
  {
    ticker: "VOO",
    name: "Vanguard S&P 500",
    exposure: "$2.87M",
    category: "Market / Macro",
    relevance: "Lower relevance",
    title: "Mega-cap strength reaches the wider index",
    body: "Large-cap technology commentary and AI sector momentum also reach VOO through its underlying holdings, while broader market news remains mixed.",
    signal: "Mixed news flow",
    tone: "neutral",
    updates: [
      {
        title: "Market commentary",
        brief:
          "Broader market coverage remains mixed around the index’s large technology holdings.",
        signal: "Neutral",
        tone: "neutral",
      },
      {
        title: "AI sector momentum",
        brief:
          "Supportive AI news reaches VOO through its underlying technology holdings.",
        signal: "Somewhat bullish",
        tone: "positive",
      },
    ],
  },
]

// Fixture for the component library. Replace this object with validated backend output.
export const briefing: NewsBriefing = {
  recipient: "Prashanth",
  reportDate: "28 September 2026",
  hero: {
    eyebrow: "Today’s readout",
    dateline: "Monday 28 September 2026",
    marketSession: "US close",
    title:
      "Technology headlines dominate, with a material legal development for Apple.",
    summary:
      "Apple faces a significant new patent verdict, while Microsoft and NVIDIA continue to see constructive AI-related news. Overall news flow for Prashanth’s portfolio is mixed-to-positive, with Apple as the clearest new negative development.",
    sentiment: {
      headline: "Leaning positive",
      summary: "7 of 12 news signals are bullish",
      bearish: 2,
      neutral: 3,
      bullish: 7,
    },
  },
  holdings: stories,
  nextSignals: [
    {
      ticker: "AAPL",
      name: "Apple",
      signal:
        "Apple’s appeal and any clarification on financial or product implications.",
      whyItMatters:
        "Could clarify the verdict’s eventual cost and implications for Apple’s products.",
    },
    {
      ticker: "NVDA",
      name: "NVIDIA",
      signal:
        "Whether recent announcements translate into additional customer activity.",
      whyItMatters:
        "Would help show whether partnership momentum is turning into demand.",
    },
    {
      ticker: "MSFT",
      name: "Microsoft",
      signal: "Customer adoption signals following the latest Copilot updates.",
      whyItMatters:
        "Would help distinguish feature expansion from sustained customer use.",
    },
  ],
  portfolioWatch:
    "Watch broader market sentiment and regulatory developments around mega-cap technology, including VOO’s underlying holdings.",
  themes: [
    {
      id: "ai-ecosystem",
      title: "AI ecosystem",
      icon: "network",
      tickers: ["AAPL", "MSFT", "NVDA", "VOO"],
      developmentCount: 4,
      articleCount: 9,
      body: "One connected cycle: NVIDIA supplies the infrastructure, Microsoft turns it into products, and Apple competes in devices. VOO carries indirect exposure.",
      signal: "Mostly positive news flow",
      tone: "positive",
    },
    {
      id: "legal-regulatory",
      title: "Legal / regulatory",
      icon: "legal",
      tickers: ["AAPL", "VOO"],
      developmentCount: 2,
      articleCount: 4,
      body: "Direct legal exposure is concentrated in Apple; VOO participates indirectly through its index holdings. An easing antitrust concern only partly offsets the patent verdict.",
      signal: "Negative skew",
      tone: "negative",
    },
    {
      id: "mega-cap-positioning",
      title: "Mega-cap positioning",
      icon: "trend",
      tickers: ["AAPL", "MSFT", "NVDA", "VOO"],
      developmentCount: 3,
      articleCount: 6,
      body: "The same large technology names appear in both the direct holdings and VOO. Broad market headlines can therefore reach several positions at once.",
      signal: "Mixed news flow",
      tone: "neutral",
    },
  ],
  themeFootnote:
    "Holdings and themes can share articles; coverage counts overlap.",
  sources: [
    {
      id: "source-1",
      title:
        "US jury says Apple owes record $5.7 billion in haptic technology patent case",
      publisher: "Red Lake Nation News",
      publishedAt: "28 Sep 2026, 03:24",
      tone: "negative",
      signal: "Bearish",
    },
    {
      id: "source-2",
      title:
        "Jim Cramer: Apple, Microsoft, and Meta prove stock picking for individuals…",
      publisher: "CNBC",
      publishedAt: "27 Sep 2026, 23:21",
      tone: "positive",
      signal: "Somewhat bullish",
    },
    {
      id: "source-3",
      title: "Musk’s X Corp and SpaceXAI drop Apple from AI antitrust fight…",
      publisher: "Insider Monkey",
      publishedAt: "27 Sep 2026, 22:31",
      tone: "positive",
      signal: "Somewhat bullish",
    },
    {
      id: "source-4",
      title: "Apple removed from Musk’s antitrust lawsuit",
      publisher: "Yahoo Finance",
      publishedAt: "27 Sep 2026, 20:14",
      tone: "positive",
      signal: "Somewhat bullish",
    },
  ],
  articleCount: 17,
  referenceNote: "Static report · Reference content",
}
