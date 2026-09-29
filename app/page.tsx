import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          shadcn-app
        </h1>
        <p className="text-muted-foreground text-sm">
          Next.js + shadcn/ui, preset{" "}
          <span className="font-mono">b6sByO3Bi</span> — style{" "}
          <span className="font-mono">base-vega</span>, olive theme, Inter,
          lucide icons.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/components" className={buttonVariants()}>
          Components
        </Link>
        <Link href="/charts" className={buttonVariants({ variant: "outline" })}>
          Charts
        </Link>
      </div>

      <p className="text-muted-foreground font-mono text-xs">
        (Press <kbd>d</kbd> to toggle dark mode)
      </p>
    </div>
  )
}
