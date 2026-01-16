"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const skillsData = [
  { skill: "TypeScript", value: 18, fullMark: 20 },
  { skill: "React", value: 16, fullMark: 20 },
  { skill: "Node.js", value: 14, fullMark: 20 },
  { skill: "Python", value: 12, fullMark: 20 },
  { skill: "SQL", value: 15, fullMark: 20 },
  { skill: "DevOps", value: 10, fullMark: 20 },
  { skill: "System Design", value: 13, fullMark: 20 },
  { skill: "Estrutura de Dados", value: 17, fullMark: 20 },
]

const chartConfig = {
  value: {
    label: "Nível",
    color: "var(--primary)",
  },
}

export function SkillsRadarChart() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Progresso de Skills</h3>
        <p className="text-sm text-muted-foreground">Seus níveis de habilidade</p>
      </div>
      <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[300px]">
        <RadarChart data={skillsData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="skill" tick={{ fill: "oklch(0.55 0.01 264)", fontSize: 11 }} tickLine={false} />
          <PolarGrid stroke="oklch(0.18 0 0)" />
          <Radar
            name="Nível"
            dataKey="value"
            stroke="oklch(0.59 0.24 293)"
            fill="oklch(0.59 0.24 293)"
            fillOpacity={0.4}
            strokeWidth={2}
          />
        </RadarChart>
      </ChartContainer>
    </div>
  )
}
