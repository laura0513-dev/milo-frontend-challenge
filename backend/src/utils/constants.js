/**
 * Order Status Constants
 * These are the canonical status values used across the API
 * Frontend should translate these to user-friendly text
 */
const ORDER_STATUSES = {
  PREPARING: 'En preparación',        // Order is being prepared
  IN_TRANSIT: 'En camino',             // Delivery on the way to locker
  IN_LOCKER: 'En el locker',           // Package in the locker, awaiting pickup
  DELIVERED: 'Entregada',              // Successfully delivered to customer
  CANCELLED: 'Cancelada'               // Order was cancelled
}

/**
 * API Response Status Constants
 * Use these for consistent error/success responses
 */
const RESPONSE_STATUSES = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending'
}

/**
 * User Roles
 */
const USER_ROLES = {
  ADMIN: 'admin',
  CLIENT: 'cliente',
  DELIVERY: 'delivery'
}

module.exports = {
  ORDER_STATUSES,
  RESPONSE_STATUSES,
  USER_ROLES
}
