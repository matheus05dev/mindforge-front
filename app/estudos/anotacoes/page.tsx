import { AppShell } from "@/components/layout/app-shell"
import { StudiesNotes } from "@/components/studies/studies-notes"

export default function AnotacoesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Anotações de Estudo</h1>
          <p className="text-muted-foreground">Suas anotações e notas de estudo organizadas por assunto.</p>
        </div>

        <StudiesNotes />
      </div>
    </AppShell>
  )
}

