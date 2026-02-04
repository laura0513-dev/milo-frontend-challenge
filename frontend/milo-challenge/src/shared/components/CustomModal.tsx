import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Divider,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { customModalStyles } from './styles/CustomModal.styles.ts'

export interface ModalButton {
  label: string
  onClick: () => void
  variant?: 'text' | 'outlined' | 'contained'
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  disabled?: boolean
  startIcon?: React.ReactNode
}

interface CustomModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  buttons?: ModalButton[]
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  children,
  buttons = [],
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: customModalStyles.paper,
      }}
      aria-labelledby="custom-modal-title"
    >
      <DialogTitle id="custom-modal-title">
        <Box sx={customModalStyles.titleContainer}>
          {title}
          <IconButton
            aria-label={`Cerrar ${title}`}
            onClick={onClose}
            size="small"
            sx={customModalStyles.closeButton}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={customModalStyles.content}>
        {children}
      </DialogContent>
      {buttons.length > 0 && (
        <>
          <Divider />
          <DialogActions sx={customModalStyles.actions}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                variant={button.variant || 'text'}
                color={button.color || 'primary'}
                disabled={button.disabled}
                startIcon={button.startIcon}
                aria-label={button.label}
              >
                {button.label}
              </Button>
            ))}
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
