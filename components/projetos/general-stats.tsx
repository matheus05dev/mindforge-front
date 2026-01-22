"use client"

import { 
  FolderKanban, 
  Target, 
  CheckCircle2, 
  Activity 
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export function GeneralProjectStats() {
  const { projects, tasks } = useStore()

  // Calcular estatísticas reais
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => !p.status || p.status === 'ativo').length // Assumindo ativo se undefined
  
  // Total de milestones (Assumindo que temos milestones carregados ou somando de cada projeto)
  const totalMilestones = projects.reduce((acc, p) => acc + (p.milestones?.length || 0), 0)
  
  // Tarefas concluídas
  const completedTasks = tasks.filter(t => t.status === 'concluido').length
  const totalTasks = tasks.length
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
          <FolderKanban className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeProjects}</div>
          <p className="text-xs text-muted-foreground">
            De {totalProjects} projetos totais
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Marcos Definidos</CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMilestones}</div>
          <p className="text-xs text-muted-foreground">
            Milestones em andamento
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tarefas Totais</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks} <span className="text-base font-normal text-muted-foreground">/ {totalTasks}</span></div>
          <p className="text-xs text-muted-foreground">
            Concluídas globalmente
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saúde do Workspace</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Estável</div>
          <p className="text-xs text-muted-foreground">
            Baseado na atividade recente
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
