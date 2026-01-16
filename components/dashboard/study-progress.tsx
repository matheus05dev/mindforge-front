"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  hours: {
    label: "Horas de Estudo",
    color: "var(--primary)",
  },
}

const studyData = [
  { day: "Seg", hours: 2.5 },
  { day: "Ter", hours: 3.2 },
  { day: "Qua", hours: 1.8 },
  { day: "Qui", hours: 4.0 },
  { day: "Sex", hours: 2.1 },
  { day: "Sáb", hours: 5.5 },
  { day: "Dom", hours: 3.8 },
]

export function StudyProgress() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Progresso de Estudos</h3>
          <p className="text-sm text-muted-foreground">Horas de estudo semanais</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">22.9h</p>
          <p className="text-xs text-green-500">+12% em relação à semana passada</p>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={studyData}>
          <XAxis dataKey="day" stroke="oklch(0.55 0.01 264)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="oklch(0.55 0.01 264)" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="hours" fill="oklch(0.59 0.24 293)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
