import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import type { AIMessage, AIMode, AIProvider, KnowledgeItem } from "../types";

export const aiService = {
  analyzeCode: async (data: {
    subjectId?: number;
    codeToAnalyze: string;
    documentId?: number | null;
    mode?: AIMode;
  }): Promise<AIMessage> => {
    return apiClient.post<AIMessage>(API_ENDPOINTS.aiAnalyzeCode, {
      subjectId: data.subjectId ?? null,
      codeToAnalyze: data.codeToAnalyze,
      documentId: data.documentId ?? null,
      mode: data.mode ?? "MENTOR",
    });
  },

  analyzeGithubFile: async (data: {
    projectId: number;
    filePath: string;
    mode?: AIMode;
  }): Promise<AIMessage> => {
    return apiClient.post<AIMessage>(API_ENDPOINTS.aiAnalyzeGithubFile, {
      projectId: data.projectId,
      filePath: data.filePath,
      mode: data.mode ?? "MENTOR",
    });
  },

  analyzeGeneric: async (data: {
    question: string;
    subjectId?: number | null;
    projectId?: number | null;
    documentId?: number | null;
    provider?: AIProvider;
  }): Promise<AIMessage> => {
    return apiClient.post<AIMessage>(API_ENDPOINTS.aiAnalyzeGeneric, {
      question: data.question,
      subjectId: data.subjectId ?? null,
      projectId: data.projectId ?? null,
      documentId: data.documentId ?? null,
      provider: data.provider ?? null,
    });
  },

  editKnowledgeItem: async (
    itemId: number,
    instruction: string
  ): Promise<KnowledgeItem> => {
    return apiClient.post<KnowledgeItem>(
      API_ENDPOINTS.aiEditKnowledge(itemId),
      { instruction }
    );
  },

  transcribeDocument: async (
    documentId: number,
    itemId: number
  ): Promise<KnowledgeItem> => {
    return apiClient.post<KnowledgeItem>(
      API_ENDPOINTS.aiTranscribeDocument(documentId, itemId),
      {}
    );
  },

  reviewPortfolio: async (githubRepoUrl: string): Promise<AIMessage> => {
    return apiClient.post<AIMessage>(API_ENDPOINTS.aiReviewPortfolio, {
      githubRepoUrl,
    });
  },

  thinkProduct: async (featureDescription: string): Promise<AIMessage> => {
    return apiClient.post<AIMessage>(API_ENDPOINTS.aiThinkProduct, {
      featureDescription,
    });
  },

  chat: async (data: {
    prompt: string;
    provider?: string;
    model?: string;
    systemMessage?: string;
  }): Promise<any> => {
    return apiClient.post<any>(API_ENDPOINTS.aiChat, {
      prompt: data.prompt,
      provider: data.provider,
      model: data.model,
      systemMessage: data.systemMessage,
    });
  },

  analyzeDocument: async (data: {
    file: File;
    prompt: string;
    provider?: string;
  }): Promise<any> => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("prompt", data.prompt);
    if (data.provider) {
      formData.append("provider", data.provider);
    }
    return apiClient.upload<any>(API_ENDPOINTS.aiDocumentAnalyze, formData);
  },
};
