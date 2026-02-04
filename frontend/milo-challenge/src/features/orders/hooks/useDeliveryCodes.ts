import { useState, useEffect } from 'react'
import { Order } from '../../../shared/types.ts'
import { orderService } from '../orderService.ts'

interface DeliveryCodeData {
  code: string
  expiresIn: number
  generatedAt: string
}

export const useDeliveryCodes = (
  orders: Order[],
  token: string | null,
  userRole: string,
  transitStatus: string | undefined
) => {
  const [deliveryCodes, setDeliveryCodes] = useState<Record<number, DeliveryCodeData>>({})

  // Obtener códigos de delivery para órdenes "En camino" cada 60 segundos
  useEffect(() => {
    if (!token || userRole !== 'delivery' || !transitStatus) return

    const fetchDeliveryCodes = async () => {
      const ordersInTransit = orders.filter(order => order.status === transitStatus)
      
      const codePromises = ordersInTransit.map(async (order) => {
        try {
          const codeData = await orderService.getDeliveryCode(order.id, token)
          return { orderId: order.id, codeData }
        } catch (error) {
          console.error(`Error obteniendo código para orden ${order.id}:`, error)
          return { orderId: order.id, codeData: null }
        }
      })

      const results = await Promise.all(codePromises)
      
      const newCodes: Record<number, DeliveryCodeData> = {}
      results.forEach(({ orderId, codeData }) => {
        if (codeData) {
          newCodes[orderId] = codeData
        }
      })
      
      setDeliveryCodes(newCodes)
    }

    if (orders.length > 0) {
      fetchDeliveryCodes()
    }

    const interval = setInterval(fetchDeliveryCodes, 60000)
    return () => clearInterval(interval)
  }, [orders, token, userRole, transitStatus])

  // Actualizar contador de expiración cada segundo y refrescar cuando expire
  useEffect(() => {
    if (!token || userRole !== 'delivery') return
    if (Object.keys(deliveryCodes).length === 0) return

    const interval = setInterval(() => {
      setDeliveryCodes(prev => {
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
              const codeData = await orderService.getDeliveryCode(orderId, token)
              if (codeData) {
                setDeliveryCodes(current => ({
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
  }, [deliveryCodes, token, userRole])

  return deliveryCodes
}
