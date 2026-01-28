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
import { projectsService } from "@/lib/api/services/projects.service"
import { studiesService } from "@/lib/api/services/studies.service"

export default function DashboardPage() {
  const [stats, setStats] = useState({ 
    projects: 0, 
    subjects: 0,
    loading: true 
  })
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch stats (using page size 1 to get totalElements)
        const [projectsData, subjectsData] = await Promise.all([
          projectsService.getAll({ size: 1, sort: ["id,desc"] }),
          studiesService.getAllSubjects({ size: 1, sort: ["id,desc"] })
        ])

        setStats({
          projects: projectsData.totalElements,
          subjects: subjectsData.totalElements,
          loading: false
        })

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
             time: "Recente" // Backend Summary DTO doesn't have date yet, use placeholder or fetch detail? Detail is expensive.
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
            value={0} // TODO: Implement task service
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard title="Horas de Estudo" value="0h" icon={Clock} color="blue" description="Esta semana" />
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
            <StudyProgress />
            <UpcomingTasks />
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
            <h3 className="font-semibold mb-4">Insights da IA</h3>
            <div className="space-y-4">
              <div className="rounded-md bg-muted/30 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum insight disponível no momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
