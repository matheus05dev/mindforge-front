"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { useStore } from "@/lib/store"
import { knowledgeService } from "@/lib/api"
import { KnowledgeSidebar } from "@/components/knowledge/knowledge-sidebar"
import { KnowledgeList } from "@/components/knowledge/knowledge-list"
import { KnowledgeEditor } from "@/components/knowledge/knowledge-editor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const { setKnowledgeItems, isAgentMode } = useStore()

  useEffect(() => {
    const fetchKnowledge = async () => {
      try {
        const items = await knowledgeService.getAll()
        // Convert API types to Frontend types
        const mappedItems = items.map((item) => ({
          id: String(item.id),
          workspaceId: item.workspaceId ? String(item.workspaceId) : "1", // Fallback para Geral (1)
          title: item.title,
          content: item.content,
          tags: item.tags,
          category: "Geral", // Default category or derive from tags
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
        setKnowledgeItems(mappedItems)
      } catch (error) {
        console.error("Failed to fetch knowledge items:", error)
      }
    }
    fetchKnowledge()
  }, [setKnowledgeItems])

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Sidebar with categories */}
        <KnowledgeSidebar
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectItem={setEditingItem}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{isAgentMode ? "Memória do Agente" : "Base de Conhecimento"}</h1>
              <p className="text-muted-foreground">{isAgentMode ? "Gerencie a memória e contexto do agente IA." : "Sua wiki pessoal e coleção de notas."}</p>
            </div>
            <Button className="gap-2" onClick={() => {
              setIsCreating(true)
              setEditingItem(null)
            }}>
              <Plus className="h-4 w-4" />
              Nova Nota
            </Button>
          </div>

          {/* Notes List */}
          {isCreating || editingItem ? (
            <KnowledgeEditor 
              item={editingItem} 
              onClose={() => {
                setIsCreating(false)
                setEditingItem(null)
              }} 
            />
          ) : (
            <KnowledgeList 
              selectedCategory={selectedCategory} 
              searchQuery={searchQuery} 
              onSelectItem={setEditingItem}
            />
          )}
        </div>
      </div>
    </AppShell>
  )
}
