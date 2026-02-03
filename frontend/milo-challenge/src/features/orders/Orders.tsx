import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'
import { usePageLoading, useOrderStatuses } from '../../shared/hooks/index.ts'
import { useOrders } from './OrdersContext.tsx'
import { LoadingState, ActionMenu, CustomModal } from '../../shared/components/ui/index.ts'
import { CodeVerificationModal } from '../../shared/components/CodeVerificationModal.tsx'
import { LockerCodeDisplay } from '../../shared/components/LockerCodeDisplay.tsx'
import { Order } from '../../shared/types.ts'
import { UserRole, OrderStatus } from '../../shared/constants/enums.ts'
import { Search, FilterList, MoreVert, Add, Visibility, Cancel, Edit, RemoveCircle, CheckCircle, HourglassEmpty } from '@mui/icons-material'
import { OrderDetails } from './components/OrderDetails.tsx'
import { OrderFormModal } from './components/OrderFormModal.tsx'
import { CancelOrderModal } from './components/CancelOrderModal.tsx'
import { orderService } from './orderService.ts'
import { ordersStyles } from './Orders.styles.ts'
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
      sx={ordersStyles.statusBadge} 
    />
  )
}

const Orders = () => {
  const { user, token } = useAuth()
  const isLoading = usePageLoading()
  const { statuses, isLoading: isLoadingStatuses } = useOrderStatuses()
  const { orders, isLoading: isLoadingOrders, refreshOrders } = useOrders()
  const [searchParams, setSearchParams] = useSearchParams()
  const highlightedOrderId = searchParams.get('highlight')
  const orderRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const [openModal, setOpenModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null)
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [codeModalTitle, setCodeModalTitle] = useState('Verificar código')
  const [codeModalDescription, setCodeModalDescription] = useState('')
  const [pendingClaimOrderId, setPendingClaimOrderId] = useState<number | null>(null)
  const [pendingStatusOrderId, setPendingStatusOrderId] = useState<number | null>(null)
  const [pendingNewStatus, setPendingNewStatus] = useState<string | null>(null)
  const [createOrderError, setCreateOrderError] = useState<string>('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [deliveryCodes, setDeliveryCodes] = useState<Record<number, { code: string; expiresIn: number; generatedAt: string }>>({})
  const [clientCodes, setClientCodes] = useState<Record<number, { code: string; expiresIn: number; generatedAt: string }>>({})

  // Cargar órdenes cuando se monta el componente
  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  // Obtener códigos de delivery para órdenes "En camino" cada 60 segundos
  useEffect(() => {
    if (!user || !token || user.role !== UserRole.DELIVERY || !statuses) return

    const fetchDeliveryCodes = async () => {
      // Encontrar todas las órdenes que están "En camino"
      const ordersInTransit = orders.filter(order => order.status === statuses.IN_TRANSIT)
      
      // Obtener código para cada orden en camino
      const codePromises = ordersInTransit.map(async (order) => {
        try {
          const codeData = await orderService.getDeliveryCode(order.id, token)
          return { orderId: order.id, codeData }
        } catch (error) {
          console.error(`Error obteniendo código para orden ${order.id}:`, error)
          return { orderId: order.id, codeData: null }
        }
      })

      const results = await Promise.all(codePromises)
      
      // Actualizar estado con los códigos obtenidos
      const newCodes: Record<number, { code: string; expiresIn: number; generatedAt: string }> = {}
      results.forEach(({ orderId, codeData }) => {
        if (codeData) {
          newCodes[orderId] = codeData
        }
      })
      
      setDeliveryCodes(newCodes)
    }

    // Obtener códigos inmediatamente
    if (orders.length > 0) {
      fetchDeliveryCodes()
    }

    // Refrescar cada 60 segundos
    const interval = setInterval(fetchDeliveryCodes, 60000)

    return () => clearInterval(interval)
  }, [orders, user, token, statuses])

  // Actualizar contador de expiración cada segundo y refrescar cuando expire
  useEffect(() => {
    if (!user || !token || user.role !== UserRole.DELIVERY) return
    if (Object.keys(deliveryCodes).length === 0) return

    const interval = setInterval(() => {
      setDeliveryCodes(prev => {
        const updated = { ...prev }
        let hasChanges = false
        const expiredOrderIds: number[] = []

        Object.keys(updated).forEach(orderIdStr => {
          const orderId = parseInt(orderIdStr)
          if (updated[orderId].expiresIn > 0) {
            updated[orderId] = {
              ...updated[orderId],
              expiresIn: updated[orderId].expiresIn - 1
            }
            hasChanges = true

            // Si llegó a 0, marcarlo para refrescar
            if (updated[orderId].expiresIn === 0) {
              expiredOrderIds.push(orderId)
            }
          }
        })

        // Obtener nuevos códigos para las órdenes expiradas
        if (expiredOrderIds.length > 0) {
          expiredOrderIds.forEach(async (orderId) => {
            try {
              const codeData = await orderService.getDeliveryCode(orderId, token)
              if (codeData) {
                setDeliveryCodes(current => ({
                  ...current,
                  [orderId]: codeData
                }))
              }
            } catch (error) {
              console.error(`Error obteniendo nuevo código para orden ${orderId}:`, error)
            }
          })
        }

        return hasChanges ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [deliveryCodes, user, token])

  // Obtener códigos de cliente para órdenes "En el locker" cada 60 segundos
  useEffect(() => {
    if (!user || !token || user.role !== UserRole.CLIENT || !statuses) return

    const fetchClientCodes = async () => {
      // Encontrar todas las órdenes que están "En el locker"
      const ordersInLocker = orders.filter(order => order.status === statuses.IN_LOCKER)
      
      // Obtener código para cada orden en el locker
      const codePromises = ordersInLocker.map(async (order) => {
        try {
          const codeData = await orderService.getClientCode(order.id, token)
          return { orderId: order.id, codeData }
        } catch (error) {
          console.error(`Error obteniendo código para orden ${order.id}:`, error)
          return { orderId: order.id, codeData: null }
        }
      })

      const results = await Promise.all(codePromises)
      
      // Actualizar estado con los códigos obtenidos
      const newCodes: Record<number, { code: string; expiresIn: number; generatedAt: string }> = {}
      results.forEach(({ orderId, codeData }) => {
        if (codeData) {
          newCodes[orderId] = codeData
        }
      })
      
      setClientCodes(newCodes)
    }

    // Obtener códigos inmediatamente
    if (orders.length > 0) {
      fetchClientCodes()
    }

    // Refrescar cada 60 segundos
    const interval = setInterval(fetchClientCodes, 60000)

    return () => clearInterval(interval)
  }, [orders, user, token, statuses])

  // Actualizar contador de expiración de códigos de cliente cada segundo y refrescar cuando expire
  useEffect(() => {
    if (!user || !token || user.role !== UserRole.CLIENT) return
    if (Object.keys(clientCodes).length === 0) return

    const interval = setInterval(() => {
      setClientCodes(prev => {
        const updated = { ...prev }
        let hasChanges = false
        const expiredOrderIds: number[] = []

        Object.keys(updated).forEach(orderIdStr => {
          const orderId = parseInt(orderIdStr)
          if (updated[orderId].expiresIn > 0) {
            updated[orderId] = {
              ...updated[orderId],
              expiresIn: updated[orderId].expiresIn - 1
            }
            hasChanges = true

            // Si llegó a 0, marcarlo para refrescar
            if (updated[orderId].expiresIn === 0) {
              expiredOrderIds.push(orderId)
            }
          }
        })

        // Obtener nuevos códigos para las órdenes expiradas
        if (expiredOrderIds.length > 0) {
          expiredOrderIds.forEach(async (orderId) => {
            try {
              const codeData = await orderService.getClientCode(orderId, token)
              if (codeData) {
                setClientCodes(current => ({
                  ...current,
                  [orderId]: codeData
                }))
              }
            } catch (error) {
              console.error(`Error obteniendo nuevo código para orden ${orderId}:`, error)
            }
          })
        }

        return hasChanges ? updated : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [clientCodes, user, token])

  // Scroll a la orden resaltada cuando se carga desde el dashboard
  useEffect(() => {
    if (highlightedOrderId && orders.length > 0 && !isLoadingOrders) {
      const orderId = parseInt(highlightedOrderId)
      const orderElement = orderRefs.current[orderId]
      if (orderElement) {
        setTimeout(() => {
          orderElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Remover el parámetro highlight después de hacer scroll
          setTimeout(() => {
            searchParams.delete('highlight')
            setSearchParams(searchParams, { replace: true })
          }, 1500)
        }, 100)
      }
    }
  }, [highlightedOrderId, orders, isLoadingOrders])

  const handleCreateOrder = async (orderData: any) => {
    if (!token || !user) return
    
    setIsCreatingOrder(true)
    setCreateOrderError('')
    
    try {
      await orderService.createOrder(orderData, token)
      
      // Refrescar órdenes desde el contexto
      await refreshOrders(true)
      
      setOpenModal(false)
      setIsEditMode(false)
      setOrderToEdit(null)
      setCreateOrderError('')
    } catch (error: any) {
      console.error('Error al crear orden:', error)
      const errorMessage = error?.message || 'No se pudo crear la orden. Por favor, intenta de nuevo más tarde.'
      setCreateOrderError(errorMessage)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handleEditOrder = async (orderId: number) => {
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setOrderToEdit(order)
      setIsEditMode(true)
      setOpenModal(true)
    }
  }

  const handleViewDetails = async (orderId: number) => {
    const orderDetails = orders.find(o => o.id === orderId)
    if (orderDetails) {
      setSelectedOrder(orderDetails)
      setOpenDetailsModal(true)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setIsEditMode(false)
    setOrderToEdit(null)
    setCreateOrderError('')
  }

  const handleOpenCancelModal = (orderId: number) => {
    setOrderToCancel(orderId)
    setOpenCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (orderToCancel && token) {
      try {
        console.log('Cancelando orden:', orderToCancel)
        // await orderService.deleteOrder(orderToCancel, token)
        setOpenCancelModal(false)
        setOrderToCancel(null)
      } catch (error) {
        console.error('Error al cancelar la orden:', error)
      }
    }
  }

  const handleCloseCancelModal = () => {
    setOpenCancelModal(false)
    setOrderToCancel(null)
  }

  const handleChangeOrderStatus = async (orderId: number, newStatus: string) => {
    if (!token || !user || !statuses) return
    
    // Si es la transición de "en camino" a "en el locker", requiere código
    const order = orders.find(o => o.id === orderId)
    if (order && order.status === statuses.IN_TRANSIT && newStatus === statuses.IN_LOCKER) {
      setPendingStatusOrderId(orderId)
      setPendingNewStatus(newStatus)
      setCodeModalTitle('Verificar código del locker')
      setCodeModalDescription(`Ingresa el código de 6 dígitos mostrado arriba para confirmar que depositaste el paquete en el locker`)
      setCodeError('')
      setCodeModalOpen(true)
      return
    }

    try {
      await orderService.updateOrderStatus(orderId, newStatus, undefined, token)
      // Refrescar órdenes desde el contexto
      await refreshOrders(true)
    } catch (error) {
      console.error('Error al cambiar estado de orden:', error)
    }
  }

  const handleUnassignOrder = (orderId: number) => {
    console.log(`Desasignando orden ${orderId}`)
    // Aquí iría la llamada al servicio para desasignar la orden
  }

  const handleClaimOrder = (orderId: number) => {
    setPendingClaimOrderId(orderId)
    setCodeModalOpen(true)
    setCodeError('')
  }

  const handleCodeVerify = async (code: string) => {
    if (!token || !user || !statuses) return

    try {
      // Si es para cambiar estado del repartidor (de "en camino" a "en el locker")
      if (pendingStatusOrderId && pendingNewStatus) {
        // El código será validado por el backend
        // Ya no necesitamos validarlo localmente

        // Enviar el código al backend para validación
        await orderService.updateOrderStatus(pendingStatusOrderId, pendingNewStatus, code, token)
        
        // Refrescar órdenes desde el contexto
        await refreshOrders(true)
        
        setPendingStatusOrderId(null)
        setPendingNewStatus(null)
        setCodeModalOpen(false)
        return
      }

      // Si es para reclamar orden del cliente
      if (pendingClaimOrderId) {
        // Validar código (simple: 123456)
        if (code !== '123456') {
          setCodeError('Código incorrecto. Intenta de nuevo.')
          return
        }
        await orderService.updateOrderStatus(pendingClaimOrderId, statuses.DELIVERED, undefined, token)
        
        // Refrescar órdenes desde el contexto
        await refreshOrders(true)
        
        setPendingClaimOrderId(null)
      }
      setCodeModalOpen(false)
    } catch (error) {
      console.error('Error al verificar código:', error)
      setCodeError('Error al procesar la solicitud')
    }
  }
  
  if (!user) return null

  if (isLoading || isLoadingOrders || isLoadingStatuses || !statuses) {
    return <LoadingState message="Cargando órdenes..." />
  }

  // Las órdenes ya vienen filtradas del backend según el rol
  const filteredOrders = orders

  const getPageTitle = () => {
    if (user.role === UserRole.ADMIN) return 'Gestión de Órdenes'
    if (user.role === UserRole.DELIVERY) return 'Mis Órdenes Asignadas'
    return 'Mis Pedidos'
  }

  const canCreateOrder = user.role === UserRole.ADMIN || user.role === UserRole.CLIENT

  return (
    <Box sx={ordersStyles.container}>
      <Box sx={ordersStyles.header}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {getPageTitle()}
        </Typography>
        {canCreateOrder && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={ordersStyles.createButton}
            onClick={() => setOpenModal(true)}
          >
            Nueva Orden
          </Button>
        )}
      </Box>

      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes ninguna orden activa
          </Typography>
          {canCreateOrder && (
            <Button 
              variant="contained" 
              startIcon={<Add />}
              sx={{ mt: 2 }}
              onClick={() => setOpenModal(true)}
            >
              Crear Primera Orden
            </Button>
          )}
        </Paper>
      ) : (
        <Stack sx={ordersStyles.ordersList}>
          {filteredOrders.map((order) => {
            const isHighlighted = highlightedOrderId && parseInt(highlightedOrderId) === order.id
            return (
              <Paper 
                key={order.id}
                ref={(el) => { orderRefs.current[order.id] = el }}
                sx={{
                  ...ordersStyles.orderCard,
                  ...(isHighlighted && {
                    border: '3px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 0 20px rgba(25, 118, 210, 0.4)',
                    transition: 'all 0.3s ease-in-out'
                  })
                }}
              >
            <Box sx={ordersStyles.orderHeader}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">Orden #{order.id}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
              <StatusBadge status={order.status} />
            </Box>
            
            <Divider sx={ordersStyles.orderDivider} />

            <Box sx={ordersStyles.orderItems}>
              {order.usuario && (
                <Typography variant="body2" color="text.primary">
                  <strong>Cliente:</strong> {order.usuario}
                </Typography>
              )}
              {order.locker_address && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Locker:</strong> {order.locker_address}
                </Typography>
              )}
              
              {/* Código para delivery */}
              {user.role === UserRole.DELIVERY && order.status === statuses.IN_TRANSIT && deliveryCodes[order.id] && (
                <LockerCodeDisplay
                  code={deliveryCodes[order.id].code}
                  expiresIn={deliveryCodes[order.id].expiresIn}
                  title="Código del Locker"
                />
              )}

              {/* Código para cliente */}
              {user.role === UserRole.CLIENT && order.status === statuses.IN_LOCKER && clientCodes[order.id] && (
                <LockerCodeDisplay
                  code={clientCodes[order.id].code}
                  expiresIn={clientCodes[order.id].expiresIn}
                  title="Tu Código de Recogida"
                />
              )}
            </Box>

            <Box sx={ordersStyles.orderFooter}>
              <Box sx={ordersStyles.orderActions}>
                {user.role === UserRole.CLIENT && order.status === statuses.PREPARING && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    onClick={() => handleOpenCancelModal(order.id)}
                  >
                    Cancelar
                  </Button>
                )}
                {user.role === UserRole.CLIENT && order.status === statuses.IN_LOCKER && (
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="small"
                    onClick={() => handleClaimOrder(order.id)}
                  >
                    Reclamar Orden
                  </Button>
                )}
                {user.role === UserRole.ADMIN && (
                  <ActionMenu
                    buttonIcon={MoreVert}
                    actions={[
                      {
                        label: 'Ver detalle',
                        icon: Visibility,
                        onClick: () => handleViewDetails(order.id)
                      },
                      {
                        label: 'Cancelar orden',
                        icon: Cancel,
                        onClick: () => handleOpenCancelModal(order.id),
                        color: 'error'
                      }
                    ]}
                  />
                )}
                {user.role === UserRole.DELIVERY && (
                  <ActionMenu
                    buttonIcon={MoreVert}
                    actions={[
                      {
                        label: 'Marcar en camino',
                        icon: HourglassEmpty,
                        onClick: () => handleChangeOrderStatus(order.id, statuses.IN_TRANSIT),
                        color: 'warning',
                        disabled: order.status !== statuses.PREPARING
                      },
                      {
                        label: 'Marcar en locker',
                        icon: CheckCircle,
                        onClick: () => handleChangeOrderStatus(order.id, statuses.IN_LOCKER),
                        color: 'secondary',
                        disabled: order.status === statuses.IN_TRANSIT ? false : (order.status === statuses.PREPARING ? false : true)
                      },
                      {
                        label: 'Cancelar orden',
                        icon: Cancel,
                        onClick: () => handleChangeOrderStatus(order.id, statuses.CANCELLED),
                        color: 'error',
                        disabled: order.status === statuses.DELIVERED || order.status === statuses.CANCELLED
                      }
                    ]}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        )})}
        </Stack>
      )}

      {/* Modal Formulario de Orden (Crear/Editar) */}
      <OrderFormModal
        open={openModal}
        isEditMode={isEditMode}
        isAdmin={user.role === 'admin'}
        userId={parseInt(user.id)}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrder}
        errorMessage={createOrderError}
        isLoading={isCreatingOrder}
      />

      {/* Modal Confirmación Cancelar Orden */}
      <CancelOrderModal
        open={openCancelModal}
        orderId={orderToCancel}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />

      {/* Modal Detalles de Orden */}

      {/* Modal Verificación de Código para Reclamar Orden */}
      <CodeVerificationModal
        open={codeModalOpen}
        onClose={() => {
          setCodeModalOpen(false)
          setCodeError('')
          setPendingClaimOrderId(null)
          setPendingStatusOrderId(null)
          setPendingNewStatus(null)
        }}
        onVerify={handleCodeVerify}
        title={codeModalTitle}
        description={codeModalDescription}
        errorMessage={codeError}
      />
      {selectedOrder && (
        <CustomModal
          open={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
          title="Detalles de la Orden"
          maxWidth="md"
        >
          <OrderDetails order={selectedOrder} />
        </CustomModal>
      )}
    </Box>
  )
}

export default Orders;
