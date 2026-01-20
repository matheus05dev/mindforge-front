"use client"

import { AppShell } from "@/components/layout/app-shell"
import { StatsCard } from "@/components/dashboard/stats-card"
import { SkillsRadarChart } from "@/components/dashboard/skills-radar-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { StudyProgress } from "@/components/dashboard/study-progress"
import { FolderKanban, CheckCircle2, Clock, BookOpen } from "lucide-react"

export default function DashboardPage() {
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
            value={0}
            icon={FolderKanban}
            color="violet"
          />
          <StatsCard
            title="Tarefas Concluídas"
            value={0}
            icon={CheckCircle2}
            color="green"
          />
          <StatsCard title="Horas de Estudo" value="0h" icon={Clock} color="blue" description="Esta semana" />
          <StatsCard
            title="Itens de Conhecimento"
            value={0}
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
            <RecentActivity />
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
