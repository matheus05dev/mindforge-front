import { API_BASE_URL } from "./config"

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export class ApiClient {
  public baseURL: string

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

    // Explicitly handle token injection manually from localStorage to avoid loop/hook issues inside class
    // Zustand persists to 'auth-storage' in localStorage
    if (typeof window !== 'undefined') {
        try {
            const storage = localStorage.getItem('auth-storage');
            if (storage) {
                const parsed = JSON.parse(storage);
                const token = parsed.state?.token;
                if (token) {
                    // @ts-ignore
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
        } catch (e) {
            console.error("Failed to retrieve token from storage", e);
        }
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        let errorData: any = {}
        const text = await response.text()
        try {
          if (text) {
            errorData = JSON.parse(text)
          }
        } catch (e) {
          console.error("Failed to parse error response:", text)
          errorData = { message: text || response.statusText || "Erro na requisição" }
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

      // Verifica se a resposta tem conteúdo antes de fazer o parse JSON
      const text = await response.text()
      console.log(`>>> [API CLIENT] ${endpoint}`, {
        status: response.status,
        textLength: text?.length,
        rawText: text
      });

      if (!text || text.trim() === '') {
        throw {
          message: 'Resposta vazia do servidor',
          status: response.status,
        }
      }

      try {
        const json = JSON.parse(text)
        return json
      } catch (e) {
        console.error('Failed to parse JSON response:', text)
        throw {
          message: 'Resposta inválida do servidor',
          status: response.status,
        } as ApiError
      }
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

    // Verifica se a resposta tem conteúdo antes de fazer o parse JSON
    const text = await response.text()
    if (!text || text.trim() === '') {
      throw {
        message: 'Resposta vazia do servidor após upload',
        status: response.status,
      } as ApiError
    }

    try {
      return JSON.parse(text)
    } catch (e) {
      console.error('Failed to parse JSON response from upload:', text)
      throw {
        message: 'Resposta inválida do servidor após upload',
        status: response.status,
      } as ApiError
    }
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

