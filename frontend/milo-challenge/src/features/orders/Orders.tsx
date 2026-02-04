import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'
import { useOrderStatuses } from '../../shared/hooks/index.ts'
import { useOrders } from './OrdersContext.tsx'
import { LoadingState, CustomModal } from '../../shared/components/ui/index.ts'
import { CodeVerificationModal } from '../../shared/components/CodeVerificationModal.tsx'
import { Order } from '../../shared/types.ts'
import { UserRole } from '../../shared/constants/enums.ts'
import { Add } from '@mui/icons-material'
import { OrderDetails } from './components/OrderDetails.tsx'
import { OrderFormModal } from './components/OrderFormModal.tsx'
import { CancelOrderModal } from './components/CancelOrderModal.tsx'
import { OrderCard } from './components/OrderCard.tsx'
import { EmptyOrdersState } from './components/EmptyOrdersState.tsx'
import { useDeliveryCodes } from './hooks/useDeliveryCodes.ts'
import { useClientCodes } from './hooks/useClientCodes.ts'
import { useOrderHighlight } from './hooks/useOrderHighlight.ts'
import { orderService } from './orderService.ts'
import { ordersStyles } from './Orders.styles.ts'
import { Box, Typography, Button, Stack } from '@mui/material'

const Orders = () => {
  const { user, token } = useAuth()
  const { statuses, isLoading: isLoadingStatuses } = useOrderStatuses()
  const { orders, isLoading: isLoadingOrders, refreshOrders } = useOrders()
  const [searchParams, setSearchParams] = useSearchParams()
  const highlightedOrderId = searchParams.get('highlight')
  const orderRefs = useRef<Record<number, HTMLDivElement | null>>({})
  
  // Modal states
  const [openModal, setOpenModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null)
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [codeModalTitle, setCodeModalTitle] = useState('Verificar código')
  const [codeModalDescription, setCodeModalDescription] = useState('')
  
  // Order action states
  const [pendingClaimOrderId, setPendingClaimOrderId] = useState<number | null>(null)
  const [pendingStatusOrderId, setPendingStatusOrderId] = useState<number | null>(null)
  const [pendingNewStatus, setPendingNewStatus] = useState<string | null>(null)
  const [createOrderError, setCreateOrderError] = useState<string>('')
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  // Custom hooks para códigos
  const deliveryCodes = useDeliveryCodes(orders, token, user?.role || '', statuses?.IN_TRANSIT)
  const clientCodes = useClientCodes(orders, token, user?.role || '', statuses?.IN_LOCKER)
  
  // Custom hook para highlight
  useOrderHighlight(highlightedOrderId, orders, isLoadingOrders, orderRefs, searchParams, setSearchParams)

  // Cargar órdenes cuando se monta el componente
  useEffect(() => {
    refreshOrders()
  }, [refreshOrders])

  const handleCreateOrder = async (orderData: any) => {
    if (!token || !user) return
    
    setIsCreatingOrder(true)
    setCreateOrderError('')
    
    try {
      await orderService.createOrder(orderData, token)
      
      // Refrescar órdenes desde el contexto
      await refreshOrders(true)
      
      setOpenModal(false)
      setCreateOrderError('')
    } catch (error: any) {
      console.error('Error al crear orden:', error)
      const errorMessage = error?.message || 'No se pudo crear la orden. Por favor, intenta de nuevo más tarde.'
      setCreateOrderError(errorMessage)
    } finally {
      setIsCreatingOrder(false)
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
      await refreshOrders(true)
    } catch (error) {
      console.error('Error al cambiar estado de orden:', error)
    }
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

  if (isLoadingOrders || isLoadingStatuses || !statuses) {
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
            aria-label="Crear una nueva orden"
          >
            Nueva Orden
          </Button>
        )}
      </Box>

      {filteredOrders.length === 0 ? (
        <EmptyOrdersState 
          canCreateOrder={canCreateOrder}
          onCreateOrder={() => setOpenModal(true)}
        />
      ) : (
        <Stack sx={ordersStyles.ordersList}>
          {filteredOrders.map((order) => {
            const isHighlighted = !!(highlightedOrderId && parseInt(highlightedOrderId) === order.id)
            return (
              <OrderCard
                key={order.id}
                order={order}
                userRole={user.role}
                isHighlighted={isHighlighted}
                orderRef={(el) => { orderRefs.current[order.id] = el }}
                deliveryCode={deliveryCodes[order.id]}
                clientCode={clientCodes[order.id]}
                statuses={statuses}
                onOpenCancelModal={handleOpenCancelModal}
                onClaimOrder={handleClaimOrder}
                onViewDetails={handleViewDetails}
                onChangeOrderStatus={handleChangeOrderStatus}
              />
            )
          })}
        </Stack>
      )}

      {/* Modal Formulario de Orden (Crear/Editar) */}
      <OrderFormModal
        open={openModal}
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
