
import { useState, useEffect, useCallback } from 'react'

interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface UseAsyncOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options?: UseAsyncOptions,
): UseAsyncState<T> & { execute: () => Promise<void> } => {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const response = await asyncFunction()
      setState({ data: response, loading: false, error: null })
      options?.onSuccess?.()
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: err })
      options?.onError?.(err)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, execute }
}
