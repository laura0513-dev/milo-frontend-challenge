export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum LockerStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
}

export enum LockerCapacity {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export const UI_MESSAGES = {
  WELCOME: 'Bienvenido',
  LOGIN_REQUIRED: 'Debes iniciar sesión',
  UNAUTHORIZED: 'No tienes permiso para acceder a este recurso',
  LOGOUT_SUCCESS: 'Has cerrado sesión correctamente',
  ERROR_LOADING: 'Error al cargar los datos',
} as const
