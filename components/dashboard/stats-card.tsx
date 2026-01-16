import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: "violet" | "green" | "blue" | "amber" | "red"
}

const colorClasses = {
  violet: "bg-primary/10 text-primary",
  green: "bg-green-500/10 text-green-500",
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
  red: "bg-red-500/10 text-red-500",
}

const dotColors = {
  violet: "bg-primary",
  green: "bg-green-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
}

export function StatsCard({ title, value, description, icon: Icon, trend, color = "violet" }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", dotColors[color])} />
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <div className={cn("rounded-md p-2", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {trend && (
          <p className={cn("mt-1 text-xs", trend.isPositive ? "text-green-500" : "text-red-500")}>
            {trend.isPositive ? "+" : "-"}
            {Math.abs(trend.value)}% em relação à semana passada
          </p>
        )}
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
