"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Image, Code, File, Download, Trash2, MoreHorizontal, Sparkles, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DocumentAnalyzerModal } from "./document-analyzer-modal"
import type { Document } from "@/lib/api/types"

const typeIcons = {
  pdf: FileText,
  image: Image,
  code: Code,
  text: FileText,
  other: File,
}

const typeColors = {
  pdf: "bg-red-500/10 text-red-500",
  image: "bg-blue-500/10 text-blue-500",
  code: "bg-purple-500/10 text-purple-500",
  text: "bg-green-500/10 text-green-500",
  other: "bg-gray-500/10 text-gray-500",
}

export function DocumentsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadDocuments = async () => {
    try {
      setIsLoading(true)
      const { documentsService } = await import("@/lib/api")
      const docs = await documentsService.getAll()
      setDocuments(docs)
    } catch (error) {
      console.error("Erro ao carregar documentos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  // Expose refresh function to parent via custom event
  useEffect(() => {
    const handleRefresh = () => loadDocuments()
    window.addEventListener("documents:refresh", handleRefresh)
    return () => window.removeEventListener("documents:refresh", handleRefresh)
  }, [])

  const filteredDocuments = documents.filter(
    (doc) =>
      (doc.originalFileName || doc.fileName || '').toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B"
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileTypeFromName = (fileName: string): keyof typeof typeIcons => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'pdf'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image'
    if (['js', 'ts', 'jsx', 'tsx', 'java', 'py'].includes(ext || '')) return 'code'
    if (['txt', 'md'].includes(ext || '')) return 'text'
    return 'other'
  }

  const handleAnalyzeDocument = (doc: Document) => {
    setSelectedDocument(doc)
    setIsAnalyzerOpen(true)
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Carregando documentos...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Documents Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => {
            const fileType = getFileTypeFromName(doc.fileName || '')
            const Icon = typeIcons[fileType]
            const typeColor = typeColors[fileType]

            return (
              <div
                key={doc.id}
                className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg cursor-pointer"
                onClick={() => {
                  // Abrir documento em nova aba (Visualizar inline)
                  let url = doc.downloadUri?.startsWith('http') 
                    ? doc.downloadUri 
                    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${doc.downloadUri}`
                  
                  if (url) {
                     // Tenta usar endpoint de view se disponível na URL padrão
                     url = url.replace('/api/documents/download/', '/api/documents/view/')
                  }
                  window.open(url, "_blank")
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`rounded-md p-2 ${typeColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate" title={doc.originalFileName || doc.fileName}>
                        {doc.originalFileName || doc.fileName}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.fileType} • {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString("pt-BR") : 'Data desconhecida'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAnalyzeDocument(doc)
                        }}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analisar com IA
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          // Download (usa URL original /download/)
                          const url = doc.downloadUri?.startsWith('http') 
                            ? doc.downloadUri 
                            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${doc.downloadUri}`
                          window.open(url, "_blank")
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          // Visualizar (usa URL /view/)
                          let url = doc.downloadUri?.startsWith('http') 
                            ? doc.downloadUri 
                            : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}${doc.downloadUri}`
                          
                          if (url) {
                             url = url.replace('/api/documents/download/', '/api/documents/view/')
                          }
                          window.open(url, "_blank")
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Visualizar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (confirm("Tem certeza que deseja excluir este documento?")) {
                            try {
                              const { documentsService } = await import("@/lib/api")
                              await documentsService.delete(doc.id)
                              loadDocuments()
                            } catch (error) {
                              console.error("Erro ao excluir documento:", error)
                              alert("Erro ao excluir documento")
                            }
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>

        {filteredDocuments.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum documento encontrado.</p>
          </div>
        )}
      </div>

      <DocumentAnalyzerModal
        document={selectedDocument}
        isOpen={isAnalyzerOpen}
        onClose={() => {
          setIsAnalyzerOpen(false)
          setSelectedDocument(null)
        }}
      />
    </>
  )
}
