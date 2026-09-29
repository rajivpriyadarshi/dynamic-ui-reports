import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const CATEGORIES = [
  { slug: "area", label: "Area" },
  { slug: "bar", label: "Bar" },
  { slug: "line", label: "Line" },
  { slug: "pie", label: "Pie" },
  { slug: "radar", label: "Radar" },
  { slug: "radial", label: "Radial" },
  { slug: "tooltip", label: "Tooltip" },
]

export default function ChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
      <nav className="flex flex-wrap items-center gap-2">
        <Link href="/" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Home
        </Link>
        <Separator orientation="vertical" className="h-5" />
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/charts/${category.slug}`}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {category.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  )
}
