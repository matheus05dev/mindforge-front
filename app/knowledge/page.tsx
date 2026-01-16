import { AppShell } from "@/components/layout/app-shell"
import { KnowledgeSidebar } from "@/components/knowledge/knowledge-sidebar"
import { KnowledgeList } from "@/components/knowledge/knowledge-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function KnowledgePage() {
  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Sidebar with categories */}
        <KnowledgeSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Knowledge Base</h1>
              <p className="text-muted-foreground">Your personal wiki and notes collection.</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>

          {/* Notes List */}
          <KnowledgeList />
        </div>
      </div>
    </AppShell>
  )
}
