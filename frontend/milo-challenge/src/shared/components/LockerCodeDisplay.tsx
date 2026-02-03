import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { Lock } from '@mui/icons-material'

interface LockerCodeDisplayProps {
  code: string
  expiresIn: number
  title?: string
}

export const LockerCodeDisplay: React.FC<LockerCodeDisplayProps> = ({ 
  code, 
  expiresIn,
  title = 'Código del Locker'
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isUrgent = expiresIn < 10

  return (
    <Paper 
      sx={{ 
        p: 2, 
        bgcolor: 'warning.main',
        color: 'white',
        mt: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Lock sx={{ fontSize: 20 }} />
        <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        textAlign="center" 
        sx={{ 
          letterSpacing: 4,
          color: 'white',
          my: 1
        }}
      >
        {code}
      </Typography>
      
      <Typography 
        variant="caption" 
        textAlign="center" 
        display="block"
        sx={{ 
          color: 'white',
          fontWeight: isUrgent ? 'bold' : 'normal',
          textDecoration: isUrgent ? 'underline' : 'none'
        }}
      >
        Expira en: {formatTime(expiresIn)}
      </Typography>
    </Paper>
  )
}
