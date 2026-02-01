export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  CLIENTS: '/clients',
  LOCKERS: '/lockers',
  PROFILE: '/profile',
  NOT_FOUND: '*',
} as const

export type RouteKey = keyof typeof ROUTES
