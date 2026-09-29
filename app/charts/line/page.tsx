import { ChartLineDefault } from "@/components/charts/chart-line-default"
import { ChartLineDots } from "@/components/charts/chart-line-dots"
import { ChartLineDotsColors } from "@/components/charts/chart-line-dots-colors"
import { ChartLineDotsCustom } from "@/components/charts/chart-line-dots-custom"
import { ChartLineInteractive } from "@/components/charts/chart-line-interactive"
import { ChartLineLabel } from "@/components/charts/chart-line-label"
import { ChartLineLabelCustom } from "@/components/charts/chart-line-label-custom"
import { ChartLineLinear } from "@/components/charts/chart-line-linear"
import { ChartLineMultiple } from "@/components/charts/chart-line-multiple"
import { ChartLineStep } from "@/components/charts/chart-line-step"

export default function LineChartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Line Chart</h1>
        <p className="text-muted-foreground text-sm">
          10 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">default</p>
          <ChartLineDefault />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">dots</p>
          <ChartLineDots />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">dots colors</p>
          <ChartLineDotsColors />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">dots custom</p>
          <ChartLineDotsCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">interactive</p>
          <ChartLineInteractive />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label</p>
          <ChartLineLabel />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label custom</p>
          <ChartLineLabelCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">linear</p>
          <ChartLineLinear />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">multiple</p>
          <ChartLineMultiple />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">step</p>
          <ChartLineStep />
        </div>
      </div>
    </div>
  )
}
