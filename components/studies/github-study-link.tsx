"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { studiesService } from "@/lib/api/services/studies.service"
import { toast } from "sonner"
import { Github, Link as LinkIcon, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface GitHubStudyLinkProps {
  subjectId: number
  currentRepoUrl?: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function GitHubStudyLink({ subjectId, currentRepoUrl, onSuccess, trigger }: GitHubStudyLinkProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [repoUrl, setRepoUrl] = useState(currentRepoUrl || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!repoUrl.trim()) {
      toast.error("Por favor, insira a URL do repositório")
      return
    }

    // Validação básica de URL do GitHub
    if (!repoUrl.includes("github.com/")) {
      toast.error("URL inválida. Use o formato: https://github.com/owner/repo")
      return
    }

    setIsLoading(true)
    try {
      await studiesService.linkRepository(subjectId, repoUrl.trim())
      toast.success("Repositório vinculado com sucesso!")
      setIsOpen(false)
      onSuccess?.()
    } catch (error: any) {
      console.error("Erro ao vincular repositório:", error)
      toast.error(error.message || "Erro ao vincular repositório")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button onClick={() => setIsOpen(true)} variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          {currentRepoUrl ? "Alterar Repositório" : "Vincular Repositório"}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Vincular Repositório GitHub
            </DialogTitle>
            <DialogDescription>
              Conecte um repositório do GitHub para habilitar code review com IA para este estudo
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repoUrl">URL do Repositório</Label>
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/owner/repository"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Exemplo: https://github.com/facebook/react
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Vincular
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
