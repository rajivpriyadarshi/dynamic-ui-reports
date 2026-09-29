import Link from "next/link"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CATEGORIES = [
  { slug: "area", label: "Area Chart", count: 10 },
  { slug: "bar", label: "Bar Chart", count: 10 },
  { slug: "line", label: "Line Chart", count: 10 },
  { slug: "pie", label: "Pie Chart", count: 11 },
  { slug: "radar", label: "Radar Chart", count: 12 },
  { slug: "radial", label: "Radial Chart", count: 6 },
  { slug: "tooltip", label: "Tooltip", count: 9 },
]

export default function ChartsIndexPage() {
  const total = CATEGORIES.reduce((sum, c) => sum + c.count, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Charts</h1>
        <p className="text-muted-foreground text-sm">
          {total} chart examples across {CATEGORIES.length} categories, built
          with Recharts and the shadcn chart primitives.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Link key={category.slug} href={`/charts/${category.slug}`}>
            <Card className="hover:border-primary/40 h-full transition-colors">
              <CardHeader>
                <CardTitle>{category.label}</CardTitle>
                <CardDescription>{category.count} examples</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
