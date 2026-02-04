import React from 'react'
import { Chip } from '@mui/material'
import { ordersStyles } from '../Orders.styles.ts'

interface StatusBadgeProps {
  status: string | undefined
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles: Record<string, { 
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
    label: string 
  }> = {
    'En preparación': { color: 'info', label: 'En preparación' },
    'En camino': { color: 'warning', label: 'En camino' },
    'En el locker': { color: 'secondary', label: 'En el locker' },
    'Entregada': { color: 'success', label: 'Entregada' },
    'Cancelada': { color: 'error', label: 'Cancelada' },
  }

  const config = status ? styles[status] || styles['En preparación'] : styles['En preparación']

  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="small" 
      sx={ordersStyles.statusBadge} 
    />
  )
}
