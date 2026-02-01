import React from 'react'
import { Box, Typography } from '@mui/material'
import { CustomModal, ModalButton } from '../../../shared/components/ui/index.ts'
import { Locker } from '../../../shared/types.ts'
import { Delete } from '@mui/icons-material'

interface DeleteLockerModalProps {
  open: boolean
  locker: Locker | null
  onClose: () => void
  onConfirm: () => void
}

const styles = {
  content: {
    py: 2,
  },
  description: {
    mb: 2,
  },
  lockerInfo: {
    p: 2,
    bgcolor: 'action.hover',
    borderRadius: 2,
    mb: 2,
  },
}

export const DeleteLockerModal: React.FC<DeleteLockerModalProps> = ({
  open,
  locker,
  onClose,
  onConfirm,
}) => {
  const modalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      onClick: onClose,
      variant: 'outlined',
    },
    {
      label: 'Sí, eliminar',
      onClick: onConfirm,
      variant: 'contained',
      color: 'error',
      startIcon: <Delete />,
    },
  ]

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Eliminar Locker"
      buttons={modalButtons}
      maxWidth="xs"
    >
      <Box sx={styles.content}>
        <Typography variant="body1" sx={styles.description}>
          ¿Está seguro que desea eliminar este locker?
        </Typography>
        {locker && (
          <Box sx={styles.lockerInfo}>
            <Typography variant="body2" fontWeight="bold">
              {locker.code}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {locker.location}
            </Typography>
          </Box>
        )}
        <Typography variant="body2" color="text.secondary">
          Esta acción no se puede deshacer. El locker será eliminado permanentemente.
        </Typography>
      </Box>
    </CustomModal>
  )
}
