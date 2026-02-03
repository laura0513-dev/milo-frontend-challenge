const API_BASE_URL = 'http://localhost:3000/api'

export interface OrderStatuses {
  PREPARING: string
  IN_TRANSIT: string
  IN_LOCKER: string
  DELIVERED: string
  CANCELLED: string
}

class StatusService {
  /**
   * Obtiene las constantes de estados de órdenes desde el backend
   * GET /api/orders/config/statuses
   */
  async getOrderStatuses(token: string): Promise<OrderStatuses> {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/config/statuses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get statuses failed:', response.statusText)
        // Retornar fallback si falla
        return this.getFallbackStatuses()
      }

      const data = await response.json()
      return data.statuses as OrderStatuses
    } catch (error) {
      console.error('Get statuses error:', error)
      // Retornar fallback si falla
      return this.getFallbackStatuses()
    }
  }

  /**
   * Retorna estados por defecto en caso de error
   */
  private getFallbackStatuses(): OrderStatuses {
    return {
      PREPARING: 'En preparación',
      IN_TRANSIT: 'En camino',
      IN_LOCKER: 'En el locker',
      DELIVERED: 'Entregada',
      CANCELLED: 'Cancelada',
    }
  }
}

export const statusService = new StatusService()
