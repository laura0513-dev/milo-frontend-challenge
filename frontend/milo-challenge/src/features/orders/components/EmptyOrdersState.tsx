import React from 'react'
import { Paper, Typography, Button } from '@mui/material'
import { Add } from '@mui/icons-material'

interface EmptyOrdersStateProps {
  canCreateOrder: boolean
  onCreateOrder: () => void
}

export const EmptyOrdersState: React.FC<EmptyOrdersStateProps> = ({ 
  canCreateOrder, 
  onCreateOrder 
}) => {
  return (
    <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No tienes ninguna orden activa
      </Typography>
      {canCreateOrder && (
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ mt: 2 }}
          onClick={onCreateOrder}
          aria-label="Crear su primera orden"
        >
          Crear Primera Orden
        </Button>
      )}
    </Paper>
  )
}
