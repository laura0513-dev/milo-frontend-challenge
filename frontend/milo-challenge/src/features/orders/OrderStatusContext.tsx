import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { statusService, OrderStatuses } from './statusService.ts'

interface OrderStatusContextType {
  statuses: OrderStatuses | null
  isLoading: boolean
  error: string | null
}

const OrderStatusContext = createContext<OrderStatusContextType | undefined>(undefined)

export const OrderStatusProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth()
  const [statuses, setStatuses] = useState<OrderStatuses | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Solo cargar si hay token y aún no se han cargado los estados
    if (!token || statuses) return

    const loadStatuses = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const fetchedStatuses = await statusService.getOrderStatuses(token)
        setStatuses(fetchedStatuses)
        // Opcional: guardar en localStorage para persistencia
        localStorage.setItem('orderStatuses', JSON.stringify(fetchedStatuses))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error cargando estados'
        setError(errorMessage)
        console.error('Error loading order statuses:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Intentar cargar desde localStorage primero
    const cachedStatuses = localStorage.getItem('orderStatuses')
    if (cachedStatuses) {
      try {
        setStatuses(JSON.parse(cachedStatuses))
      } catch {
        // Si falla el parse, cargar desde el backend
        loadStatuses()
      }
    } else {
      loadStatuses()
    }
  }, [token]) // Solo depende del token, no de statuses

  const value: OrderStatusContextType = {
    statuses,
    isLoading,
    error,
  }

  return <OrderStatusContext.Provider value={value}>{children}</OrderStatusContext.Provider>
}

export const useOrderStatuses = () => {
  const context = useContext(OrderStatusContext)
  if (!context) {
    throw new Error('useOrderStatuses debe ser usado dentro de OrderStatusProvider')
  }
  return context
}
