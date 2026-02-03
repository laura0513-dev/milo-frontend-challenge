import type { Order, CreateOrderRequest, UpdateOrderRequest } from '../../shared/types.ts'

const API_BASE_URL = 'http://localhost:3000/api'

class OrderService {
  /**
   * Obtiene todas las órdenes
   * - Admin: ve todas las órdenes
   * - Cliente: ve solo sus órdenes
   * - Delivery: ve solo sus entregas asignadas
   * GET /api/orders
   */
  async getOrders(token: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get orders failed:', response.statusText)
        return []
      }

      const data = await response.json()
      return data as Order[]
    } catch (error) {
      console.error('Get orders error:', error)
      return []
    }
  }

  /**
   * Obtiene órdenes de un usuario específico
   * GET /api/orders/user/:user_id
   */
  async getOrdersByUserId(userId: number, token: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get orders by user failed:', response.statusText)
        return []
      }

      const data = await response.json()
      return data as Order[]
    } catch (error) {
      console.error('Get orders by user error:', error)
      return []
    }
  }

  /**
   * Obtiene órdenes disponibles para asignar (solo delivery)
   * GET /api/orders/available
   */
  async getAvailableOrders(token: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/available`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get available orders failed:', response.statusText)
        return []
      }

      const data = await response.json()
      return data as Order[]
    } catch (error) {
      console.error('Get available orders error:', error)
      return []
    }
  }

  /**
   * Obtiene las entregas del delivery actual
   * GET /api/orders/my-deliveries
   */
  async getMyDeliveries(token: string): Promise<Order[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/my-deliveries`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get my deliveries failed:', response.statusText)
        return []
      }

      const data = await response.json()
      return data as Order[]
    } catch (error) {
      console.error('Get my deliveries error:', error)
      return []
    }
  }

  /**
   * Crea una nueva orden
   * POST /api/orders
   * Body: { user_id: number, locker_id: number, status_id: number }
   */
  async createOrder(orderData: CreateOrderRequest, token: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Create order failed:', errorData.error || response.statusText)
        throw new Error(errorData.error || 'Error al crear la orden')
      }

      const data = await response.json()
      return data as Order
    } catch (error) {
      console.error('Create order error:', error)
      throw error
    }
  }

  /**
   * Cambia el estado de una orden
   * PUT /api/orders/:id/status
   * Body: { status: string, deliveryCode?: string }
   */
  async updateOrderStatus(
    orderId: number, 
    status: string, 
    deliveryCode: string | undefined, 
    token: string
  ): Promise<Order | null> {
    try {
      const body: { status: string; deliveryCode?: string } = { status }
      if (deliveryCode) {
        body.deliveryCode = deliveryCode
      }

      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update order status failed:', errorData.error || errorData.message || response.statusText)
        throw new Error(errorData.error || errorData.message || 'Error al actualizar el estado de la orden')
      }

      const data = await response.json()
      return data.order as Order
    } catch (error) {
      console.error('Update order status error:', error)
      throw error
    }
  }

  /**
   * Actualiza el estado de una orden (método legacy)
   * PUT /api/orders/:id
   * Body: { status_id: number }
   * @deprecated Usar updateOrderStatus en su lugar
   */
  async updateOrder(orderId: number, updateData: UpdateOrderRequest, token: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Update order failed:', errorData.error || response.statusText)
        throw new Error(errorData.error || 'Error al actualizar la orden')
      }

      const data = await response.json()
      return data as Order
    } catch (error) {
      console.error('Update order error:', error)
      throw error
    }
  }

  /**
   * Asigna una orden al delivery actual
   * POST /api/orders/:id/assign
   */
  async assignOrder(orderId: number, token: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Assign order failed:', errorData.error || response.statusText)
        throw new Error(errorData.error || 'Error al asignar la orden')
      }

      const data = await response.json()
      return data as Order
    } catch (error) {
      console.error('Assign order error:', error)
      throw error
    }
  }

  /**
   * Elimina una orden
   * DELETE /api/orders/:id
   */
  async deleteOrder(orderId: number, token: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Delete order failed:', response.statusText)
        return false
      }

      return true
    } catch (error) {
      console.error('Delete order error:', error)
      return false
    }
  }

  /**
   * Obtiene el código de delivery para una orden en camino
   * GET /api/orders/:id/delivery-code
   */
  async getDeliveryCode(orderId: number, token: string): Promise<{ code: string; expiresIn: number; generatedAt: string } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/delivery-code`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get delivery code failed:', response.statusText)
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Get delivery code error:', error)
      return null
    }
  }

  /**
   * Obtiene el código del cliente para recoger una orden en el locker
   * GET /api/orders/:id/client-code
   */
  async getClientCode(orderId: number, token: string): Promise<{ code: string; expiresIn: number; generatedAt: string } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/client-code`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get client code failed:', response.statusText)
        return null
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Get client code error:', error)
      return null
    }
  }

  /**
   * Confirma la recogida del paquete por parte del cliente
   * POST /api/orders/:id/confirm-pickup
   */
  async confirmPickup(orderId: number, clientCode: string, token: string): Promise<Order | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm-pickup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientCode }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Confirm pickup failed:', errorData.error || response.statusText)
        throw new Error(errorData.error || 'Error al confirmar la recogida')
      }

      const data = await response.json()
      return data.order as Order
    } catch (error) {
      console.error('Confirm pickup error:', error)
      throw error
    }
  }

}

export const orderService = new OrderService()
