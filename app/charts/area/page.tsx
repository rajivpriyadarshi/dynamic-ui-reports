import { ChartAreaAxes } from "@/components/charts/chart-area-axes"
import { ChartAreaDefault } from "@/components/charts/chart-area-default"
import { ChartAreaGradient } from "@/components/charts/chart-area-gradient"
import { ChartAreaIcons } from "@/components/charts/chart-area-icons"
import { ChartAreaInteractive } from "@/components/charts/chart-area-interactive"
import { ChartAreaLegend } from "@/components/charts/chart-area-legend"
import { ChartAreaLinear } from "@/components/charts/chart-area-linear"
import { ChartAreaStacked } from "@/components/charts/chart-area-stacked"
import { ChartAreaStackedExpand } from "@/components/charts/chart-area-stacked-expand"
import { ChartAreaStep } from "@/components/charts/chart-area-step"

export default function AreaChartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Area Chart</h1>
        <p className="text-muted-foreground text-sm">
          10 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">axes</p>
          <ChartAreaAxes />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">default</p>
          <ChartAreaDefault />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">gradient</p>
          <ChartAreaGradient />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">icons</p>
          <ChartAreaIcons />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">interactive</p>
          <ChartAreaInteractive />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">legend</p>
          <ChartAreaLegend />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">linear</p>
          <ChartAreaLinear />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">stacked</p>
          <ChartAreaStacked />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">stacked expand</p>
          <ChartAreaStackedExpand />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">step</p>
          <ChartAreaStep />
        </div>
      </div>
    </div>
  )
}
