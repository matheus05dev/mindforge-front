"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { projectsService, studiesService } from "@/lib/api"
import type { Project, Subject } from "@/lib/api/types"
import { Sparkles, FolderKanban, GraduationCap, Github, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { GitHubRepoLink } from "@/components/projects/github-repo-link"
import { GitHubStudyLink } from "@/components/studies/github-study-link"

export default function CodeReviewPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)

  useEffect(() => {
    loadProjects()
    loadSubjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true)
      const data = await projectsService.getAll({ size: 100 })
      setProjects(data.content || [])
    } catch (error) {
      console.error("Erro ao carregar projetos:", error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  const loadSubjects = async () => {
    try {
      setIsLoadingSubjects(true)
      const workspaceId = 1 // TODO: Get from store
      const data = await studiesService.getAllSubjects({ size: 100 }, workspaceId)
      setSubjects(data.content || [])
    } catch (error) {
      console.error("Erro ao carregar estudos:", error)
    } finally {
      setIsLoadingSubjects(false)
    }
  }

  const projectsWithGitHub = projects.filter(p => p.githubRepoUrl)
  const projectsWithoutGitHub = projects.filter(p => !p.githubRepoUrl)
  const subjectsWithGitHub = subjects.filter(s => s.githubRepoUrl)
  const subjectsWithoutGitHub = subjects.filter(s => !s.githubRepoUrl)

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Code Review com IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise inteligente de código para seus projetos e estudos
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Projetos ({projectsWithGitHub.length})
            </TabsTrigger>
            <TabsTrigger value="studies" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Estudos ({subjectsWithGitHub.length})
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            {/* Projects with GitHub */}
            {projectsWithGitHub.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Projetos com GitHub Vinculado
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projectsWithGitHub.map((project) => (
                    <Card
                      key={project.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => router.push(`/projetos/${project.id}/code-review`)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                          <FolderKanban className="h-5 w-5" />
                          {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || "Sem descrição"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {project.githubRepoUrl?.replace("https://github.com/", "").substring(0, 30)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Projects without GitHub */}
            {projectsWithoutGitHub.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Projetos sem GitHub
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projectsWithoutGitHub.map((project) => (
                    <Card key={project.id} className="opacity-60">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FolderKanban className="h-5 w-5" />
                          {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {project.description || "Sem descrição"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <GitHubRepoLink
                          projectId={project.id}
                          onSuccess={loadProjects}
                          trigger={
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Plus className="h-4 w-4" />
                              Vincular GitHub
                            </Button>
                          }
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {projects.length === 0 && !isLoadingProjects && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderKanban className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Nenhum projeto cadastrado ainda.</p>
                  <Button onClick={() => router.push("/projetos/lista")}>
                    Criar Projeto
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Studies Tab */}
          <TabsContent value="studies" className="space-y-4">
            {/* Studies with GitHub */}
            {subjectsWithGitHub.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Estudos com GitHub Vinculado
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subjectsWithGitHub.map((subject) => (
                    <Card
                      key={subject.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => router.push(`/estudos/${subject.id}/code-review`)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
                          <GraduationCap className="h-5 w-5" />
                          {subject.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {subject.description || "Sem descrição"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {subject.githubRepoUrl?.replace("https://github.com/", "").substring(0, 30)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Studies without GitHub */}
            {subjectsWithoutGitHub.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-muted-foreground">
                  Estudos sem GitHub
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subjectsWithoutGitHub.map((subject) => (
                    <Card key={subject.id} className="opacity-60">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          {subject.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {subject.description || "Sem descrição"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <GitHubStudyLink
                          subjectId={subject.id}
                          onSuccess={loadSubjects}
                          trigger={
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Plus className="h-4 w-4" />
                              Vincular GitHub
                            </Button>
                          }
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {subjects.length === 0 && !isLoadingSubjects && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground mb-4">Nenhum estudo cadastrado ainda.</p>
                  <Button onClick={() => router.push("/estudos/cursos")}>
                    Criar Estudo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}

