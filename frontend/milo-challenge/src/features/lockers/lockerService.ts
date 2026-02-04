/**
 * Servicio de API para Lockers
 * Frontend client para consumir endpoints de Lockers
 */

import type { Locker, LockerNearby, CreateLockerRequest, UpdateLockerRequest, ApiError } from '../../shared/types.ts'

const API_BASE_URL = 'http://localhost:3000/api'

class LockerService {
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
    const url = `${this.baseUrl}/lockers${endpoint}`
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
   * Obtiene TODOS los lockers (Admin)
   * GET /api/lockers
   */
  async getAllLockers(token: string): Promise<Locker[]> {
    return this.request<Locker[]>('GET', '', token)
  }

  /**
   * Obtiene un locker específico por ID (Admin)
   * GET /api/lockers/:id
   */
  async getLockerById(id: number, token: string): Promise<Locker> {
    return this.request<Locker>('GET', `/${id}`, token)
  }

  /**
   * Obtiene lockers cercanos a una ubicación (Cualquier usuario autenticado)
   * GET /api/lockers/nearby/:lat/:lng
   * Radio fijo: 5 km
   */
  async getLockersByDistance(
    latitude: number,
    longitude: number,
    token: string
  ): Promise<LockerNearby[]> {
    this.validateCoordinates(latitude, longitude)
    
    const response = await this.request<{
      searchLocation: { latitude: number; longitude: number }
      radius: number
      count: number
      lockers: LockerNearby[]
    }>(
      'GET',
      `/nearby/${latitude}/${longitude}`,
      token
    )
    
    return response.lockers
  }

  /**
   * Crea un nuevo locker (Admin)
   * POST /api/lockers
   */
  async createLocker(locker: CreateLockerRequest, token: string): Promise<Locker> {
    this.validateCreateLockerData(locker)
    return this.request<Locker>('POST', '', token, locker)
  }

  /**
   * Actualiza un locker existente (Admin)
   * PUT /api/lockers/:id
   */
  async updateLocker(
    id: number,
    updates: UpdateLockerRequest,
    token: string
  ): Promise<Locker> {
    if (Object.keys(updates).length === 0) {
      throw new Error('Debes proporcionar al menos un campo para actualizar')
    }
    return this.request<Locker>('PUT', `/${id}`, token, updates)
  }

  /**
   * Elimina un locker (Admin)
   * DELETE /api/lockers/:id
   */
  async deleteLocker(id: number, token: string): Promise<{ message: string; id: number }> {
    return this.request<{ message: string; id: number }>('DELETE', `/${id}`, token)
  }

  // ==================== VALIDACIONES ====================

  /**
   * Valida coordenadas geográficas
   */
  private validateCoordinates(lat: number, lng: number): void {
    if (lat < -90 || lat > 90) {
      throw new Error('Latitud debe estar entre -90 y 90')
    }
    if (lng < -180 || lng > 180) {
      throw new Error('Longitud debe estar entre -180 y 180')
    }
  }

  /**
   * Valida radio de búsqueda
   */
  private validateRadius(radius: number): void {
    if (radius <= 0 || radius > 100) {
      throw new Error('Radio debe estar entre 0.1 y 100 km')
    }
  }

  /**
   * Valida datos para crear locker
   */
  private validateCreateLockerData(locker: CreateLockerRequest): void {
    if (!locker.name || locker.name.trim().length === 0) {
      throw new Error('El nombre del locker es requerido')
    }
    if (!locker.address || locker.address.trim().length === 0) {
      throw new Error('La dirección es requerida')
    }
    if (locker.latitude === undefined || locker.longitude === undefined) {
      throw new Error('Las coordenadas (latitud y longitud) son requeridas')
    }
    if (!locker.created_by || locker.created_by <= 0) {
      throw new Error('El ID del creador es requerido')
    }
    this.validateCoordinates(locker.latitude, locker.longitude)
  }
}

export const lockerService = new LockerService()
