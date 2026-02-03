import React from 'react'
import { Box, Typography } from '@mui/material'
import { CustomModal, ModalButton } from '../../../shared/components/ui/index.ts'

interface CancelOrderModalProps {
  open: boolean
  orderId: number | null
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
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  open,
  orderId,
  onClose,
  onConfirm,
}) => {
  const modalButtons: ModalButton[] = [
    {
      label: 'No, mantener orden',
      onClick: onClose,
      variant: 'outlined',
    },
    {
      label: 'Sí, cancelar orden',
      onClick: onConfirm,
      variant: 'contained',
      color: 'error',
    },
  ]

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Cancelar Orden"
      buttons={modalButtons}
      maxWidth="xs"
    >
      <Box sx={styles.content}>
        <Typography variant="body1" sx={styles.description}>
          ¿Está seguro que desea cancelar esta orden?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Esta acción no se puede deshacer. La orden #{orderId?.toUpperCase()} será cancelada permanentemente.
        </Typography>
      </Box>
    </CustomModal>
  )
}
