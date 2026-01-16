import { AppShell } from "@/components/layout/app-shell"
import { DocumentsList } from "@/components/documents/documents-list"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

export default function DocumentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documentos</h1>
            <p className="text-muted-foreground">Gerencie seus arquivos e documentos.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Documento
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <DocumentsList />
      </div>
    </AppShell>
  )
}

