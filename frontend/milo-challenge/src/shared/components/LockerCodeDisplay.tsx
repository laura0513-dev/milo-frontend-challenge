import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { Lock } from '@mui/icons-material'
import { lockerCodeDisplayStyles } from './styles/LockerCodeDisplay.styles.ts'

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
    <Paper sx={lockerCodeDisplayStyles.paper}>
      <Box sx={lockerCodeDisplayStyles.header}>
        <Lock sx={lockerCodeDisplayStyles.icon} />
        <Typography variant="subtitle2" fontWeight="bold" sx={lockerCodeDisplayStyles.title}>
          {title}
        </Typography>
      </Box>
      
      <Typography 
        variant="h4" 
        fontWeight="bold" 
        textAlign="center" 
        sx={lockerCodeDisplayStyles.code}
      >
        {code}
      </Typography>
      
      <Typography 
        variant="caption" 
        textAlign="center" 
        display="block"
        sx={lockerCodeDisplayStyles.expirationText(isUrgent)}
      >
        Expira en: {formatTime(expiresIn)}
      </Typography>
    </Paper>
  )
}
