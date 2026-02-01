import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export const useRouteLoading = (delay = 100) => {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Cuando cambia la ruta, mostrar loading
    setIsLoading(true)

    // Crear un timeout para ocultar el loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [location.pathname, delay])

  return isLoading
}
