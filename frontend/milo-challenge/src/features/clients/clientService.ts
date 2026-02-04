/**
 * Servicio de API para Clientes/Usuarios
 * Frontend client para consumir endpoints de usuarios
 */

import type { User } from '../../shared/types.ts'

const API_BASE_URL = 'http://localhost:3000/api'

class ClientService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Realiza una petición HTTP genérica
   */
  private async request<T>(
    method: string,
    endpoint: string,
    token: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data.error || `Error ${response.status}`)
        throw error
      }

      return data
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error('Error de conexión. Verifica que el servidor esté disponible.')
      }
      throw error
    }
  }

  /**
   * Obtiene todos los usuarios/clientes (Admin)
   * GET /api/users
   */
  async getAllUsers(token: string): Promise<User[]> {
    return this.request<User[]>('GET', '/users', token)
  }

  /**
   * Obtiene un usuario específico por ID
   * GET /api/users/:id
   */
  async getUserById(id: string, token: string): Promise<User> {
    return this.request<User>('GET', `/users/${id}`, token)
  }
}

export const clientService = new ClientService()
