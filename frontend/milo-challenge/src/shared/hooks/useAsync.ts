
import { useState, useEffect, useCallback } from 'react'

/**
 * Estado que representa el ciclo de vida de una operación asíncrona
 */
interface UseAsyncState<T> {
  /** Datos obtenidos de la operación asíncrona */
  data: T | null
  /** Indica si la operación está en progreso */
  loading: boolean
  /** Error capturado durante la ejecución */
  error: Error | null
}

/**
 * Opciones de configuración para callbacks del hook
 */
interface UseAsyncOptions {
  /** Callback ejecutado cuando la operación es exitosa */
  onSuccess?: () => void
  /** Callback ejecutado cuando la operación falla */
  onError?: (error: Error) => void
}

/**
 * Valor de retorno del hook useAsync
 */
interface UseAsyncReturn<T> extends UseAsyncState<T> {
  /** Función para ejecutar manualmente la operación asíncrona */
  execute: () => Promise<void>
}

/**
 * Hook personalizado para manejar operaciones asíncronas con estado
 * 
 * Gestiona automáticamente los estados de loading, data y error,
 * simplificando el manejo de llamadas asíncronas en componentes.
 * 
 * @template T - Tipo de dato que retorna la operación asíncrona
 * @param asyncFunction - Función asíncrona a ejecutar
 * @param executeOnMount - Si es true, ejecuta la función al montar el componente (default: true)
 * @param options - Callbacks opcionales para éxito y error
 * 
 * @returns Objeto con data, loading, error y función execute
 * 
 * @example
 * ```tsx
 * const { data: users, loading, error, execute } = useAsync(
 *   () => fetchUsers(),
 *   true,
 *   {
 *     onSuccess: () => console.log('Usuarios cargados'),
 *     onError: (err) => console.error(err)
 *   }
 * )
 * ```
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  executeOnMount = true,
  options?: UseAsyncOptions,
): UseAsyncReturn<T> => {
  // Estado inicial: loading es true solo si se ejecutará al montar
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: executeOnMount,
    error: null,
  })

  /**
   * Ejecuta la operación asíncrona y actualiza el estado según el resultado
   */
  const execute = useCallback(async () => {
    // Resetear estado e iniciar loading
    setState({ data: null, loading: true, error: null })
    
    try {
      const response = await asyncFunction()
      setState({ data: response, loading: false, error: null })
      options?.onSuccess?.()
    } catch (error) {
      // Normalizar el error a tipo Error
      const normalizedError = error instanceof Error ? error : new Error(String(error))
      setState({ data: null, loading: false, error: normalizedError })
      options?.onError?.(normalizedError)
    }
    // Nota: asyncFunction y options no se incluyen en dependencias para evitar
    // re-creación innecesaria del callback. Se asume que no cambiarán durante el ciclo de vida.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ejecutar automáticamente al montar si executeOnMount es true
  useEffect(() => {
    if (executeOnMount) {
      execute()
    }
    // execute es estable gracias a useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, execute }
}
