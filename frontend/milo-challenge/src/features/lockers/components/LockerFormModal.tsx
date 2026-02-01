import React from 'react'
import { CustomModal, ModalButton } from '../../../shared/components/ui/index.ts'
import { NewLockerForm } from '../forms/NewLockerForm.tsx'
import { Locker } from '../../../shared/types.ts'
import { Save } from '@mui/icons-material'

interface LockerFormModalProps {
  open: boolean
  isEditMode: boolean
  lockerToEdit: Locker | null
  onClose: () => void
  onSubmit: () => void
}

export const LockerFormModal: React.FC<LockerFormModalProps> = ({
  open,
  isEditMode,
  lockerToEdit,
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
      label: isEditMode ? 'Actualizar Locker' : 'Crear Locker',
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
      title={isEditMode ? 'Editar Locker' : 'Crear Nuevo Locker'}
      buttons={modalButtons}
      maxWidth="sm"
    >
      <NewLockerForm initialData={isEditMode ? lockerToEdit || undefined : undefined} />
    </CustomModal>
  )
}
