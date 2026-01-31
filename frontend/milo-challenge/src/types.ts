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
  id: string
  code: string
  location: string
  status: LockerStatus
  capacity: LockerCapacity
}

export interface Order {
  id: string
  userId: string
  items: string[] // Simplification for demo
  total: number
  status: OrderStatus
  lockerId?: string // If delivered to a locker
  date: string
}
