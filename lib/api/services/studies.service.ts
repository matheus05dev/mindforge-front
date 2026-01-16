import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Subject, StudySession } from "../types"

export const studiesService = {
  // Subjects
  getAllSubjects: async (): Promise<Subject[]> => {
    return apiClient.get<Subject[]>(API_ENDPOINTS.subjects)
  },

  getSubjectById: async (id: number): Promise<Subject> => {
    return apiClient.get<Subject>(API_ENDPOINTS.subject(id))
  },

  createSubject: async (data: {
    name: string
    description?: string
    proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
    professionalLevel: "JUNIOR" | "PLENO" | "SENIOR"
  }): Promise<Subject> => {
    return apiClient.post<Subject>(API_ENDPOINTS.subjects, data)
  },

  updateSubject: async (
    id: number,
    data: Partial<{
      name: string
      description?: string
      proficiencyLevel: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
      professionalLevel: "JUNIOR" | "PLENO" | "SENIOR"
    }>,
  ): Promise<Subject> => {
    return apiClient.put<Subject>(API_ENDPOINTS.subject(id), data)
  },

  deleteSubject: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.subject(id))
  },

  // Sessions
  createSession: async (
    subjectId: number,
    data: { startTime: string; durationMinutes: number; notes?: string },
  ): Promise<StudySession> => {
    return apiClient.post<StudySession>(API_ENDPOINTS.sessions(subjectId), data)
  },

  updateSession: async (
    id: number,
    data: { startTime?: string; durationMinutes?: number; notes?: string },
  ): Promise<StudySession> => {
    return apiClient.put<StudySession>(API_ENDPOINTS.session(id), data)
  },

  deleteSession: async (id: number): Promise<void> => {
    return apiClient.delete<void>(API_ENDPOINTS.session(id))
  },
}

