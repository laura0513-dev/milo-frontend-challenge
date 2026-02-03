import React from 'react'
import { Box, Typography, Chip, Divider, Stack, Grid } from '@mui/material'
import { Order } from '../../../shared/types.ts'
import { CalendarToday, Person, LocationOn, AttachMoney, ListAlt } from '@mui/icons-material'

interface OrderDetailsProps {
  order: Order
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      preparing: { color: 'info' as const, label: 'En preparación' },
      in_transit: { color: 'warning' as const, label: 'En camino' },
      in_locker: { color: 'secondary' as const, label: 'En el locker' },
      delivered: { color: 'success' as const, label: 'Entregada' },
      cancelled: { color: 'error' as const, label: 'Cancelada' },
    }
    return configs[status] || configs.preparing
  }

  const statusConfig = getStatusConfig(order.status)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          #{order.id.toUpperCase()}
        </Typography>
        <Chip 
          label={statusConfig.label} 
          color={statusConfig.color} 
          sx={{ fontWeight: 'bold' }} 
        />
      </Box>

      <Divider />

      {/* Information Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Fecha de pedido
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {new Date(order.date).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                ID Cliente
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {order.userId}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <LocationOn sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Locker
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {order.lockerId || 'No asignado'}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <AttachMoney sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                ${order.total.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
