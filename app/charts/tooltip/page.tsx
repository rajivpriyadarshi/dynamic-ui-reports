import { ChartTooltipAdvanced } from "@/components/charts/chart-tooltip-advanced"
import { ChartTooltipDefault } from "@/components/charts/chart-tooltip-default"
import { ChartTooltipFormatter } from "@/components/charts/chart-tooltip-formatter"
import { ChartTooltipIcons } from "@/components/charts/chart-tooltip-icons"
import { ChartTooltipIndicatorLine } from "@/components/charts/chart-tooltip-indicator-line"
import { ChartTooltipIndicatorNone } from "@/components/charts/chart-tooltip-indicator-none"
import { ChartTooltipLabelCustom } from "@/components/charts/chart-tooltip-label-custom"
import { ChartTooltipLabelFormatter } from "@/components/charts/chart-tooltip-label-formatter"
import { ChartTooltipLabelNone } from "@/components/charts/chart-tooltip-label-none"

export default function TooltipsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Tooltip</h1>
        <p className="text-muted-foreground text-sm">
          9 examples.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">advanced</p>
          <ChartTooltipAdvanced />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">default</p>
          <ChartTooltipDefault />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">formatter</p>
          <ChartTooltipFormatter />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">icons</p>
          <ChartTooltipIcons />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">indicator line</p>
          <ChartTooltipIndicatorLine />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">indicator none</p>
          <ChartTooltipIndicatorNone />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label custom</p>
          <ChartTooltipLabelCustom />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label formatter</p>
          <ChartTooltipLabelFormatter />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground font-mono text-xs">label none</p>
          <ChartTooltipLabelNone />
        </div>
      </div>
    </div>
  )
}
