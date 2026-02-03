import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { User } from '../../shared/types'
import { authService } from './authService.ts'
import { UserRole } from '../../shared/constants/enums.ts'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string, role?: UserRole) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      } catch (err) {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setIsInitialized(true)
  }, [])

  const login = useCallback(async (username: string, password: string, role?: UserRole) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.login(username, password, role)
      if (result) {
        setUser(result.user)
        setToken(result.token)
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token', result.token)
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
    setToken(null)
    setError(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }, [])

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
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
