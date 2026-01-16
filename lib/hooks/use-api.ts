"use client"

import { useState, useCallback } from "react"
import type { ApiError } from "../api/client"

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiCall()
      setData(result)
      return result
    } catch (err) {
      // Garantir que sempre temos um ApiError válido
      let apiError: ApiError
      if (err && typeof err === "object" && "status" in err && "message" in err) {
        apiError = err as ApiError
      } else {
        apiError = {
          message: err instanceof Error ? err.message : String(err) || "Erro desconhecido",
          status: 0,
        }
      }
      setError(apiError)
      throw apiError
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, reset }
}

