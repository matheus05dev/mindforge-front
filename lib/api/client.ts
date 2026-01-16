import { API_BASE_URL } from "./config"

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorData: any = {}
        try {
          const text = await response.text()
          if (text) {
            errorData = JSON.parse(text)
          }
        } catch {
          errorData = { message: response.statusText || "Erro na requisição" }
        }
        throw {
          message: errorData.message || errorData.error || response.statusText || "Erro na requisição",
          status: response.status,
          errors: errorData.errors,
        } as ApiError
      }

      // Se a resposta for 204 (No Content), retorna void
      if (response.status === 204) {
        return undefined as T
      }

      return await response.json()
    } catch (error) {
      if (error && typeof error === "object" && "status" in error && "message" in error) {
        throw error
      }
      const message =
        error instanceof Error
          ? error.message
          : error && typeof error === "object" && "message" in error
            ? String((error as any).message)
            : "Erro de conexão com o servidor"
      throw {
        message,
        status: 0,
      } as ApiError
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    additionalData?: Record<string, string | number>,
  ): Promise<T> {
    // Adiciona dados adicionais ao FormData
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }))
      throw {
        message: errorData.message || "Erro no upload",
        status: response.status,
        errors: errorData.errors,
      } as ApiError
    }

    return await response.json()
  }

  async download(endpoint: string, fileName: string): Promise<Blob> {
    const url = `${this.baseURL}${endpoint}`
    const response = await fetch(url)

    if (!response.ok) {
      throw {
        message: "Erro ao baixar arquivo",
        status: response.status,
      } as ApiError
    }

    return await response.blob()
  }
}

export const apiClient = new ApiClient()

