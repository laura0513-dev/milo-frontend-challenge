import React from 'react'
import { Box, Typography, Paper, Divider, Button } from '@mui/material'
import { MoreVert, Cancel, Visibility, CheckCircle, HourglassEmpty } from '@mui/icons-material'
import { Order } from '../../../shared/types.ts'
import { UserRole } from '../../../shared/constants/enums.ts'
import { ActionMenu } from '../../../shared/components/ui/index.ts'
import { LockerCodeDisplay } from '../../../shared/components/LockerCodeDisplay.tsx'
import { StatusBadge } from './StatusBadge.tsx'
import { ordersStyles } from '../Orders.styles.ts'

interface OrderCardProps {
  order: Order
  userRole: string
  isHighlighted: boolean
  orderRef: (el: HTMLDivElement | null) => void
  deliveryCode?: { code: string; expiresIn: number; generatedAt: string }
  clientCode?: { code: string; expiresIn: number; generatedAt: string }
  statuses: {
    PREPARING: string
    IN_TRANSIT: string
    IN_LOCKER: string
    DELIVERED: string
    CANCELLED: string
  }
  onOpenCancelModal: (orderId: number) => void
  onClaimOrder: (orderId: number) => void
  onViewDetails: (orderId: number) => void
  onChangeOrderStatus: (orderId: number, newStatus: string) => void
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  userRole,
  isHighlighted,
  orderRef,
  deliveryCode,
  clientCode,
  statuses,
  onOpenCancelModal,
  onClaimOrder,
  onViewDetails,
  onChangeOrderStatus,
}) => {
  return (
    <Paper 
      ref={orderRef}
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
        {userRole === UserRole.DELIVERY && order.status === statuses.IN_TRANSIT && deliveryCode && (
          <LockerCodeDisplay
            code={deliveryCode.code}
            expiresIn={deliveryCode.expiresIn}
            title="Código del Locker"
          />
        )}

        {/* Código para cliente */}
        {userRole === UserRole.CLIENT && order.status === statuses.IN_LOCKER && clientCode && (
          <LockerCodeDisplay
            code={clientCode.code}
            expiresIn={clientCode.expiresIn}
            title="Tu Código de Recogida"
          />
        )}
      </Box>

      <Box sx={ordersStyles.orderFooter}>
        <Box sx={ordersStyles.orderActions}>
          {userRole === UserRole.CLIENT && order.status === statuses.PREPARING && (
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => onOpenCancelModal(order.id)}
              aria-label={`Cancelar orden número ${order.id}`}
            >
              Cancelar
            </Button>
          )}
          {userRole === UserRole.CLIENT && order.status === statuses.IN_LOCKER && (
            <Button 
              variant="contained" 
              color="primary"
              size="small"
              onClick={() => onClaimOrder(order.id)}
              aria-label={`Reclamar orden número ${order.id} del locker`}
            >
              Reclamar Orden
            </Button>
          )}
          {userRole === UserRole.ADMIN && (
            <ActionMenu
              buttonIcon={MoreVert}
              actions={[
                {
                  label: 'Ver detalle',
                  icon: Visibility,
                  onClick: () => onViewDetails(order.id)
                },
                {
                  label: 'Cancelar orden',
                  icon: Cancel,
                  onClick: () => onOpenCancelModal(order.id),
                  color: 'error'
                }
              ]}
            />
          )}
          {userRole === UserRole.DELIVERY && (
            <ActionMenu
              buttonIcon={MoreVert}
              actions={[
                {
                  label: 'Marcar en camino',
                  icon: HourglassEmpty,
                  onClick: () => onChangeOrderStatus(order.id, statuses.IN_TRANSIT),
                  color: 'warning',
                  disabled: order.status !== statuses.PREPARING
                },
                {
                  label: 'Marcar en locker',
                  icon: CheckCircle,
                  onClick: () => onChangeOrderStatus(order.id, statuses.IN_LOCKER),
                  color: 'secondary',
                  disabled: order.status === statuses.IN_TRANSIT ? false : (order.status === statuses.PREPARING ? false : true)
                },
                {
                  label: 'Cancelar orden',
                  icon: Cancel,
                  onClick: () => onChangeOrderStatus(order.id, statuses.CANCELLED),
                  color: 'error',
                  disabled: order.status === statuses.DELIVERED || order.status === statuses.CANCELLED
                }
              ]}
            />
          )}
        </Box>
      </Box>
    </Paper>
  )
}
