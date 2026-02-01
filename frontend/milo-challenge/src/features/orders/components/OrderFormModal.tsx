import React from 'react'
import { CustomModal, ModalButton } from '../../../shared/components/ui/index.ts'
import { NewOrderForm } from '../forms/NewOrderForm.tsx'
import { Order } from '../../../shared/types.ts'
import { Save } from '@mui/icons-material'

interface OrderFormModalProps {
  open: boolean
  isEditMode: boolean
  orderToEdit: Order | null
  isAdmin: boolean
  onClose: () => void
  onSubmit: () => void
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  open,
  isEditMode,
  orderToEdit,
  isAdmin,
  onClose,
  onSubmit,
}) => {
  const modalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      onClick: onClose,
      variant: 'outlined',
    },
    {
      label: isEditMode ? 'Actualizar Orden' : 'Crear Orden',
      onClick: onSubmit,
      variant: 'contained',
      color: 'primary',
      startIcon: <Save />,
    },
  ]

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEditMode ? 'Editar Orden' : 'Crear Nueva Orden'}
      buttons={modalButtons}
      maxWidth="sm"
    >
      <NewOrderForm 
        isAdmin={isAdmin} 
        initialData={isEditMode ? orderToEdit || undefined : undefined}
      />
    </CustomModal>
  )
}
