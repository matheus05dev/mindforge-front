import { apiClient as api } from "../client"
import type { Subject, StudySession, Note } from "../types"

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
    return await api.get<Note[]>(`/api/studies/subjects/${subjectId}/notes`)
  },

  getNoteById: async (noteId: number) => {
    return await api.get<Note>(`/api/studies/notes/${noteId}`)
  },

  createNote: async (subjectId: number, note: any) => {
    return await api.post<Note>(`/api/studies/subjects/${subjectId}/notes`, note)
  },

  updateNote: async (noteId: number, note: any) => {
    return await api.put<Note>(`/api/studies/notes/${noteId}`, note)
  },

  deleteNote: async (noteId: number) => {
    await api.delete(`/api/studies/notes/${noteId}`)
  },

  // AI Assist for Notes
  noteAIAssist: async (data: {
    command: "CONTINUE" | "SUMMARIZE" | "FIX_GRAMMAR" | "IMPROVE" | "CUSTOM" | "ASK_AGENT" | "AGENT_UPDATE"
    context?: string
    instruction?: string
    useContext?: boolean
    noteId?: number
    agentMode?: boolean
  }): Promise<{ 
    result?: string
    proposal?: any
    success: boolean
    message: string 
  }> => {
    return await api.post("/api/studies/notes/ai", data)
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

  generateQuiz: async (subjectId: number, topic: string, difficulty: string, count: number): Promise<any> => { // Changed Quiz to any as Quiz type is not imported
    const { data } = await api.post<any>(`/api/studies/subjects/${subjectId}/quizzes/generate`, { // Changed Quiz to any
      topic,
      difficulty,
      count,
    })
    return data
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
  },

  // Proposal Application
  applyProposal: async (proposalId: string, approval: {
    approvedChangeIndices: number[]
    approveAll: boolean
    userComment?: string
    modifiedContent?: Record<number, string>
  }) => {
    return await api.post(`/api/studies/notes/ai/proposals/${proposalId}/apply`, approval)
  },

  // Versioning
  getVersions: async (noteId: number) => {
    return await api.get(`/api/studies/notes/${noteId}/versions`)
  },

  getVersion: async (noteId: number, versionId: number) => {
    return await api.get(`/api/studies/notes/${noteId}/versions/${versionId}`)
  },

  rollbackToVersion: async (noteId: number, versionId: number) => {
    return await api.post(`/api/studies/notes/${noteId}/versions/${versionId}/rollback`, {})
  },


  // Roadmaps
  generateRoadmap: async (topic: string, duration: string, difficulty: string) => {
    const data = await api.post("/api/studies/roadmaps/generate", {
      topic,
      duration,
      difficulty,
    })
    return data
  },

  getAllRoadmaps: async () => {
    return await api.get("/api/studies/roadmaps")
  },

  getRoadmapById: async (id: number) => {
    return await api.get(`/api/studies/roadmaps/${id}`)
  }
}

