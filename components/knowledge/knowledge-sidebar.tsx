"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FolderOpen,
  Hash,
  Search,
  ChevronRight,
  Code,
  Server,
  Database,
  Layout,
  Boxes,
  Wrench,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categoryIcons: Record<string, typeof Code> = {
  Programação: Code,
  DevOps: Server,
  Database: Database,
  Frontend: Layout,
  Arquitetura: Boxes,
  Ferramentas: Wrench,
}

interface KnowledgeSidebarProps {
  selectedCategory?: string | null
  onCategoryChange?: (category: string | null) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function KnowledgeSidebar({
  selectedCategory: externalSelectedCategory,
  onCategoryChange,
  searchQuery: externalSearchQuery,
  onSearchChange,
}: KnowledgeSidebarProps = {}) {
  const { knowledge } = useStore()
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(externalSelectedCategory || null)

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    onCategoryChange?.(category)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearchChange?.(query)
  }

  // Obter categorias únicas com contagem
  const categories = knowledge.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Obter tags únicas com contagem
  const tags = knowledge.reduce(
    (acc, item) => {
      for (const tag of item.tags) {
        acc[tag] = (acc[tag] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const topTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <aside className="w-64 shrink-0 space-y-6">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar notas..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Categorias */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Categorias</h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2 h-9", selectedCategory === null && "bg-primary/10 text-primary")}
            onClick={() => handleCategoryChange(null)}
          >
            <FolderOpen className="h-4 w-4" />
            <span>Todas as Notas</span>
            <span className="ml-auto text-xs text-muted-foreground">{knowledge.length}</span>
          </Button>

          {Object.entries(categories).map(([category, count]) => {
            const Icon = categoryIcons[category] || FileText
            return (
              <Button
                key={category}
                variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 h-9",
                    selectedCategory === category && "bg-primary/10 text-primary",
                  )}
                onClick={() => handleCategoryChange(category)}
              >
                <Icon className="h-4 w-4" />
                <span>{category}</span>
                <span className="ml-auto text-xs text-muted-foreground">{count}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Tags Populares</h3>
        <div className="flex flex-wrap gap-2">
          {topTags.map(([tag, count]) => (
            <Button key={tag} variant="outline" size="sm" className="h-7 gap-1 text-xs bg-transparent">
              <Hash className="h-3 w-3" />
              {tag}
              <span className="text-muted-foreground">({count})</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Recentes */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Atualizados Recentemente</h3>
        <div className="space-y-1">
          {knowledge.slice(0, 4).map((item) => (
            <Button key={item.id} variant="ghost" className="w-full justify-start gap-2 h-auto py-2 px-2 text-left">
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-sm truncate">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </aside>
  )
}
