import { AppShell } from "@/components/layout/app-shell"
import { StudiesCalendar } from "@/components/studies/studies-calendar"

export default function AgendaPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agenda de Estudos</h1>
          <p className="text-muted-foreground">Planeje e acompanhe suas sessões de estudo.</p>
        </div>

        <StudiesCalendar />
      </div>
    </AppShell>
  )
}

