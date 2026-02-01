import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { User } from '../../shared/types'
import { authService } from './authService.ts'
import { UserRole } from '../../shared/constants/enums.ts'

interface AuthContextType {
  user: User | null
  login: (email: string, role: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        localStorage.removeItem('user')
      }
    }
    setIsInitialized(true)
  }, [])

  const login = useCallback(async (email: string, role: UserRole) => {
    setIsLoading(true)
    setError(null)
    try {
      const loggedUser = await authService.login(email, role)
      if (loggedUser) {
        setUser(loggedUser)
        localStorage.setItem('user', JSON.stringify(loggedUser))
      } else {
        throw new Error('Login fallido')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    localStorage.removeItem('user')
  }, [])

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    error,
    isInitialized,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
