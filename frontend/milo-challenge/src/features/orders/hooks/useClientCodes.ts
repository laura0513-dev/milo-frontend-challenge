import { useState, useEffect } from 'react'
import { Order } from '../../../shared/types.ts'
import { orderService } from '../orderService.ts'

interface ClientCodeData {
  code: string
  expiresIn: number
  generatedAt: string
}

export const useClientCodes = (
  orders: Order[],
  token: string | null,
  userRole: string,
  lockerStatus: string | undefined
) => {
  const [clientCodes, setClientCodes] = useState<Record<number, ClientCodeData>>({})

  // Obtener códigos de cliente para órdenes "En el locker" cada 60 segundos
  useEffect(() => {
    if (!token || userRole !== 'client' || !lockerStatus) return

    const fetchClientCodes = async () => {
      const ordersInLocker = orders.filter(order => order.status === lockerStatus)
      
      const codePromises = ordersInLocker.map(async (order) => {
        try {
          const codeData = await orderService.getClientCode(order.id, token)
          return { orderId: order.id, codeData }
        } catch (error) {
          console.error(`Error obteniendo código para orden ${order.id}:`, error)
          return { orderId: order.id, codeData: null }
        }
      })

      const results = await Promise.all(codePromises)
      
      const newCodes: Record<number, ClientCodeData> = {}
      results.forEach(({ orderId, codeData }) => {
        if (codeData) {
          newCodes[orderId] = codeData
        }
      })
      
      setClientCodes(newCodes)
    }

    if (orders.length > 0) {
      fetchClientCodes()
    }

    const interval = setInterval(fetchClientCodes, 60000)
    return () => clearInterval(interval)
  }, [orders, token, userRole, lockerStatus])

  // Actualizar contador de expiración cada segundo y refrescar cuando expire
  useEffect(() => {
    if (!token || userRole !== 'client') return
    if (Object.keys(clientCodes).length === 0) return

    const interval = setInterval(() => {
      setClientCodes(prev => {
        const updated = { ...prev }
        let hasChanges = false
        const expiredOrderIds: number[] = []

        Object.keys(updated).forEach(orderIdStr => {
          const orderId = parseInt(orderIdStr)
          if (updated[orderId].expiresIn > 0) {
            updated[orderId] = {
              ...updated[orderId],
              expiresIn: updated[orderId].expiresIn - 1
            }
            hasChanges = true

            if (updated[orderId].expiresIn === 0) {
              expiredOrderIds.push(orderId)
            }
          }
        })

        if (expiredOrderIds.length > 0) {
          expiredOrderIds.forEach(async (orderId) => {
            try {
              const codeData = await orderService.getClientCode(orderId, token)
              if (codeData) {
                setClientCodes(current => ({
                  ...current,
                  [orderId]: codeData
                }))
              }
            } catch (error) {
              console.error(`Error obteniendo nuevo código para orden ${orderId}:`, error)
            }
          })
        }

        return hasChanges ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [clientCodes, token, userRole])

  return clientCodes
}
