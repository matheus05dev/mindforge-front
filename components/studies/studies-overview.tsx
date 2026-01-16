"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useStore } from "@/lib/store"
import { Clock, Target, TrendingUp, BookOpen } from "lucide-react"

const categoryProgress = [
  { category: "Programação", progress: 75 },
  { category: "Arquitetura", progress: 45 },
  { category: "DevOps", progress: 30 },
  { category: "Frontend", progress: 90 },
  { category: "Database", progress: 60 },
  { category: "Backend", progress: 20 },
]

const weeklyStudyData = [
  { week: "Sem 1", hours: 12 },
  { week: "Sem 2", hours: 18 },
  { week: "Sem 3", hours: 15 },
  { week: "Sem 4", hours: 22 },
  { week: "Sem 5", hours: 20 },
  { week: "Sem 6", hours: 25 },
]

const radarConfig = {
  progress: {
    label: "Progresso",
    color: "var(--primary)",
  },
}

const lineConfig = {
  hours: {
    label: "Horas",
    color: "var(--primary)",
  },
}

export function StudiesOverview() {
  const { studies } = useStore()

  const totalHours = studies.reduce((acc, study) => acc + study.completedHours, 0)
  const totalStudies = studies.length
  const avgProgress =
    totalStudies > 0 ? Math.round(studies.reduce((acc, study) => acc + study.progress, 0) / totalStudies) : 0
  const completedStudies = studies.filter((s) => s.progress >= 90).length

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* Cards de Estatísticas */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{totalHours.toFixed(1)}h</p>
            <p className="text-sm text-muted-foreground">Tempo Total de Estudo</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-blue-500/10 p-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{totalStudies}</p>
            <p className="text-sm text-muted-foreground">Estudos Ativos</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-amber-500/10 p-2">
            <Target className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{avgProgress}%</p>
            <p className="text-sm text-muted-foreground">Progresso Médio</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-green-500/10 p-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{completedStudies}</p>
            <p className="text-sm text-muted-foreground">Quase Concluídos</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
        <div className="mb-4">
          <h3 className="font-semibold">Progresso por Categoria</h3>
          <p className="text-sm text-muted-foreground">Seu progresso em diferentes áreas</p>
        </div>
        <ChartContainer config={radarConfig} className="mx-auto aspect-square h-[250px]">
          <RadarChart data={categoryProgress}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" tick={{ fill: "oklch(0.55 0.01 264)", fontSize: 11 }} tickLine={false} />
            <PolarGrid stroke="oklch(0.18 0 0)" />
            <Radar
              name="Progresso"
              dataKey="progress"
              stroke="oklch(0.59 0.24 293)"
              fill="oklch(0.59 0.24 293)"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </div>

      <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
        <div className="mb-4">
          <h3 className="font-semibold">Tendência Semanal de Estudo</h3>
          <p className="text-sm text-muted-foreground">Horas estudadas por semana</p>
        </div>
        <ChartContainer config={lineConfig} className="h-[250px] w-full">
          <LineChart data={weeklyStudyData}>
            <XAxis dataKey="week" stroke="oklch(0.55 0.01 264)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.55 0.01 264)" fontSize={12} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="oklch(0.59 0.24 293)"
              strokeWidth={2}
              dot={{ fill: "oklch(0.59 0.24 293)", strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}
