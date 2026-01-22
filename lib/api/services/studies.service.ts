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
  },

  updateSession: async (id: number, session: Partial<StudySession>) => {
    const data = await api.put<StudySession>(`/api/studies/sessions/${id}`, session)
    return data
  },

  // Notes
  getNotesBySubject: async (subjectId: number) => {
    return await api.get(`/api/studies/subjects/${subjectId}/notes`)
  },

  createNote: async (subjectId: number, note: any) => {
    return await api.post(`/api/studies/subjects/${subjectId}/notes`, note)
  },

  updateNote: async (noteId: number, note: any) => {
    return await api.put(`/api/studies/notes/${noteId}`, note)
  },

  deleteNote: async (noteId: number) => {
    await api.delete(`/api/studies/notes/${noteId}`)
  },

  // Quizzes
  getQuizzesBySubject: async (subjectId: number) => {
    return await api.get(`/api/studies/subjects/${subjectId}/quizzes`)
  },

  getQuizById: async (quizId: number) => {
    return await api.get(`/api/studies/quizzes/${quizId}`)
  },

  createQuiz: async (subjectId: number, quiz: any) => {
    return await api.post(`/api/studies/subjects/${subjectId}/quizzes`, quiz)
  },

  deleteQuiz: async (quizId: number) => {
    await api.delete(`/api/studies/quizzes/${quizId}`)
  },

  // Resources
  getResourcesBySubject: async (subjectId: number) => {
    return await api.get(`/api/studies/subjects/${subjectId}/resources`)
  },

  createResource: async (subjectId: number, resource: any) => {
    return await api.post(`/api/studies/subjects/${subjectId}/resources`, resource)
  },

  deleteResource: async (resourceId: number) => {
    await api.delete(`/api/studies/resources/${resourceId}`)
  }
}
