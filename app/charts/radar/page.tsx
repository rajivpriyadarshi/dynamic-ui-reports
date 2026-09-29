import { ChartRadarDefault } from "@/components/charts/chart-radar-default"
import { ChartRadarDots } from "@/components/charts/chart-radar-dots"
import { ChartRadarGridCircle } from "@/components/charts/chart-radar-grid-circle"
import { ChartRadarGridCircleFill } from "@/components/charts/chart-radar-grid-circle-fill"
import { ChartRadarGridCircleNoLines } from "@/components/charts/chart-radar-grid-circle-no-lines"
import { ChartRadarGridCustom } from "@/components/charts/chart-radar-grid-custom"
import { ChartRadarGridFill } from "@/components/charts/chart-radar-grid-fill"
import { ChartRadarGridNone } from "@/components/charts/chart-radar-grid-none"
import { ChartRadarLabelCustom } from "@/components/charts/chart-radar-label-custom"
import { ChartRadarLegend } from "@/components/charts/chart-radar-legend"
import { ChartRadarLinesOnly } from "@/components/charts/chart-radar-lines-only"
import { ChartRadarMultiple } from "@/components/charts/chart-radar-multiple"

export default function RadarChartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Radar Chart</h1>
        <p className="text-muted-foreground text-sm">
          12 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">default</p>
          <ChartRadarDefault />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">dots</p>
          <ChartRadarDots />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid circle</p>
          <ChartRadarGridCircle />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid circle fill</p>
          <ChartRadarGridCircleFill />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid circle no lines</p>
          <ChartRadarGridCircleNoLines />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid custom</p>
          <ChartRadarGridCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid fill</p>
          <ChartRadarGridFill />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">grid none</p>
          <ChartRadarGridNone />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label custom</p>
          <ChartRadarLabelCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">legend</p>
          <ChartRadarLegend />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">lines only</p>
          <ChartRadarLinesOnly />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">multiple</p>
          <ChartRadarMultiple />
        </div>
      </div>
    </div>
  )
}
