
import { useAuth } from '../context/AuthContext.tsx'
import { UserRole } from '../constants/enums.ts'

export const useCurrentUser = () => {
  const { user } = useAuth()

  const isAdmin = user?.role === UserRole.ADMIN
  const isClient = user?.role === UserRole.CLIENT

  const hasRole = (role: UserRole): boolean => user?.role === role

  const hasAnyRole = (roles: UserRole[]): boolean => user ? roles.includes(user.role) : false

  return {
    user,
    isAdmin,
    isClient,
    hasRole,
    hasAnyRole,
  }
}
