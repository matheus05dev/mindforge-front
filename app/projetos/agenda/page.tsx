import { AppShell } from "@/components/layout/app-shell"
import { ProjectsCalendar } from "@/components/projetos/projects-calendar"

export default function ProjetosAgendaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda de Compromissos</h1>
          <p className="text-muted-foreground">Acompanhe entregas, reuniões e marcos dos projetos.</p>
        </div>

        <ProjectsCalendar />
      </div>
    </AppShell>
  )
}

