import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { Order } from '../../shared/types.ts'
import { orderService } from './orderService.ts'
import { useAuth } from '../auth/AuthContext.tsx'
import { UserRole } from '../../shared/constants/enums.ts'

interface OrdersContextValue {
  orders: Order[]
  isLoading: boolean
  lastFetch: number | null
  refreshOrders: (forceRefresh?: boolean) => Promise<void>
  clearOrders: () => void
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined)

const CACHE_DURATION = 30000 // 30 segundos de caché

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastFetch, setLastFetch] = useState<number | null>(null)

  const refreshOrders = useCallback(async (forceRefresh = false) => {
    if (!user || !token) {
      setOrders([])
      return
    }

    // Si ya hay datos en caché y no es un refresh forzado, no hacer la petición
    const now = Date.now()
    if (!forceRefresh && lastFetch && (now - lastFetch) < CACHE_DURATION) {
      console.log('Usando órdenes en caché')
      return
    }

    setIsLoading(true)
    try {
      let fetchedOrders: Order[] = []
      
      if (user.role === UserRole.ADMIN) {
        fetchedOrders = await orderService.getOrders(token)
      } else if (user.role === UserRole.DELIVERY) {
        fetchedOrders = await orderService.getMyDeliveries(token)
      } else if (user.role === UserRole.CLIENT) {
        fetchedOrders = await orderService.getOrdersByUserId(parseInt(user.id), token)
      }

      setOrders(fetchedOrders)
      setLastFetch(Date.now())
    } catch (error) {
      console.error('Error cargando órdenes:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }, [user, token, lastFetch])

  const clearOrders = useCallback(() => {
    setOrders([])
    setLastFetch(null)
  }, [])

  // Limpiar órdenes cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      clearOrders()
    }
  }, [user, clearOrders])

  const value: OrdersContextValue = {
    orders,
    isLoading,
    lastFetch,
    refreshOrders,
    clearOrders
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider')
  }
  return context
}
