"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitHubFileBrowser } from "@/components/projects/github-file-browser"
import { CodeReviewPanel } from "@/components/projects/code-review-panel"
import { CodeReviewResult } from "@/components/projects/code-review-result"
import { studiesService } from "@/lib/api"
import type { Subject } from "@/lib/api/types"
import { Github, AlertCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GitHubStudyLink } from "@/components/studies/github-study-link"

export default function StudyCodeReviewPage() {
  const params = useParams()
  const studyId = Number(params.id)
  
  const [subject, setSubject] = useState<Subject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string>()
  const [reviewResult, setReviewResult] = useState<any>(null)

  useEffect(() => {
    loadSubject()
  }, [studyId])

  const loadSubject = async () => {
    try {
      setIsLoading(true)
      const data = await studiesService.getSubjectById(studyId)
      setSubject(data)
    } catch (error) {
      console.error("Erro ao carregar matéria:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const parseGitHubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) return null
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") }
  }

  const repoInfo = subject?.githubRepoUrl ? parseGitHubUrl(subject.githubRepoUrl) : null

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Code Review com IA
            </h1>
            <p className="text-muted-foreground mt-1">
              {subject?.name || "Matéria"}
            </p>
          </div>
          <GitHubStudyLink
            subjectId={studyId}
            currentRepoUrl={subject?.githubRepoUrl}
            onSuccess={loadSubject}
          />
        </div>

        {/* No GitHub Repo Alert */}
        {!subject?.githubRepoUrl && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vincule um repositório do GitHub para começar a usar o code review com IA.
              Clique no botão "Vincular Repositório" acima.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        {repoInfo && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column: File Browser */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    Arquivos do Repositório
                  </CardTitle>
                  <CardDescription>
                    {repoInfo.owner}/{repoInfo.repo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GitHubFileBrowser
                    owner={repoInfo.owner}
                    repo={repoInfo.repo}
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Review Panel */}
            <div className="space-y-4">
              <CodeReviewPanel
                subjectId={studyId}
                selectedFile={selectedFile}
                onReviewComplete={(result) => {
                  setReviewResult(result)
                }}
              />
            </div>
          </div>
        )}

        {/* Review Result */}
        {reviewResult && selectedFile && (
          <CodeReviewResult
            result={reviewResult}
            filePath={selectedFile}
            mode={reviewResult.mode || "MENTOR"}
          />
        )}
      </div>
    </AppShell>
  )
}
