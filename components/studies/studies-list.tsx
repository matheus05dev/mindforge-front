"use client"

import { useState, useEffect } from "react"
import { StudyCard } from "./study-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { studiesService } from "@/lib/api/services/studies.service"
import type { Study } from "@/lib/types"

export function StudiesList() {
  const [studies, setStudies] = useState<Study[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 9,
    totalPages: 0,
    totalElements: 0,
  })

  useEffect(() => {
    async function fetchStudies() {
      try {
        setLoading(true)
        const data = await studiesService.getAllSubjects({
            page: pagination.page,
            size: pagination.size,
            sort: ["id,desc"]
        })

        // Map Subject to Study interface
        const proficiencyMap: Record<string, any> = {
            "BEGINNER": "iniciante",
            "INTERMEDIATE": "intermediario",
            "ADVANCED": "avancado",
            // Fallbacks
            "EASY": "iniciante",
            "MEDIUM": "intermediario",
            "HARD": "avancado"
        };

        const mappedStudies: Study[] = data.content.map(subject => ({
            id: String(subject.id),
            workspaceId: String(subject.workspaceId || 1),
            title: subject.name,
            description: subject.description,
            category: "General", // Placeholder
            subject: {
                ...subject,
                id: String(subject.id), // Ensure string ID match
                createdAt: new Date().toISOString(), // Mock
                updatedAt: new Date().toISOString(),  // Mock
                proficiencyLevel: proficiencyMap[subject.proficiencyLevel] || "iniciante"
            },
            progress: 0, 
            totalHours: 0,
            completedHours: 0,
            status: "em_andamento",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }))

        setStudies(mappedStudies)
        setPagination(prev => ({
            ...prev,
            totalPages: data.totalPages,
            totalElements: data.totalElements
        }))
      } catch (error) {
        console.error("Failed to fetch studies", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStudies()
  }, [pagination.page, pagination.size])

  const filteredStudies = studies.filter(
    (study) =>
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePriviousPage = () => {
      if (pagination.page > 0) {
          setPagination(prev => ({ ...prev, page: prev.page - 1 }))
      }
  }

  const handleNextPage = () => {
      if (pagination.page < pagination.totalPages - 1) {
          setPagination(prev => ({ ...prev, page: prev.page + 1 }))
      }
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Todos os Estudos</h2>
        <div className="flex items-center gap-2">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar estudos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
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
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
      <>
      {/* Grid/Lista de Estudos */}
      {viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudies.map((study) => (
            <StudyCard key={study.id} study={study} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudies.map((study) => (
            <StudyCard key={study.id} study={study} variant="list" />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={handlePriviousPage} disabled={pagination.page === 0}>
              <ChevronLeft className="h-4 w-4" />
              Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
              Página {pagination.page + 1} de {pagination.totalPages || 1}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextPage} disabled={pagination.page >= pagination.totalPages - 1}>
              Próximo
              <ChevronRight className="h-4 w-4" />
          </Button>
      </div>
      </>
      )}
    </div>
  )
}
