import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inventory2 } from '@mui/icons-material'
import { ROUTES } from '../../../shared/constants/routes.ts'
import { useOrderStatuses } from '../../../shared/hooks/index.ts'
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardMedia,
  Chip,
  LinearProgress,
  Button,
  Stack,
} from '@mui/material'
import { Order } from '../../../shared/types.ts'
import { CodeVerificationModal } from '../../../shared/components/CodeVerificationModal.tsx'
import { LockerCodeDisplay } from '../../../shared/components/LockerCodeDisplay.tsx'
import { orderService } from '../../orders/orderService.ts'
import { ASSETS } from '../../../shared/constants/assets.ts'
import { clientDashboardStyles } from './styles/ClientDashboard.styles.ts'

interface ClientDashboardProps {
  userName: string
  userId?: string
  token?: string | null
}

const getStatusInfo = (status: string) => {
  const info: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
    'En preparación': { label: 'En preparación', color: 'info' },
    'En camino': { label: 'En camino', color: 'warning' },
    'En el locker': { label: 'En el locker', color: 'secondary' },
    'Entregada': { label: 'Entregada', color: 'success' },
    'Cancelada': { label: 'Cancelada', color: 'error' },
  }
  return info[status] || { label: status, color: 'default' }
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ userName, userId = 'client1', token }) => {
  const navigate = useNavigate()
  const { statuses } = useOrderStatuses()
  const [orders, setOrders] = useState<Order[]>([])
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null)
  const [clientCode, setClientCode] = useState<{ code: string; expiresIn: number; generatedAt: string } | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      if (!token || !userId) {
        return
      }

      try {
        const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : userId
        const fetchedOrders = await orderService.getOrdersByUserId(userIdNum, token)
        setOrders(fetchedOrders)
      } catch (error) {
        console.error('Error cargando órdenes:', error)
        setOrders([])
      }
    }

    loadOrders()
  }, [token, userId])

  const activeOrders = useMemo(() => 
    statuses ? orders.filter(o => o.status === statuses.PREPARING || o.status === statuses.IN_TRANSIT || o.status === statuses.IN_LOCKER) : [],
    [orders, statuses]
  )
  
  const pastOrders = useMemo(() => 
    statuses ? orders.filter(o => o.status === statuses.DELIVERED || o.status === statuses.CANCELLED) : [],
    [orders, statuses]
  )

  // Obtener código del cliente cuando una orden está en el locker
  useEffect(() => {
    if (!token || !statuses) return
    
    const lockerOrder = activeOrders.find(o => o.status === statuses.IN_LOCKER)
    if (!lockerOrder) {
      setClientCode(null)
      return
    }

    const fetchClientCode = async () => {
      try {
        const codeData = await orderService.getClientCode(lockerOrder.id, token)
        if (codeData) {
          setClientCode(codeData)
        }
      } catch (error) {
        console.error('Error obteniendo código de cliente:', error)
      }
    }

    fetchClientCode()
    const interval = setInterval(fetchClientCode, 60000)

    return () => clearInterval(interval)
  }, [activeOrders, token, statuses])

  // Actualizar contador de expiración del código
  useEffect(() => {
    if (!clientCode || !token) return

    const interval = setInterval(() => {
      setClientCode(prev => {
        if (!prev) return prev
        if (prev.expiresIn > 0) {
          const updated = { ...prev, expiresIn: prev.expiresIn - 1 }
          
          // Si expiró, obtener uno nuevo
          if (updated.expiresIn === 0) {
            const lockerOrder = activeOrders.find(o => statuses && o.status === statuses.IN_LOCKER)
            if (lockerOrder) {
              orderService.getClientCode(lockerOrder.id, token)
                .then(codeData => {
                  if (codeData) setClientCode(codeData)
                })
                .catch(error => console.error('Error refrescando código:', error))
            }
          }
          
          return updated
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [clientCode, token, activeOrders, statuses])

  const handleReceiveOrder = (orderId: number) => {
    const order = orders.find(o => o.id === orderId)
    if (order && statuses && order.status === statuses.IN_LOCKER) {
      setPendingOrderId(orderId)
      setCodeModalOpen(true)
      setCodeError('')
    }
  }

  const handleCodeVerify = async (code: string) => {
    if (!token || !pendingOrderId) return

    try {
      setCodeError('')
      
      // Llamar al backend para confirmar la recogida con el código
      const updatedOrder = await orderService.confirmPickup(pendingOrderId, code, token)
      
      if (updatedOrder) {
        // Actualizar órdenes localmente
        setOrders(prev =>
          prev.map(order =>
            order.id === pendingOrderId ? updatedOrder : order
          )
        )
        setPendingOrderId(null)
        setCodeModalOpen(false)
        setClientCode(null) // Limpiar el código ya que la orden fue entregada
      }
    } catch (error: any) {
      console.error('Error al confirmar recogida:', error)
      const errorMessage = error?.message || 'Código incorrecto. Intenta de nuevo.'
      setCodeError(errorMessage)
    }
  }

  return (
    <Box sx={clientDashboardStyles.container}>
      <Box sx={clientDashboardStyles.header}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Hola, {userName.split(' ')[0]} 👋
        </Typography>
      </Box>

      {/* Featured Promo */}
      <Card sx={clientDashboardStyles.promoCard}>
        <CardMedia
          component="img"
          image={ASSETS.burger}
          alt="Promo"
          sx={clientDashboardStyles.promoImage}
        />
        <Box sx={clientDashboardStyles.promoOverlay}>
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={clientDashboardStyles.promoLabel}
          >
            Promo del día
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            50% OFF
          </Typography>
          <Typography variant="body2" sx={clientDashboardStyles.promoDescription}>
            En tu primera orden de hamburguesas seleccionadas.
          </Typography>
        </Box>
      </Card>

      {/* Active Orders Status - Mostrar órdenes En preparación y En camino */}
      {activeOrders.length > 0 && (
        <Stack spacing={2}>
          {activeOrders.map((order) => (
            <Paper 
              key={order.id}
              sx={{
                ...clientDashboardStyles.activeOrderPaper,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
              onClick={() => navigate(`${ROUTES.ORDERS}?highlight=${order.id}`)}
            >
              <Box sx={clientDashboardStyles.activeOrderHeader}>
                <Typography variant="h6" fontWeight="bold">
                  Orden en curso
                </Typography>
                <Chip 
                  label={order.status ? getStatusInfo(order.status).label : 'N/A'} 
                  color={order.status ? getStatusInfo(order.status).color : 'default'} 
                  size="small" 
                />
              </Box>
              <Box sx={clientDashboardStyles.orderContent}>
                <Box sx={clientDashboardStyles.orderImageContainer}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
                    sx={clientDashboardStyles.orderImage}
                  />
                </Box>
                <Box sx={clientDashboardStyles.orderDetails}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Pedido #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {order.locker_address || 'Locker'}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      statuses && order.status === statuses.PREPARING ? 15 :
                      statuses && order.status === statuses.IN_TRANSIT ? 60 :
                      statuses && order.status === statuses.IN_LOCKER ? 85 : 100
                    }
                    sx={clientDashboardStyles.progressBar}
                  />
                  <Typography variant="caption" color="text.secondary" sx={clientDashboardStyles.estimatedTime}>
                    {statuses && order.status === statuses.PREPARING && 'Preparando...'}
                    {statuses && order.status === statuses.IN_TRANSIT && 'Llega en 15 min'}
                    {statuses && order.status === statuses.IN_LOCKER && 'Listo en el locker'}
                  </Typography>

                  {/* Mostrar código del locker */}
                  {statuses && order.status === statuses.IN_LOCKER && clientCode && (
                    <Box onClick={(e) => e.stopPropagation()}>
                      <LockerCodeDisplay
                        code={clientCode.code}
                        expiresIn={clientCode.expiresIn}
                        title="Tu Código de Recogida"
                      />
                    </Box>
                  )}

                  {statuses && order.status === statuses.IN_LOCKER && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleReceiveOrder(order.id)
                        }}
                      >
                        Recibir Pedido
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Quick Actions */}
      {/* @ts-ignore - MUI Grid type issue */}
      <Grid container spacing={clientDashboardStyles.quickActionsGrid.spacing}>
        {/* @ts-ignore - MUI Grid type issue */}
        <Grid item xs={12}>
          <Paper 
            sx={clientDashboardStyles.quickActionPaperBlue}
            onClick={() => navigate(ROUTES.ORDERS)}
          >
            {/* @ts-ignore - MUI type issue */}
            <Box
              sx={[
                clientDashboardStyles.quickActionIcon,
                clientDashboardStyles.quickActionIconBlue,
              ]}
            >
              <Inventory2 />
            </Box>
            <Typography fontWeight="bold" color="text.primary">
              Mis Órdenes
            </Typography>
            {activeOrders.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                No tienes ninguna orden activa
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Past Orders */}
      {pastOrders.length > 0 && (
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Órdenes Anteriores
          </Typography>
          <Stack spacing={2}>
            {pastOrders.map(order => (
              <Box key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    #{order.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
                <Chip 
                  label={order.status ? getStatusInfo(order.status).label : 'N/A'} 
                  color={order.status ? getStatusInfo(order.status).color : 'default'} 
                  size="small" 
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      <CodeVerificationModal
        open={codeModalOpen}
        onClose={() => {
          setCodeModalOpen(false)
          setCodeError('')
        }}
        onVerify={handleCodeVerify}
        title="Verificar código para recibir pedido"
        description="Ingresa el código de 6 dígitos para retirar tu pedido del locker"
        errorMessage={codeError}
      />
    </Box>
  )
}
