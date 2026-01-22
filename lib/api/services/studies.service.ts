import { apiClient as api } from "../client"
import type { Subject, StudySession } from "../types"

export const studiesService = {
  // Subjects
  getAllSubjects: async () => {
    const data = await api.get<Subject[]>("/api/studies/subjects")
    return data
  },

  getSubjectById: async (id: number) => {
    const data = await api.get<Subject>(`/api/studies/subjects/${id}`)
    return data
  },

  createSubject: async (subject: Partial<Subject>) => {
    const data = await api.post<Subject>("/api/studies/subjects", subject)
    return data
  },

  updateSubject: async (id: number, subject: Partial<Subject>) => {
    const data = await api.put<Subject>(`/api/studies/subjects/${id}`, subject)
    return data
  },

  deleteSubject: async (id: number) => {
    await api.delete(`/api/studies/subjects/${id}`)
  },

  // Sessions
  getSessionsBySubject: async (subjectId: number) => {
    const data = await api.get<StudySession[]>(`/api/studies/subjects/${subjectId}/sessions`)
    return data
  },

  logSession: async (subjectId: number, session: Partial<StudySession>) => {
    const data = await api.post<StudySession>(`/api/studies/subjects/${subjectId}/sessions`, session)
    return data
  },

  deleteSession: async (id: number) => {
    await api.delete(`/api/studies/sessions/${id}`)
  }
}
