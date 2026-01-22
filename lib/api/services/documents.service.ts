import { apiClient } from "../client"
import { API_ENDPOINTS } from "../config"
import type { Document } from "../types"

export interface UploadDocumentParams {
  file: File
  projectId?: number
  kanbanTaskId?: number
  knowledgeItemId?: number
  studySessionId?: number
}

export const documentsService = {
  getAll: async (): Promise<Document[]> => {
    return apiClient.get<Document[]>(API_ENDPOINTS.documents)
  },

  upload: async (params: UploadDocumentParams): Promise<Document> => {
    const formData = new FormData()
    formData.append("file", params.file)

    const additionalData: Record<string, string | number> = {}
    if (params.projectId) additionalData.projectId = params.projectId
    if (params.kanbanTaskId) additionalData.kanbanTaskId = params.kanbanTaskId
    if (params.knowledgeItemId) additionalData.knowledgeItemId = params.knowledgeItemId
    if (params.studySessionId) additionalData.studySessionId = params.studySessionId

    return apiClient.upload<Document>(API_ENDPOINTS.documentsUpload, formData, additionalData)
  },

  download: async (fileName: string): Promise<Blob> => {
    return apiClient.download(API_ENDPOINTS.documentsDownload(fileName), fileName)
  },

  downloadAsUrl: async (fileName: string): Promise<string> => {
    const blob = await documentsService.download(fileName)
    return URL.createObjectURL(blob)
  },

  delete: async (id: number): Promise<void> => {
    return apiClient.delete(`${API_ENDPOINTS.documents}/${id}`)
  },
}

