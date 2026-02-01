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
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {title}
          <IconButton
            aria-label="cerrar"
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 2 }}>
        {children}
      </DialogContent>
      {buttons.length > 0 && (
        <>
          <Divider />
          <DialogActions sx={{ p: 2, gap: 1 }}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                variant={button.variant || 'text'}
                color={button.color || 'primary'}
                disabled={button.disabled}
                startIcon={button.startIcon}
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
