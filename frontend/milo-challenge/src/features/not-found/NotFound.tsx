import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Container } from '@mui/material'
import { Error as ErrorIcon } from '@mui/icons-material'
import { ROUTES } from '../../shared/constants/routes.ts'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 3,
        }}
      >
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', opacity: 0.7 }} />
        <Typography variant="h2" fontWeight="bold" color="text.primary">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Página No Encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          La página que buscas no existe o ha sido eliminada.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          sx={{ mt: 2 }}
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Container>
  )
}

export default NotFound
