import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import { toQueryString } from "../utils"
import type { Project, Milestone, Page, Pageable } from "../types"

export const projectsService = {
  getAll: async (pageable?: Pageable): Promise<Page<Project>> => {
    const qs = toQueryString(pageable as any)
    return apiClient.get<Page<Project>>(`${API_ENDPOINTS.projects}${qs}`)
  },

  getById: async (id: number): Promise<Project> => {
    return apiClient.get<Project>(API_ENDPOINTS.project(id))
  },

  create: async (data: { workspaceId: number; name: string; description?: string }): Promise<Project> => {
    return apiClient.post<Project>(API_ENDPOINTS.projects, data)
  },

  update: async (id: number, data: Partial<Project>): Promise<Project> => {
    return apiClient.put<Project>(API_ENDPOINTS.project(id), data)
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.project(id))
  },

  linkGithub: async (id: number, repoUrl: string): Promise<Project> => {
    return apiClient.post<Project>(API_ENDPOINTS.projectLink(id), { repoUrl })
  },

  // Milestones
  getMilestones: async (projectId: number): Promise<Milestone[]> => {
    return apiClient.get<Milestone[]>(API_ENDPOINTS.milestones(projectId))
  },

  createMilestone: async (
    projectId: number,
    data: { title: string; description?: string; dueDate?: string; completed?: boolean },
  ): Promise<Milestone> => {
    return apiClient.post<Milestone>(API_ENDPOINTS.milestones(projectId), data)
  },

  updateMilestone: async (
    id: number,
    data: { title?: string; description?: string; dueDate?: string; completed?: boolean },
  ): Promise<Milestone> => {
    return apiClient.put<Milestone>(API_ENDPOINTS.milestone(id), data)
  },

  deleteMilestone: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.milestone(id))
  },
}

