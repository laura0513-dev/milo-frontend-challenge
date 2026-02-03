import React from 'react'
import { CustomModal, ModalButton } from '../../../shared/components/ui/index.ts'
import { NewOrderForm, NewOrderFormRef } from '../forms/NewOrderForm.tsx'
import { CreateOrderRequest } from '../../../shared/types.ts'
import { Save } from '@mui/icons-material'
import { Alert, CircularProgress } from '@mui/material'

interface OrderFormModalProps {
  open: boolean
  isEditMode: boolean
  isAdmin: boolean
  userId?: number
  onClose: () => void
  onSubmit: (data: CreateOrderRequest) => void
  errorMessage?: string
  isLoading?: boolean
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  open,
  isEditMode,
  isAdmin,
  userId,
  onClose,
  onSubmit,
  errorMessage,
  isLoading = false,
}) => {
  const formRef = React.useRef<NewOrderFormRef>(null)
  const [isFormValid, setIsFormValid] = React.useState(false)

  const handleFormSubmit = () => {
    if (formRef.current && !isLoading) {
      formRef.current.submit()
    }
  }

  const modalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      onClick: onClose,
      variant: 'outlined',
      disabled: isLoading,
    },
    {
      label: isLoading ? 'Creando...' : (isEditMode ? 'Actualizar Orden' : 'Crear Orden'),
      onClick: handleFormSubmit,
      variant: 'contained',
      color: 'primary',
      startIcon: !isLoading ? <Save /> : <CircularProgress size={16} color="inherit" />,
      disabled: isLoading || !isFormValid,
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
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <NewOrderForm 
        ref={formRef}
        isAdmin={isAdmin} 
        userId={userId}
        onSubmit={onSubmit}
        onValidityChange={setIsFormValid}
      />
    </CustomModal>
  )
}
