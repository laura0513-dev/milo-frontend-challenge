import React, { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import { UserRole } from '../constants/enums.ts'
import { Box, CircularProgress } from '@mui/material'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { isAuthenticated, user, isInitialized } = useAuth()
  const navigate = useNavigate()

  // Si tiene roles requeridos y no coinciden, usar useEffect para navegar
  useEffect(() => {
    if (isInitialized && isAuthenticated && requiredRoles && user && !requiredRoles.includes(user.role)) {
      navigate('/dashboard', { replace: true })
    }
  }, []) // Solo ejecutar una vez al montar el componente

  // Si aún se está inicializando (la primera vez), mostrar loading
  if (!isInitialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Si no está autenticado después de la inicialización, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si tiene roles requeridos y no coinciden, mostrar loading mientras se redirige
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Si todo está bien, renderizar el contenido
  return children ? <>{children}</> : null
}
