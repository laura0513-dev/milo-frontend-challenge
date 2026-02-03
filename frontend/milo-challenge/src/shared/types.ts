import { UserRole, OrderStatus, LockerStatus, LockerCapacity } from './constants/enums'

export type { UserRole, OrderStatus, LockerStatus, LockerCapacity }

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  phone?: string
  address?: string
}

export interface Locker {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  created_by: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface LockerNearby extends Locker {
  distance: number // en km
}

export interface CreateLockerRequest {
  name: string
  address: string
  latitude: number
  longitude: number
  created_by: number
}

export interface UpdateLockerRequest {
  name?: string
  address?: string
  latitude?: number
  longitude?: number
  is_active?: boolean
}

export interface ApiError {
  message: string
  status: number
  endpoint?: string
}

// Request para crear orden
export interface CreateOrderRequest {
  user_id: number
  locker_id: number
}

// Request para actualizar orden
export interface UpdateOrderRequest {
  status_id: number
}

// Respuesta del backend para órdenes
export interface Order {
  id: number
  user_id?: number
  locker_id?: number
  status_id?: number
  created_at?: string
  updated_at?: string
  // Campos enriquecidos que vienen del GET
  usuario?: string
  locker_address?: string
  status?: string
  date?: string // Para compatibilidad con dashboard
  delivery_code?: string // Código del locker generado por el backend
  // Campos adicionales para delivery
  cliente_name?: string
  cliente_email?: string
  cliente_address?: string
  latitude?: number
  longitude?: number
}

export interface DeliveryCode {
  code: string
  expiresIn: number // segundos restantes
  generatedAt: string
}
