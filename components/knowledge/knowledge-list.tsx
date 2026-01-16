"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { KnowledgeCard } from "./knowledge-card"
import { KnowledgeEditor } from "./knowledge-editor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, LayoutGrid, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { KnowledgeItem } from "@/lib/types"

export function KnowledgeList() {
  const { knowledge } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)

  const filteredItems = knowledge.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  if (selectedItem) {
    return <KnowledgeEditor item={selectedItem} onClose={() => setSelectedItem(null)} />
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Barra de Busca */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="grid" className="px-2">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-2">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid/Lista de Itens */}
      <div className="flex-1 overflow-auto">
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <KnowledgeCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <KnowledgeCard key={item.id} item={item} variant="list" onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
