import React from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import { usePageLoading } from '../hooks/usePageLoading.ts'
import { LoadingState } from '../components/ui/index.ts'
import { MOCK_ORDERS } from '../data/mockData.ts'
import { Order } from '../types.ts'
import { Search, FilterList, MoreVert, Add } from '@mui/icons-material'
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  InputBase, 
  IconButton, 
  Chip, 
  Divider, 
  Stack 
} from '@mui/material'

const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const styles: Record<string, { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', label: string }> = {
    pending: { color: 'warning', label: 'Pendiente' },
    preparing: { color: 'info', label: 'Preparando' },
    ready: { color: 'secondary', label: 'Listo' },
    delivered: { color: 'success', label: 'Entregado' },
    cancelled: { color: 'error', label: 'Cancelado' },
  }

  const config = styles[status] || styles.pending

  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="small" 
      sx={{ fontWeight: 'bold' }} 
    />
  )
}

const Orders = () => {
  const { user } = useAuth()
  const isLoading = usePageLoading()
  
  if (!user) return null

  if (isLoading) {
    return <LoadingState message="Cargando órdenes..." />
  }

  const orders = user.role === 'admin' 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(o => o.userId === user.id)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {user.role === 'admin' ? 'Gestión de Órdenes' : 'Mis Pedidos'}
        </Typography>
        {user.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={{ boxShadow: 2 }}
          >
            Nueva Orden
          </Button>
        )}
      </Box>

      {/* Filters and Search */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Paper 
          component="form" 
          sx={{ 
            p: '2px 4px', 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1, 
            borderRadius: 3, 
            boxShadow: 0, 
            border: '1px solid', 
            borderColor: 'divider' 
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <Search sx={{ color: 'text.secondary' }} />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar por #ID, cliente..."
            inputProps={{ 'aria-label': 'search orders' }}
          />
        </Paper>
        <IconButton 
          sx={{ 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 3 
          }}
        >
          <FilterList />
        </IconButton>
      </Box>

      {/* Orders List */}
      <Stack spacing={2}>
        {orders.map((order) => (
          <Paper 
            key={order.id} 
            sx={{ 
              p: 3, 
              border: '1px solid', 
              borderColor: 'divider', 
              '&:hover': { borderColor: 'primary.main' }, 
              transition: 'all 0.2s' 
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">#{order.id.toUpperCase()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.date).toLocaleDateString()}
                </Typography>
              </Box>
              <StatusBadge status={order.status} />
            </Box>
            
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              {order.items.map((item, idx) => (
                <Typography key={idx} variant="body2" color="text.primary">
                  {item}
                </Typography>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total</Typography>
                <Typography variant="h6" fontWeight="bold">${order.total.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                 {user.role === 'client' && order.status === 'pending' && (
                    <Button variant="outlined" color="error" size="small">
                       Cancelar
                    </Button>
                 )}
                 {user.role === 'admin' && (
                   <IconButton size="small">
                     <MoreVert />
                   </IconButton>
                 )}
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default Orders;
