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
            value={3}
            icon={FolderKanban}
            color="violet"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Tarefas Concluídas"
            value={48}
            icon={CheckCircle2}
            color="green"
            trend={{ value: 15, isPositive: true }}
          />
          <StatsCard title="Horas de Estudo" value="24h" icon={Clock} color="blue" description="Esta semana" />
          <StatsCard
            title="Itens de Conhecimento"
            value={6}
            icon={BookOpen}
            color="amber"
            trend={{ value: 5, isPositive: true }}
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
              <div className="rounded-md bg-primary/5 border border-primary/20 p-4">
                <p className="text-sm text-muted-foreground">
                  Com base na sua atividade recente, você pode focar em habilidades de{" "}
                  <span className="text-primary font-medium">DevOps</span>. Considere começar com fundamentos de Docker.
                </p>
              </div>
              <div className="rounded-md bg-amber-500/5 border border-amber-500/20 p-4">
                <p className="text-sm text-muted-foreground">
                  Você tem <span className="text-amber-500 font-medium">3 tarefas atrasadas</span> no projeto API
                  Backend. Quer que eu ajude a priorizá-las?
                </p>
              </div>
              <div className="rounded-md bg-green-500/5 border border-green-500/20 p-4">
                <p className="text-sm text-muted-foreground">
                  Ótimo progresso! Você aumentou suas horas de estudo em{" "}
                  <span className="text-green-500 font-medium">12%</span> esta semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
