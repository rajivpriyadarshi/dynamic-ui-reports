import { ChartRadialGrid } from "@/components/charts/chart-radial-grid"
import { ChartRadialLabel } from "@/components/charts/chart-radial-label"
import { ChartRadialShape } from "@/components/charts/chart-radial-shape"
import { ChartRadialSimple } from "@/components/charts/chart-radial-simple"
import { ChartRadialStacked } from "@/components/charts/chart-radial-stacked"
import { ChartRadialText } from "@/components/charts/chart-radial-text"

export default function RadialChartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Radial Chart</h1>
        <p className="text-muted-foreground text-sm">
          6 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid</p>
          <ChartRadialGrid />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label</p>
          <ChartRadialLabel />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">shape</p>
          <ChartRadialShape />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">simple</p>
          <ChartRadialSimple />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">stacked</p>
          <ChartRadialStacked />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">text</p>
          <ChartRadialText />
        </div>
      </div>
    </div>
  )
}
