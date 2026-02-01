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
      pending: { color: 'warning' as const, label: 'Pendiente' },
      preparing: { color: 'info' as const, label: 'Preparando' },
      ready: { color: 'secondary' as const, label: 'Listo' },
      delivered: { color: 'success' as const, label: 'Entregado' },
      cancelled: { color: 'error' as const, label: 'Cancelado' },
    }
    return configs[status] || configs.pending
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

      <Divider />

      {/* Items */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <ListAlt sx={{ color: 'text.secondary', fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Items del pedido
          </Typography>
        </Box>
        <Stack spacing={1.5}>
          {order.items.map((item, idx) => (
            <Box 
              key={idx}
              sx={{ 
                p: 2, 
                bgcolor: 'action.hover', 
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body1">{item}</Typography>
              <Chip 
                label={`#${idx + 1}`} 
                size="small" 
                variant="outlined"
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
