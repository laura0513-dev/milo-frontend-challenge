import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { usePageLoading } from '../../shared/hooks/usePageLoading.ts'
import { LoadingState, ActionMenu, CustomModal } from '../../shared/components/ui/index.ts'
import { MOCK_ORDERS } from '../../shared/data/mockData.ts'
import { Order } from '../../shared/types.ts'
import { Search, FilterList, MoreVert, Add, Visibility, Cancel, Edit } from '@mui/icons-material'
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
      sx={ordersStyles.statusBadge} 
    />
  )
}

const Orders = () => {
  const { user } = useAuth()
  const isLoading = usePageLoading()
  const [openModal, setOpenModal] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)

  const handleCreateOrder = () => {
    console.log('Crear nueva orden')
    setOpenModal(false)
    setIsEditMode(false)
    setOrderToEdit(null)
  }

  const handleEditOrder = async (orderId: string) => {
    try {
      const order = await orderService.getOrderById(orderId)
      setOrderToEdit(order)
      setIsEditMode(true)
      setOpenModal(true)
    } catch (error) {
      console.error('Error al obtener orden para editar:', error)
    }
  }

  const handleViewDetails = async (orderId: string) => {
    try {
      const orderDetails = await orderService.getOrderById(orderId)
      setSelectedOrder(orderDetails)
      setOpenDetailsModal(true)
    } catch (error) {
      console.error('Error al obtener detalles de la orden:', error)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setIsEditMode(false)
    setOrderToEdit(null)
  }

  const handleOpenCancelModal = (orderId: string) => {
    setOrderToCancel(orderId)
    setOpenCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (orderToCancel) {
      try {
        // Aquí iría la llamada al servicio para cancelar la orden
        console.log('Cancelando orden:', orderToCancel)
        // await orderService.cancelOrder(orderToCancel)
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
  
  if (!user) return null

  if (isLoading) {
    return <LoadingState message="Cargando órdenes..." />
  }

  const orders = user.role === 'admin' 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(o => o.userId === user.id)

  return (
    <Box sx={ordersStyles.container}>
      <Box sx={ordersStyles.header}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {user.role === 'admin' ? 'Gestión de Órdenes' : 'Mis Pedidos'}
        </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            sx={ordersStyles.createButton}
            onClick={() => setOpenModal(true)}
          >
            Nueva Orden
          </Button>
      </Box>

      {/* Filters and Search */}
      <Box sx={ordersStyles.filtersContainer}>
        <Paper 
          component="form" 
          sx={ordersStyles.searchPaper}
        >
          <IconButton sx={ordersStyles.searchIconButton} aria-label="search">
            <Search sx={ordersStyles.searchIcon} />
          </IconButton>
          <InputBase
            sx={ordersStyles.searchInput}
            placeholder="Buscar por #ID, cliente..."
            inputProps={{ 'aria-label': 'search orders' }}
          />
        </Paper>
        <IconButton 
          sx={ordersStyles.filterButton}
        >
          <FilterList />
        </IconButton>
      </Box>

      {/* Orders List */}
      <Stack spacing={ordersStyles.ordersList.spacing}>
        {orders.map((order) => (
          <Paper 
            key={order.id} 
            sx={ordersStyles.orderCard}
          >
            <Box sx={ordersStyles.orderHeader}>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">#{order.id.toUpperCase()}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(order.date).toLocaleDateString()}
                </Typography>
              </Box>
              <StatusBadge status={order.status} />
            </Box>
            
            <Divider sx={ordersStyles.orderDivider} />

            <Box sx={ordersStyles.orderItems}>
              {order.items.map((item, idx) => (
                <Typography key={idx} variant="body2" color="text.primary">
                  {item}
                </Typography>
              ))}
            </Box>

            <Box sx={ordersStyles.orderFooter}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total</Typography>
                <Typography variant="h6" fontWeight="bold">${order.total.toLocaleString()}</Typography>
              </Box>
              <Box sx={ordersStyles.orderActions}>
                 {user.role === 'client' && order.status === 'pending' && (
                    <Button variant="outlined" color="error" size="small">
                       Cancelar
                    </Button>
                 )}
                 {user.role === 'admin' && (
                   <ActionMenu
                     buttonIcon={MoreVert}
                     actions={[
                       {
                         label: 'Ver detalle',
                         icon: Visibility,
                         onClick: () => handleViewDetails(order.id)
                       },
                       {
                         label: 'Editar Orden',
                         icon: Edit,
                         onClick: () => handleEditOrder(order.id),
                         color: 'primary'
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
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>

      {/* Modal Formulario de Orden (Crear/Editar) */}
      <OrderFormModal
        open={openModal}
        isEditMode={isEditMode}
        orderToEdit={orderToEdit}
        isAdmin={user.role === 'admin'}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrder}
      />

      {/* Modal Confirmación Cancelar Orden */}
      <CancelOrderModal
        open={openCancelModal}
        orderId={orderToCancel}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />

      {/* Modal Detalles de Orden */}
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
