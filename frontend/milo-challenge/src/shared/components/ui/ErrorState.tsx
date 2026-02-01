import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { Error as ErrorIcon } from '@mui/icons-material'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  fullHeight?: boolean
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message = 'Ocurrió un error inesperado',
  onRetry,
  fullHeight = false,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
      height: fullHeight ? '100vh' : 'auto',
      p: 3,
      textAlign: 'center',
    }}
  >
    <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />
    <Typography variant="h5" fontWeight="bold" color="text.primary">
      {title}
    </Typography>
    <Typography color="text.secondary">{message}</Typography>
    {onRetry && (
      <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
        Reintentar
      </Button>
    )}
  </Box>
)
