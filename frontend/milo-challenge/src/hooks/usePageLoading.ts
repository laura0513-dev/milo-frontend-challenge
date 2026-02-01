import { useEffect, useState } from 'react'

/**
 * Hook que simula un loading inicial cuando se monta la página
 * Usado para que cada página sea responsable de su propio estado de carga
 */
export const usePageLoading = (delayMs = 300) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  return isLoading
}
