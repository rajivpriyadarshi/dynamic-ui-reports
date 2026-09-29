import { ChartBarActive } from "@/components/charts/chart-bar-active"
import { ChartBarDefault } from "@/components/charts/chart-bar-default"
import { ChartBarHorizontal } from "@/components/charts/chart-bar-horizontal"
import { ChartBarInteractive } from "@/components/charts/chart-bar-interactive"
import { ChartBarLabel } from "@/components/charts/chart-bar-label"
import { ChartBarLabelCustom } from "@/components/charts/chart-bar-label-custom"
import { ChartBarMixed } from "@/components/charts/chart-bar-mixed"
import { ChartBarMultiple } from "@/components/charts/chart-bar-multiple"
import { ChartBarNegative } from "@/components/charts/chart-bar-negative"
import { ChartBarStacked } from "@/components/charts/chart-bar-stacked"

export default function BarChartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Bar Chart</h1>
        <p className="text-muted-foreground text-sm">
          10 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">active</p>
          <ChartBarActive />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">default</p>
          <ChartBarDefault />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">horizontal</p>
          <ChartBarHorizontal />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">interactive</p>
          <ChartBarInteractive />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label</p>
          <ChartBarLabel />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label custom</p>
          <ChartBarLabelCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">mixed</p>
          <ChartBarMixed />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">multiple</p>
          <ChartBarMultiple />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">negative</p>
          <ChartBarNegative />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">stacked</p>
          <ChartBarStacked />
        </div>
      </div>
    </div>
  )
}
