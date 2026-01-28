"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Clock, Target, TrendingUp, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { studiesService } from "@/lib/api/services/studies.service"
import { StudySession, Subject } from "@/lib/api/types"

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

export function StudiesOverview({ refetchTrigger }: { refetchTrigger?: number }) {
  const [stats, setStats] = useState({
    totalHours: 0,
    activeStudies: 0,
    avgProgress: 0,
    completedStudies: 0
  })
  
  const [categoryProgress, setCategoryProgress] = useState<{ category: string; progress: number }[]>([])
  const [weeklyStudyData, setWeeklyStudyData] = useState<{ week: string; hours: number }[]>([])

  useEffect(() => {
     async function loadData() {
        try {
           // Fetch Sessions
           let sessions: StudySession[] = [];
           try {
             const sessionData = await studiesService.getAllSessions();
             if (Array.isArray(sessionData)) {
                sessions = sessionData;
             } else {
                // @ts-ignore
                if (sessionData && sessionData.content) sessions = sessionData.content;
             }
           } catch (e) {
             console.error("Failed to fetch sessions", e);
           }

           // Fetch Subjects
           let subjects: Subject[] = [];
           try {
             const subjectsData = await studiesService.getAllSubjects({ size: 100 });
             subjects = subjectsData.content;
           } catch (e) {
             console.error("Failed to fetch subjects", e);
           }

           // Calculate Total Hours
           const totalMinutes = sessions.reduce((acc, s) => acc + Number(s.durationMinutes || 0), 0)
           const totalHours = Number((totalMinutes / 60).toFixed(1))

           // Active Studies - Consider generic "actives" as all subjects for now
           const activeStudies = subjects.length

           // Calculate Progress
           // Mapping strategy pending real backend support, using proficiency for now
           const getProgress = (level: string) => {
              if (level === "BEGINNER") return 30
              if (level === "INTERMEDIATE") return 60
              if (level === "ADVANCED") return 90
              return 0
           }
           
           const avgProgress = subjects.length > 0 
              ? Math.round(subjects.reduce((acc, s) => acc + getProgress(s.proficiencyLevel), 0) / subjects.length)
              : 0

           const completedStudies = subjects.filter(s => s.proficiencyLevel === "ADVANCED").length

           setStats({
              totalHours,
              activeStudies,
              avgProgress,
              completedStudies
           })

           // Radar Data
           const radarData = subjects.slice(0, 6).map(s => ({
              category: s.name,
              progress: getProgress(s.proficiencyLevel)
           }))
           setCategoryProgress(radarData)

           // Weekly Data (Last 7 days daily trend)
           const last7Days = Array.from({ length: 7 }, (_, i) => {
             const d = new Date()
             d.setDate(d.getDate() - (6 - i))
             return d
           })

           const chartData = last7Days.map(date => {
              const dayStr = date.toLocaleDateString("pt-BR", { weekday: "short" })
              // Improved date matching: robust against T-zoning issues if strings match YYYY-MM-DD
              const dayKey = date.toISOString().split('T')[0] 
              
              let minutes = 0
              sessions.forEach(session => {
                 // Try to match YYYY-MM-DD part
                 // If session.startTime is ISO (2023-10-27T...), this works
                 if (session.startTime && session.startTime.startsWith(dayKey)) {
                    minutes += Number(session.durationMinutes || 0)
                 }
              })

              return { week: dayStr.charAt(0).toUpperCase() + dayStr.slice(1), hours: Number((minutes / 60).toFixed(1)) }
           })
           
           setWeeklyStudyData(chartData)

        } catch (error) {
           console.error("Failed to fetch studies overview", error)
        }
     }
     loadData()
  }, [refetchTrigger])


  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* Cards de Estatísticas */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.totalHours}h</p>
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
            <p className="text-2xl font-semibold">{stats.activeStudies}</p>
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
            <p className="text-2xl font-semibold">{stats.avgProgress}%</p>
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
            <p className="text-2xl font-semibold">{stats.completedStudies}</p>
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
