"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    FileText, 
    Upload, 
    Search,
    BookOpen,
    Download,
    Trash2,
    Eye
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { apiClient } from "@/lib/api/client"
import { useToast } from "@/components/ui/use-toast"

interface Document {
    id: number
    fileName: string
    originalFileName: string
    fileType: string
    uploadDate: string
}

export default function DocumentosPage() {
  const { projects } = useStore()
  const searchParams = useSearchParams()
  const initialProjectId = searchParams.get("projeto")
  
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || "")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (selectedProjectId) {
        loadDocuments(selectedProjectId)
    } else {
        setDocuments([])
    }
  }, [selectedProjectId])

  const loadDocuments = async (projectId: string) => {
    try {
        setLoading(true)
        const data = await apiClient.get<Document[]>(`/api/documents/project/${projectId}`)
        setDocuments(data)
    } catch (error) {
        console.error("Erro ao carregar documentos:", error)
        try {
            if (typeof error === 'object' && error !== null) {
                console.error("Detalhes do erro:", JSON.stringify(error, null, 2))
            }
        } catch (e) {
            console.error("Não foi possível serializar o erro.")
        }
        toast({
            title: "Erro",
            description: "Não foi possível carregar os documentos.",
            variant: "destructive"
        })
    } finally {
        setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedProjectId) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)
    formData.append("projectId", selectedProjectId)

    try {
        setLoading(true)
        await apiClient.upload("/api/documents/upload", formData)
        toast({
            title: "Sucesso",
            description: "Documento enviado com sucesso!"
        })
        loadDocuments(selectedProjectId)
    } catch (error) {
        console.error("Erro no upload:", error)
        toast({
            title: "Erro",
            description: "Falha ao enviar documento.",
            variant: "destructive"
        })
    } finally {
        setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return

    try {
        await apiClient.delete(`/api/documents/${id}`)
        toast({
            title: "Documento excluído",
            description: "O arquivo foi removido com sucesso."
        })
        loadDocuments(selectedProjectId)
    } catch (error) {
        console.error("Erro ao deletar:", error)
        toast({
            title: "Erro",
            description: "Falha ao excluir documento.",
            variant: "destructive"
        })
    }
  }

  const filteredDocs = documents.filter(doc => 
    doc.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documentação Técnica</h1>
            <p className="text-muted-foreground">
              Arquivos, especificações e referências do projeto
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedProjectId}
              onValueChange={setSelectedProjectId}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecionar projeto..." />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Conteúdo */}
        {!selectedProjectId ? (
            <Card className="border-dashed flex-1 flex flex-col items-center justify-center m-4">
                <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                    <BookOpen className="h-16 w-16 mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum Projeto Selecionado</h3>
                    <p className="text-center max-w-md">Selecione um projeto acima para gerenciar seus documentos técnicos, especificações e diagramas.</p>
                </CardContent>
            </Card>
        ) : (
            <div className="space-y-6">
                {/* Upload e Filtro */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar documentos..." 
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={loading}
                        />
                        <Button asChild disabled={loading}>
                            <label htmlFor="file-upload" className="cursor-pointer gap-2">
                                <Upload className="h-4 w-4" />
                                {loading ? "Enviando..." : "Upload Arquivo"}
                            </label>
                        </Button>
                    </div>
                </div>

                {/* Lista de Documentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocs.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border rounded-lg bg-muted/10">
                            <FileText className="h-10 w-10 mb-3 opacity-20" />
                            <p>Nenhum documento encontrado.</p>
                        </div>
                    ) : (
                        filteredDocs.map((doc) => (
                            <Card key={doc.id} className="group hover:border-primary/50 transition-colors">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-primary/10 rounded-md">
                                            <FileText className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <CardTitle className="text-sm font-medium truncate" title={doc.originalFileName}>
                                                {doc.originalFileName}
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                {new Date(doc.uploadDate).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`${apiClient['baseURL'] || 'http://localhost:8080'}/api/documents/view/${doc.fileName}`, '_blank')}>
                                            <Eye className="h-4 w-4 text-blue-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(doc.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        )}
      </div>
    </AppShell>
  )
}
