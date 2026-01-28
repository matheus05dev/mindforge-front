"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

import { StudySession } from "@/lib/api/types"

const chartConfig = {
  hours: {
    label: "Horas de Estudo",
    color: "var(--primary)",
  },
}

export function StudyProgress({ sessions = [] }: { sessions?: StudySession[] }) {
  const [data, setData] = useState<{ day: string; hours: number }[]>([])
  const [totalHours, setTotalHours] = useState(0)

  useEffect(() => {
     // Processar dados dos últimos 7 dias
     const last7Days = Array.from({ length: 7 }, (_, i) => {
       const d = new Date()
       d.setDate(d.getDate() - (6 - i))
       return d
     })

     const chartData = last7Days.map(date => {
        const dayStr = date.toLocaleDateString("pt-BR", { weekday: "short" })
        const dayKey = date.toISOString().split('T')[0] 
        
        let minutes = 0
        sessions.forEach((session: StudySession) => {
           // Assuming startTime is ISO string
           if (session.startTime.startsWith(dayKey)) {
              minutes += session.durationMinutes
           }
        })

        return { day: dayStr.charAt(0).toUpperCase() + dayStr.slice(1), hours: Number((minutes / 60).toFixed(1)) }
     })

     setData(chartData)
     
     // Total hours
     const totalMinutes = sessions.reduce((acc: number, sess: StudySession) => acc + sess.durationMinutes, 0)
     setTotalHours(Number((totalMinutes / 60).toFixed(1)))
  }, [sessions])

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Progresso de Estudos</h3>
          <p className="text-sm text-muted-foreground">Horas de estudo (Últimos 7 dias)</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{totalHours}h</p>
          <p className="text-xs text-muted-foreground">Total Acumulado</p>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <BarChart data={data}>
          <XAxis dataKey="day" stroke="oklch(0.55 0.01 264)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="oklch(0.55 0.01 264)" fontSize={12} tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="hours" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
