import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import { ROUTES } from '../constants/routes.ts'
import { UserRole } from '../constants/enums.ts'
import { Person, Lock, ArrowForward } from '@mui/icons-material'
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
} from '@mui/material'

const Login: React.FC = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT)

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const emailToUse = email || (role === UserRole.ADMIN ? 'admin@rappiclone.com' : 'client@rappiclone.com')
      await login(emailToUse, role)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      // Error manejado por el contexto
      console.error('Login error:', err)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              borderRadius: 3,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 3,
              mb: 3,
            }}
          >
            <Typography variant="h5" color="white" fontWeight="bold">
              R
            </Typography>
          </Box>
          <Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
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
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === UserRole.ADMIN
                      ? 'admin@rappiclone.com'
                      : 'client@rappiclone.com'
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
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
                  >
                    Tipo de Usuario (Demo)
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
                  >
                    <ToggleButton value={UserRole.CLIENT} sx={{ textTransform: 'none' }}>
                      Cliente
                    </ToggleButton>
                    <ToggleButton value={UserRole.ADMIN} sx={{ textTransform: 'none' }}>
                      Administrador
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ py: 1.5, borderRadius: 50 }}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Ingresar
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