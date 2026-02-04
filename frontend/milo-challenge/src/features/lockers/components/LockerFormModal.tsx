import React, { useState, useEffect } from 'react'
import { CustomModal, ModalButton } from '../../../shared/components/ui/index.ts'
import { Locker } from '../../../shared/types.ts'
import { Save } from '@mui/icons-material'
import {
  TextField,
  Box,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material'

interface LockerFormModalProps {
  open: boolean
  isEditMode: boolean
  lockerToEdit: Locker | null
  onClose: () => void
  onSubmit: (data: any) => void | Promise<void>
}

export const LockerFormModal: React.FC<LockerFormModalProps> = ({
  open,
  isEditMode,
  lockerToEdit,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<{
    name: string
    address: string
    latitude: number
    longitude: number
    is_active: boolean
  }>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    is_active: true,
  })

  useEffect(() => {
    if (isEditMode && lockerToEdit) {
      setFormData({
        name: lockerToEdit.name || '',
        address: lockerToEdit.address || '',
        latitude: lockerToEdit.latitude || 0,
        longitude: lockerToEdit.longitude || 0,
        is_active: lockerToEdit.is_active !== false,
      })
    } else {
      setFormData({
        name: '',
        address: '',
        latitude: 0,
        longitude: 0,
        is_active: true,
      })
    }
  }, [isEditMode, lockerToEdit, open])

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value })
  }

  const handleSubmit = () => {
    // Asegurar que latitude y longitude sean números
    const submitData = {
      ...formData,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    }
    onSubmit(submitData)
  }

  const modalButtons: ModalButton[] = [
    {
      label: 'Cancelar',
      onClick: onClose,
      variant: 'outlined',
    },
    {
      label: isEditMode ? 'Actualizar Locker' : 'Crear Locker',
      onClick: handleSubmit,
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Complete los datos del locker
        </Typography>

        <TextField
          label="Nombre del Locker"
          placeholder="Locker Centro"
          value={formData.name}
          onChange={handleChange('name')}
          fullWidth
          required
          helperText="Nombre descriptivo del locker"
          aria-label="Ingrese el nombre del locker"
          aria-required="true"
        />

        <TextField
          label="Dirección del Locker"
          placeholder="Calle 10 #15-30, Bogotá"
          value={formData.address}
          onChange={handleChange('address')}
          fullWidth
          required
          helperText="Dirección completa del locker"
          aria-label="Ingrese la dirección completa del locker"
          aria-required="true"
        />

        <TextField
          label="Latitud"
          placeholder="4.716900"
          type="number"
          value={formData.latitude}
          onChange={handleChange('latitude')}
          fullWidth
          required
          helperText="Coordenada de latitud (-90 a 90)"
          inputProps={{ step: 'any', min: -90, max: 90 }}
          aria-label="Ingrese la latitud del locker"
          aria-required="true"
        />

        <TextField
          label="Longitud"
          placeholder="-74.045600"
          type="number"
          value={formData.longitude}
          onChange={handleChange('longitude')}
          fullWidth
          required
          helperText="Coordenada de longitud (-180 a 180)"
          inputProps={{ step: 'any', min: -180, max: 180 }}
          aria-label="Ingrese la longitud del locker"
          aria-required="true"
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              color="primary"
              aria-label="Activar o desactivar el locker"
            />
          }
          label="Locker activo"
        />
      </Box>
    </CustomModal>
  )
}
