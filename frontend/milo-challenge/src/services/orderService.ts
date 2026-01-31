import { MOCK_ORDERS } from '../data/mockData.ts'
import type { Order } from '../types.ts'
import { OrderStatus } from '../constants/enums.ts'

class OrderService {

  async getOrders(): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_ORDERS), 300)
    })
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ORDERS.filter((order) => order.userId === userId))
      }, 300)
    })
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ORDERS.find((order) => order.id === orderId) || null)
      }, 300)
    })
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = MOCK_ORDERS.find((o) => o.id === orderId)
        if (order) {
          order.status = status
          resolve(order)
        }
        resolve(null)
      }, 300)
    })
  }

}

export const orderService = new OrderService()
