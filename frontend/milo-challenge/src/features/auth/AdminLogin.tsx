import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.tsx'
import { ROUTES } from '../../shared/constants/routes.ts'
import { UserRole } from '../../shared/constants/enums.ts'
import { Person, Lock, ArrowForward, AdminPanelSettings, Visibility, VisibilityOff } from '@mui/icons-material'
import { adminLoginStyles } from './AdminLogin.styles.ts'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Link,
  Fade,
  Alert,
  IconButton,
} from '@mui/material'

interface FormErrors {
  username?: string
  password?: string
}

const AdminLogin: React.FC = () => {
  const { login, isLoading, error, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Si ya está autenticado y es admin, redirigir al dashboard
  if (isAuthenticated && user?.role === UserRole.ADMIN) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  // Si está autenticado pero no es admin, redirigir al login normal
  if (isAuthenticated && user?.role !== UserRole.ADMIN) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!username.trim()) {
      errors.username = 'El nombre de usuario es requerido'
    } else if (username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }

    if (!password) {
      errors.password = 'La contraseña es requerida'
    } else if (password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const usernameToUse = username || 'admin_user'
      await login(usernameToUse, password, UserRole.ADMIN)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <Box sx={adminLoginStyles.mainContainer}>
      <Container maxWidth="xs">
        <Box sx={adminLoginStyles.headerBox}>
          <Box sx={adminLoginStyles.iconBox}>
            <AdminPanelSettings sx={adminLoginStyles.iconStyle} />
          </Box>
          <Typography variant="h4" sx={adminLoginStyles.title} color="text.primary" gutterBottom>
            Acceso Administrativo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Solo personal autorizado
          </Typography>
        </Box>

        <Fade in timeout={800}>
          <Paper elevation={0} sx={adminLoginStyles.paper}>
            {error && (
              <Alert severity="error" sx={adminLoginStyles.alert}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión administrativo">
              <Box sx={adminLoginStyles.formBox}>
                <TextField
                  fullWidth
                  id="username"
                  label="Usuario Administrativo"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    if (formErrors.username) setFormErrors({ ...formErrors, username: undefined })
                  }}
                  placeholder="admin_user"
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  aria-label="Ingrese su nombre de usuario administrativo"
                  aria-required="true"
                  aria-invalid={!!formErrors.username}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={adminLoginStyles.inputAdornment} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  disabled={isLoading}
                />

                <TextField
                  fullWidth
                  id="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (formErrors.password) setFormErrors({ ...formErrors, password: undefined })
                  }}
                  placeholder="Ingresa tu contraseña"
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  aria-label="Ingrese su contraseña de administrador"
                  aria-required="true"
                  aria-invalid={!!formErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={adminLoginStyles.inputAdornment} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={isLoading}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  disabled={isLoading}
                />

                <Alert severity="info" sx={adminLoginStyles.infoAlert}>
                  Solo usuarios con rol de Administrador pueden acceder a este portal
                </Alert>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  color="error"
                  endIcon={<ArrowForward />}
                  sx={adminLoginStyles.submitButton}
                  disabled={isLoading}
                  aria-label={isLoading ? 'Verificando credenciales de administrador' : 'Acceder al panel administrativo'}
                >
                  {isLoading ? 'Verificando...' : 'Acceder'}
                </Button>

                <Box sx={adminLoginStyles.linkBox}>
                  <Link 
                    onClick={() => navigate(ROUTES.LOGIN)} 
                    underline="hover" 
                    color="primary" 
                    fontWeight="medium"
                    sx={adminLoginStyles.link}
                    aria-label="Volver al formulario de inicio de sesión normal"
                  >
                    ← Volver al login normal
                  </Link>
                </Box>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default AdminLogin
