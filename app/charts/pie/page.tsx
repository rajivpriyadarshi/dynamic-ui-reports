import { ChartPieDonut } from "@/components/charts/chart-pie-donut"
import { ChartPieDonutActive } from "@/components/charts/chart-pie-donut-active"
import { ChartPieDonutText } from "@/components/charts/chart-pie-donut-text"
import { ChartPieInteractive } from "@/components/charts/chart-pie-interactive"
import { ChartPieLabel } from "@/components/charts/chart-pie-label"
import { ChartPieLabelCustom } from "@/components/charts/chart-pie-label-custom"
import { ChartPieLabelList } from "@/components/charts/chart-pie-label-list"
import { ChartPieLegend } from "@/components/charts/chart-pie-legend"
import { ChartPieSeparatorNone } from "@/components/charts/chart-pie-separator-none"
import { ChartPieSimple } from "@/components/charts/chart-pie-simple"
import { ChartPieStacked } from "@/components/charts/chart-pie-stacked"

export default function PieChartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Pie Chart</h1>
        <p className="text-muted-foreground text-sm">
          11 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">donut</p>
          <ChartPieDonut />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">donut active</p>
          <ChartPieDonutActive />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">donut text</p>
          <ChartPieDonutText />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">interactive</p>
          <ChartPieInteractive />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label</p>
          <ChartPieLabel />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label custom</p>
          <ChartPieLabelCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label list</p>
          <ChartPieLabelList />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">legend</p>
          <ChartPieLegend />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">separator none</p>
          <ChartPieSeparatorNone />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">simple</p>
          <ChartPieSimple />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">stacked</p>
          <ChartPieStacked />
        </div>
      </div>
    </div>
  )
}
