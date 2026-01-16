"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { KnowledgeSidebar } from "@/components/knowledge/knowledge-sidebar"
import { KnowledgeList } from "@/components/knowledge/knowledge-list"
import { KnowledgeEditor } from "@/components/knowledge/knowledge-editor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Sidebar with categories */}
        <KnowledgeSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Base de Conhecimento</h1>
              <p className="text-muted-foreground">Sua wiki pessoal e coleção de notas.</p>
            </div>
            <Button className="gap-2" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" />
              Nova Nota
            </Button>
          </div>

          {/* Notes List */}
          {isCreating ? (
            <KnowledgeEditor onClose={() => setIsCreating(false)} />
          ) : (
            <KnowledgeList selectedCategory={selectedCategory} searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </AppShell>
  )
}
