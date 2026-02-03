export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  LOGIN_ADMIN: '/login/admin',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  CLIENTS: '/clients',
  LOCKERS: '/lockers',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const

export type RouteKey = keyof typeof ROUTES
