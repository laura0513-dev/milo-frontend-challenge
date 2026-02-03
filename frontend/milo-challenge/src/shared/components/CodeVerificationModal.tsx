import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import { Lock } from '@mui/icons-material'

interface CodeVerificationModalProps {
  open: boolean
  onClose: () => void
  onVerify: (code: string) => void
  title?: string
  description?: string
  errorMessage?: string
  isLoading?: boolean
}

export const CodeVerificationModal: React.FC<CodeVerificationModalProps> = ({
  open,
  onClose,
  onVerify,
  title = 'Verificación de código',
  description = 'Ingresa el código de 6 dígitos para continuar',
  errorMessage,
  isLoading = false,
}) => {
  const [code, setCode] = useState('')
  const [localError, setLocalError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
    setLocalError('')
  }

  const handleVerify = () => {
    if (code.length !== 6) {
      setLocalError('El código debe tener exactamente 6 dígitos')
      return
    }
    onVerify(code)
  }

  const handleClose = () => {
    setCode('')
    setLocalError('')
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 6) {
      handleVerify()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock fontSize="small" />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <TextField
            autoFocus
            fullWidth
            type="text"
            inputMode="numeric"
            placeholder="000000"
            value={code}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            inputProps={{ maxLength: 6 }}
            sx={{
              '& input': {
                textAlign: 'center',
                letterSpacing: '0.5em',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              },
            }}
          />

          {(localError || errorMessage) && (
            <Alert severity="error">
              {localError || errorMessage}
            </Alert>
          )}

          <Typography variant="caption" color="text.secondary">
            Recibirás este código en tu email de confirmación
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          onClick={handleVerify}
          variant="contained"
          disabled={code.length !== 6 || isLoading}
        >
          Verificar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
