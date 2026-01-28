"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { StatsCard } from "@/components/dashboard/stats-card"
import { SkillsRadarChart } from "@/components/dashboard/skills-radar-chart"
import { RecentActivity, type Activity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { StudyProgress } from "@/components/dashboard/study-progress"
import { FolderKanban, CheckCircle2, Clock, BookOpen } from "lucide-react"
import { kanbanService } from "@/lib/api/services/kanban.service"
import { projectsService } from "@/lib/api/services/projects.service"
import { studiesService } from "@/lib/api/services/studies.service"
import type { KanbanTask, StudySession, KanbanColumn } from "@/lib/api/types"
import { Quote } from "lucide-react"

function InspirationalQuote() {
  const [quote, setQuote] = useState({ text: "", author: "" })

  const quotes = [
    { text: "A persistência é o caminho do êxito.", author: "Charles Chaplin" },
    { text: "O único lugar onde o sucesso vem antes do trabalho é no dicionário.", author: "Albert Einstein" },
    { text: "Acredite em si próprio e todo o resto virá naturalmente.", author: "Elon Musk" },
    { text: "O aprendizado é a única coisa que a mente nunca se cansa, nunca tem medo e nunca se arrepende.", author: "Leonardo da Vinci" },
    { text: "Saber não é o bastante; precisamos aplicar. Querer não é o bastante; precisamos fazer.", author: "Bruce Lee" },
    { text: "Codar é arte, o resto é debug.", author: "Desconhecido" },
    { text: "A melhor maneira de prever o futuro é inventá-lo.", author: "Alan Kay" },
    { text: "Programadores e artistas são os únicos profissionais que têm como hobby a própria profissão.", author: "Rafael Gomez" }
  ]

  useEffect(() => {
    // Pick random on mount (F5)
    const random = quotes[Math.floor(Math.random() * quotes.length)]
    setQuote(random)
  }, [])

  if (!quote.text) return null

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-4">
       <div className="bg-primary/10 p-3 rounded-full">
          <Quote className="h-6 w-6 text-primary" />
       </div>
       <div>
         <p className="text-lg font-medium italic">"{quote.text}"</p>
         <p className="text-sm text-muted-foreground mt-2">- {quote.author}</p>
       </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ 
    projects: 0, 
    subjects: 0,
    tasksCompleted: 0,
    studyHours: "0h",
    loading: true 
  })
  const [activities, setActivities] = useState<Activity[]>([])
  const [tasks, setTasks] = useState<KanbanTask[]>([])
  const [sessions, setSessions] = useState<StudySession[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch stats (using page size 1 to get totalElements where applicable)
        const [projectsData, subjectsData, kanbanBoard, sessionsData] = await Promise.all([
          projectsService.getAll({ size: 1, sort: ["id,desc"] }),
          studiesService.getAllSubjects({ size: 1, sort: ["id,desc"] }),
          kanbanService.getBoard(),
          studiesService.getAllSessions()
        ])

        // Process Kanban Board
        const allTasks = kanbanBoard.flatMap((col: KanbanColumn) => col.tasks || [])
        // Assuming the last column is "Done" or similar if we can't identify it by name
        // Or we can look for keywords like "Done", "Concluído", "Finalizado"
        const doneColumn = kanbanBoard.find((c: KanbanColumn) => /done|concluído|finalizado/i.test(c.name))
        const completedCount = doneColumn ? (doneColumn.tasks?.length || 0) : 0
        
        // Process Sessions for Total Hours (This Week)
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const recentSessions = sessionsData.filter((s: StudySession) => new Date(s.startTime) >= oneWeekAgo)
        const totalMinutes = recentSessions.reduce((acc: number, s: StudySession) => acc + s.durationMinutes, 0)
        const hours = (totalMinutes / 60).toFixed(1)

        setStats({
          projects: projectsData.totalElements,
          subjects: subjectsData.totalElements,
          tasksCompleted: completedCount,
          studyHours: `${hours}h`,
          loading: false
        })

        setTasks(allTasks)
        setSessions(sessionsData)

        // Map recent items to activity feed
        // Simulating robust feed by taking latest project and subject
        const recentActivities: Activity[] = []
        
        if (projectsData.content.length > 0) {
           const p = projectsData.content[0]
           recentActivities.push({
             id: `proj-${p.id}`,
             type: "project",
             title: p.name,
             description: p.description || "Novo projeto criado",
             time: "Recente" 
           })
        }

        if (subjectsData.content.length > 0) {
           const s = subjectsData.content[0]
           recentActivities.push({
             id: `subj-${s.id}`,
             type: "study",
             title: s.name,
             description: `Nível: ${s.proficiencyLevel}`,
             time: "Recente"
           })
        }
        
        setActivities(recentActivities)

      } catch (error) {
        console.error("Failed to load dashboard data", error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }
    loadData()
  }, [])

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho da Página */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o resumo da sua atividade.</p>
        </div>

        {/* Grid de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Projetos Ativos"
            value={stats.projects}
            icon={FolderKanban}
            color="violet"
          />
          <StatsCard
            title="Tarefas Concluídas"
            value={stats.tasksCompleted}
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard title="Horas de Estudo" value={stats.studyHours} icon={Clock} color="blue" description="Últimos 7 dias" />
          <StatsCard
            title="Matérias de Estudo"
            value={stats.subjects}
            icon={BookOpen}
            color="amber"
          />
        </div>

        {/* Layout Bento Grid */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Coluna Esquerda - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <StudyProgress sessions={sessions} />
            <UpcomingTasks tasks={tasks} />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-4">
            <QuickActions />
            <RecentActivity activities={activities} />
          </div>
        </div>

        {/* Radar de Skills - Largura Total */}
        <div className="grid gap-4 lg:grid-cols-2">
          <SkillsRadarChart />
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Frase do Dia</h3>
            <div className="space-y-4 h-full flex items-center justify-center">
               <InspirationalQuote />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
