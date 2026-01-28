"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { studiesService } from "@/lib/api/services/studies.service"
import type { Subject } from "@/lib/api/types"

const chartConfig = {
  value: {
    label: "Nível",
    color: "var(--primary)",
  },
}

export function SkillsRadarChart() {
  const [skillsData, setSkillsData] = useState<{ skill: string; value: number; fullMark: number }[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const subjectsData = await studiesService.getAllSubjects({ size: 6, sort: ["id,desc"] })
        const data = subjectsData.content.map(subject => ({
          skill: subject.name,
          value: getProficiencyValue(subject.proficiencyLevel),
          fullMark: 100
        }))
        setSkillsData(data)
      } catch (error) {
        console.error("Failed to load skills data", error)
      }
    }
    loadData()
  }, [])

  function getProficiencyValue(level: string): number {
    switch (level) {
      case "BEGINNER": return 30
      case "INTERMEDIATE": return 60
      case "ADVANCED": return 100
      default: return 10
    }
  }

  if (skillsData.length === 0) {
     // Optional: Return helper text or empty state if no skills
     return (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Progresso de Skills</h3>
            <p className="text-sm text-muted-foreground">Cadastre matérias para visualizar o gráfico</p>
          </div>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
             Nenhuma skill cadastrada
          </div>
        </div>
     )
  }

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
