import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.tsx'
import { ROUTES } from '../../shared/constants/routes.ts'
import { UserRole } from '../../shared/constants/enums.ts'
import { Person, Lock, ArrowForward, Visibility, VisibilityOff } from '@mui/icons-material'
import { loginStyles } from './Login.styles.ts'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Link,
  Fade,
  Alert,
  IconButton,
} from '@mui/material'

interface FormErrors {
  email?: string
  password?: string
}

const Login: React.FC = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT)
  const [formErrors, setFormErrors] = useState<FormErrors>({})

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!email.trim()) {
      errors.email = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ingresa un correo electrónico válido'
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
      const emailToUse = email || (role === UserRole.DELIVERY ? 'delivery@rappiclone.com' : 'client@rappiclone.com')
      await login(emailToUse, password, role)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      // Error manejado por el contexto
      console.error('Login error:', err)
    }
  }

  return (
    <Box sx={loginStyles.mainContainer}>
      <Container maxWidth="xs">
        <Box sx={loginStyles.headerBox}>
          <Box sx={loginStyles.iconBox}>
            <Typography variant="h5" sx={loginStyles.iconText}>
              R
            </Typography>
          </Box>
          <Typography variant="h4" sx={loginStyles.title} color="text.primary" gutterBottom>
            Inicia Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O{' '}
            <Link href="#" underline="hover" color="primary" fontWeight="medium">
              crea una cuenta nueva
            </Link>
          </Typography>
        </Box>

        <Fade in timeout={800}>
          <Paper elevation={0} sx={loginStyles.paper}>
            {error && (
              <Alert severity="error" sx={loginStyles.alert}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">
              <Box sx={loginStyles.formBox}>
                <TextField
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (formErrors.email) setFormErrors({ ...formErrors, email: undefined })
                  }}
                  placeholder={
                    role === UserRole.DELIVERY
                      ? 'delivery@rappiclone.com'
                      : 'client@rappiclone.com'
                  }
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  aria-label="Ingrese su correo electrónico"
                  aria-required="true"
                  aria-invalid={!!formErrors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={loginStyles.inputAdornment} />
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
                  aria-label="Ingrese su contraseña"
                  aria-required="true"
                  aria-invalid={!!formErrors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={loginStyles.inputAdornment} />
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

                <Box>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    gutterBottom
                    color="text.secondary"
                    id="user-role-label"
                  >
                    Tipo de Usuario
                  </Typography>
                  <ToggleButtonGroup
                    value={role}
                    exclusive
                    onChange={(e, newRole) => {
                      if (newRole) setRole(newRole)
                    }}
                    fullWidth
                    color="primary"
                    size="small"
                    disabled={isLoading}
                    aria-labelledby="user-role-label"
                    aria-label="Seleccione su tipo de usuario"
                  >
                    <ToggleButton value={UserRole.CLIENT} sx={loginStyles.toggleButton} aria-label="Iniciar sesión como cliente">
                      Cliente
                    </ToggleButton>
                    <ToggleButton value={UserRole.DELIVERY} sx={loginStyles.toggleButton} aria-label="Iniciar sesión como repartidor">
                      Repartidor
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={loginStyles.submitButton}
                  disabled={isLoading}
                  aria-label={isLoading ? 'Iniciando sesión, por favor espere' : 'Iniciar sesión en la aplicación'}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default Login