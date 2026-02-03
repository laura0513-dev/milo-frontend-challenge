import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Grid, Typography, Paper, Button, Chip, Divider, Stack } from '@mui/material'
import { 
  LocalShipping, 
  Assignment, 
  CheckCircle, 
  Add,
  LocationOn,
  AccessTime,
  DeliveryDining,
  Inventory,
  Person
} from '@mui/icons-material'
import { Order } from '../../../shared/types.ts'
import { CodeVerificationModal } from '../../../shared/components/CodeVerificationModal.tsx'
import { orderService } from '../../orders/orderService.ts'
import { useOrders } from '../../orders/OrdersContext.tsx'
import { useOrderStatuses } from '../../../shared/hooks/index.ts'
import { deliveryDashboardStyles } from './styles/DeliveryDashboard.styles.ts'

interface DeliveryDashboardProps {
  userId: string
  userName: string
  token?: string | null
}

const StatusBadge = ({ status }: { status: string | undefined }) => {
  const styles: Record<string, { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', label: string }> = {
    'En preparaci\u00f3n': { color: 'info', label: 'En preparaci\u00f3n' },
    'En camino': { color: 'warning', label: 'En camino' },
    'En el locker': { color: 'secondary', label: 'En el locker' },
    'Entregada': { color: 'success', label: 'Entregada' },
    'Cancelada': { color: 'error', label: 'Cancelada' },
  }

  const config = status ? styles[status] || styles['En preparaci\u00f3n'] : styles['En preparaci\u00f3n']

  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="small" 
      sx={{ fontWeight: 'bold' }} 
    />
  )
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({ userId, userName, token }) => {
  const navigate = useNavigate()
  const { orders: myDeliveries, refreshOrders } = useOrders()
  const { statuses } = useOrderStatuses()
  const [availableOrders, setAvailableOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [pendingOrderUpdate, setPendingOrderUpdate] = useState<{ orderId: number; newStatusId: number } | null>(null)

  useEffect(() => {
    loadOrders()
  }, [token, userId])

  const loadOrders = async () => {
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      // Refrescar mis entregas desde el contexto
      await refreshOrders()

      // Cargar órdenes disponibles (en preparación)
      const available = await orderService.getAvailableOrders(token)
      setAvailableOrders(available)
    } catch (error) {
      console.error('Error cargando órdenes:', error)
      setAvailableOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignOrder = async (orderId: number) => {
    if (!token) return
    
    try {
      // Asignar la orden al delivery actual
      await orderService.assignOrder(orderId, token)
      // Recargar las órdenes para reflejar el cambio
      await loadOrders()
    } catch (error) {
      console.error('Error asignando orden:', error)
      // TODO: Mostrar mensaje de error al usuario
    }
  }

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    if (!token) return

    // Si el nuevo estado es "En el locker" (3), requerir código
    if (newStatusId === 3) {
      setPendingOrderUpdate({ orderId, newStatusId })
      setCodeModalOpen(true)
      return
    }

    try {
      await orderService.updateOrder(orderId, { status_id: newStatusId }, token)
      await loadOrders()
    } catch (error) {
      console.error('Error actualizando estado:', error)
    }
  }

  const handleCodeVerify = async (code: string) => {
    // Validar código (simple: 123456)
    if (code !== '123456') {
      setCodeError('Código incorrecto. Intenta de nuevo.')
      return
    }

    if (pendingOrderUpdate && token) {
      try {
        await orderService.updateOrder(
          pendingOrderUpdate.orderId, 
          { status_id: pendingOrderUpdate.newStatusId }, 
          token
        )
        await loadOrders()
        setPendingOrderUpdate(null)
        setCodeModalOpen(false)
        setCodeError('')
      } catch (error) {
        console.error('Error actualizando orden:', error)
        setCodeError('Error al actualizar la orden')
      }
    }
  }

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders?highlight=${orderId}`)
  }

  const completedToday = statuses ? myDeliveries.filter(o => o.status === statuses.DELIVERED).length : 0
  const inProgress = statuses ? myDeliveries.filter(o => o.status === statuses.IN_TRANSIT || o.status === statuses.IN_LOCKER).length : 0

  return (
    <Box sx={deliveryDashboardStyles.container}>
      <Box sx={deliveryDashboardStyles.header}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            ¡Hola, {userName.split(' ')[0]}! 🚴
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Panel de Repartidor
          </Typography>
        </Box>
        <Box sx={deliveryDashboardStyles.statsContainer}>
          <Chip 
            icon={<Assignment />} 
            label={`${myDeliveries.length} Asignadas`} 
            color="primary" 
            sx={deliveryDashboardStyles.statChip}
          />
          <Chip 
            icon={<LocalShipping />} 
            label={`${inProgress} En curso`} 
            color="warning" 
            sx={deliveryDashboardStyles.statChip}
          />
          <Chip 
            icon={<CheckCircle />} 
            label={`${completedToday} Completadas`} 
            color="success" 
            sx={deliveryDashboardStyles.statChip}
          />
        </Box>
      </Box>

      {/* Mis Entregas Asignadas - Mostrar órdenes "En preparación" o "En camino" */}
      {statuses && myDeliveries.filter(order => order.status === statuses.PREPARING || order.status === statuses.IN_TRANSIT).length > 0 && (
        <Paper sx={deliveryDashboardStyles.sectionPaper}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Mis Entregas
            </Typography>
            <Chip 
              label={`${myDeliveries.filter(order => order.status === statuses.PREPARING || order.status === statuses.IN_TRANSIT).length} en progreso`} 
              size="small" 
              color="primary"
            />
          </Box>

          <Stack spacing={2}>
            {myDeliveries.filter(order => order.status === statuses.PREPARING || order.status === statuses.IN_TRANSIT).map((order) => (
              <Paper 
                key={order.id} 
                sx={{
                  ...deliveryDashboardStyles.orderCard,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
                elevation={0}
                onClick={() => handleViewOrder(order.id)}
              >
                <Box sx={deliveryDashboardStyles.orderHeader}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Orden #{order.id}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {order.usuario && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.primary">
                        {order.usuario}
                      </Typography>
                    </Box>
                  )}
                  {order.locker_address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.primary">
                        {order.locker_address}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={deliveryDashboardStyles.orderFooter}>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {statuses && order.status === statuses.IN_TRANSIT && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStatusChange(order.id, 3)
                        }}
                      >
                        Guardar en Locker
                      </Button>
                    )}
                    {statuses && order.status === statuses.IN_LOCKER && (
                      <Button
                        variant="outlined"
                        size="small"
                        disabled
                      >
                        En el locker (esperando cliente)
                      </Button>
                    )}
                    {statuses && order.status !== statuses.DELIVERED && order.status !== statuses.CANCELLED && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleStatusChange(order.id, 5)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Órdenes Disponibles para Tomar */}
      <Paper sx={deliveryDashboardStyles.sectionPaper}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Órdenes Disponibles (En Preparación)
          </Typography>
          <Chip 
            label={`${availableOrders.length} disponibles`} 
            size="small" 
            color="info"
          />
        </Box>

        {availableOrders.length === 0 ? (
          <Box sx={deliveryDashboardStyles.emptyState}>
            <Inventory sx={deliveryDashboardStyles.emptyIcon} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay órdenes disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Las nuevas órdenes en preparación aparecerán aquí
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {availableOrders.map((order) => (
              <Paper 
                key={order.id} 
                sx={deliveryDashboardStyles.orderCard}
                elevation={0}
              >
                <Box sx={deliveryDashboardStyles.orderHeader}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Orden #{order.id}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {order.usuario && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.primary">
                        Cliente: {order.usuario}
                      </Typography>
                    </Box>
                  )}
                  {order.locker_address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.primary">
                        Destino: {order.locker_address}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={deliveryDashboardStyles.orderFooter}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => handleAssignOrder(order.id)}
                  >
                    Tomar Orden
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      <CodeVerificationModal
        open={codeModalOpen}
        onClose={() => {
          setCodeModalOpen(false)
          setCodeError('')
        }}
        onVerify={handleCodeVerify}
        title="Verificar código de locker"
        description="Ingresa el código de 6 dígitos del locker para guardar la orden"
        errorMessage={codeError}
      />
    </Box>
  )
}
