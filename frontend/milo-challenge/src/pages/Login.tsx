import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import { Person, Lock, ArrowForward } from '@mui/icons-material'
import { 
  Box, 
  Button, 
  Container, 
  Paper, 
  TextField, 
  Typography, 
  InputAdornment, 
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Link,
  Fade
} from '@mui/material'

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'client'>('client')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email || (role === 'admin' ? 'admin@rappiclone.com' : 'client@rappiclone.com'), role)
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
        px: 2
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
              mb: 3
            }}
          >
            <Typography variant="h5" color="white" fontWeight="bold">R</Typography>
          </Box>
          <Typography variant="h4" fontWeight="800" color="text.primary" gutterBottom>
            Inicia Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            O <Link href="#" underline="hover" color="primary" fontWeight="medium">crea una cuenta nueva</Link>
          </Typography>
        </Box>

        <Fade in timeout={800}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@rappiclone.com' : 'client@rappiclone.com'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />

                <Box>
                  <Typography variant="body2" fontWeight="medium" gutterBottom color="text.secondary">
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
                  >
                    <ToggleButton value="client" sx={{ textTransform: 'none' }}>Cliente</ToggleButton>
                    <ToggleButton value="admin" sx={{ textTransform: 'none' }}>Administrador</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ py: 1.5, borderRadius: 50 }}
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