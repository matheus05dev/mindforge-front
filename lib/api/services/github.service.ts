import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Project } from "../types"

export interface GitHubRepoLinkRequest {
  repoUrl: string
}

export interface GitHubFileTree {
  path: string
  type: "file" | "dir"
  size?: number
  sha: string
}

export interface CodeReviewRequest {
  projectId?: number
  subjectId?: number
  filePath: string
  mode: "MENTOR" | "ANALYST" | "DEBUG_ASSISTANT" | "SOCRATIC_TUTOR"
}

export interface CodeReviewResponse {
  id: number
  role: string
  content: string
  createdAt: string
}

export const githubService = {
  /**
   * Vincula um repositório GitHub a um projeto
   */
  linkRepository: async (projectId: number, data: GitHubRepoLinkRequest): Promise<Project> => {
    return apiClient.post<Project>(`/api/projects/${projectId}/link`, data)
  },

  /**
   * Busca a árvore de arquivos de um repositório
   * Nota: Este endpoint precisa ser criado no backend
   */
  getRepoTree: async (owner: string, repo: string, path: string = ""): Promise<GitHubFileTree[]> => {
    const params = path ? `?path=${encodeURIComponent(path)}` : ""
    return apiClient.get<GitHubFileTree[]>(`/api/github/repos/${owner}/${repo}/tree${params}`)
  },

  /**
   * Solicita análise de código de um arquivo do GitHub
   */
  analyzeFile: async (data: CodeReviewRequest): Promise<CodeReviewResponse> => {
    return apiClient.post<CodeReviewResponse>(API_ENDPOINTS.aiAnalyzeGithubFile, data)
  },
}
