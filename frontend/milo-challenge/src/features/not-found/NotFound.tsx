import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Container } from '@mui/material'
import { Error as ErrorIcon } from '@mui/icons-material'
import { ROUTES } from '../../shared/constants/routes.ts'
import { notFoundStyles } from './NotFound.styles.ts'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="sm">
      <Box sx={notFoundStyles.container}>
        <ErrorIcon sx={notFoundStyles.icon} />
        <Typography variant="h2" fontWeight="bold" color="text.primary">
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Página No Encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={notFoundStyles.description}>
          La página que buscas no existe o ha sido eliminada.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          sx={notFoundStyles.button}
        >
          Volver al Dashboard
        </Button>
      </Box>
    </Container>
  )
}

export default NotFound
