import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingStateProps {
  message?: string
  fullHeight?: boolean
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Cargando...',
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
    }}
  >
    <CircularProgress />
    <Typography color="text.secondary">{message}</Typography>
  </Box>
)
