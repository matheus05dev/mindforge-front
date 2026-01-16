import { AppShell } from "@/components/layout/app-shell"
import { StudiesList } from "@/components/studies/studies-list"
import { StudiesOverview } from "@/components/studies/studies-overview"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EstudosPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Estudos</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso de aprendizado e sessões de estudo.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Assunto
          </Button>
        </div>

        {/* Overview Section */}
        <StudiesOverview />

        {/* Studies List */}
        <StudiesList />
      </div>
    </AppShell>
  )
}

