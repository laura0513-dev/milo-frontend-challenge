import React from 'react'
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material'
import { CreateOrderRequest, LockerNearby } from '../../../shared/types.ts'
import { lockerService } from '../../lockers/lockerService.ts'
import { useAuth } from '../../auth/AuthContext.tsx'
import { MyLocation } from '@mui/icons-material'

interface NewOrderFormProps {
  isAdmin?: boolean
  onSubmit?: (data: CreateOrderRequest) => void
  userId?: number
  onValidityChange?: (isValid: boolean) => void
}

export interface NewOrderFormRef {
  submit: () => void
  isValid: () => boolean
}

export const NewOrderForm = React.forwardRef<NewOrderFormRef, NewOrderFormProps>(({ isAdmin = false, onSubmit, userId, onValidityChange }, ref) => {
  const { token } = useAuth()
  const [formData, setFormData] = React.useState<{
    user_id: string
    locker_id: string
    latitude: string
    longitude: string
  }>({
    user_id: userId?.toString() || '',
    locker_id: '',
    latitude: '',
    longitude: '',
  })

  const [nearbyLockers, setNearbyLockers] = React.useState<LockerNearby[]>([])
  const [isLoadingLockers, setIsLoadingLockers] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)

  // Actualizar user_id cuando cambia el prop userId
  React.useEffect(() => {
    if (userId) {
      setFormData(prev => ({ ...prev, user_id: userId.toString() }))
    }
  }, [userId])

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value })
  }

  const handleSearchNearbyLockers = async () => {
    if (!formData.latitude || !formData.longitude || !token) {
      return
    }

    setIsLoadingLockers(true)
    setHasSearched(true)
    try {
      const lockers = await lockerService.getLockersByDistance(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude),
        token
      )
      // Asegurar que lockers es un array
      const lockersArray = Array.isArray(lockers) ? lockers : []
      setNearbyLockers(lockersArray)
      // Resetear el locker seleccionado si ya no está en la lista
      if (formData.locker_id && !lockersArray.find(l => String(l.id) === formData.locker_id)) {
        setFormData({ ...formData, locker_id: '' })
      }
    } catch (error) {
      console.error('Error fetching nearby lockers:', error)
      setNearbyLockers([])
    } finally {
      setIsLoadingLockers(false)
    }
  }

  const isValid = () => {
    return !!(formData.user_id && formData.locker_id)
  }

  // Notificar cambios en la validez del formulario
  React.useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid())
    }
  }, [formData.user_id, formData.locker_id, onValidityChange])

  const handleSubmit = () => {
    if (onSubmit && isValid()) {
      const orderData: CreateOrderRequest = {
        user_id: parseInt(formData.user_id),
        locker_id: parseInt(formData.locker_id),
      }
      console.log('📦 Datos de la orden a enviar:', orderData)
      onSubmit(orderData)
    }
  }

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    isValid,
  }))

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Complete los datos de la nueva orden
      </Typography>

      {isAdmin && (
        <FormControl fullWidth>
          <InputLabel id="client-label">Cliente</InputLabel>
          <Select
            labelId="client-label"
            label="Cliente"
            value={formData.user_id}
            onChange={handleChange('user_id')}
          >
            <MenuItem value="" disabled>Seleccione un cliente</MenuItem>
            {/* TODO: Cargar clientes desde el backend */}
            <MenuItem value="2">Cliente de ejemplo</MenuItem>
          </Select>
        </FormControl>
      )}

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" fontWeight="medium" color="text.primary" sx={{ mb: 2 }}>
          Ubicación de entrega
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Latitud"
            type="number"
            placeholder="4.7110"
            value={formData.latitude}
            onChange={handleChange('latitude')}
            fullWidth
            required
            inputProps={{ step: 'any' }}
            helperText="Ej: 4.7110 (Bogotá)"
          />
          <TextField
            label="Longitud"
            type="number"
            placeholder="-74.0721"
            value={formData.longitude}
            onChange={handleChange('longitude')}
            fullWidth
            required
            inputProps={{ step: 'any' }}
            helperText="Ej: -74.0721 (Bogotá)"
          />
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          startIcon={isLoadingLockers ? <CircularProgress size={16} /> : <MyLocation />}
          onClick={handleSearchNearbyLockers}
          disabled={!formData.latitude || !formData.longitude || isLoadingLockers}
          sx={{ mb: 2 }}
        >
          {isLoadingLockers ? 'Buscando lockers...' : 'Buscar lockers cercanos'}
        </Button>
      </Box>

      <FormControl fullWidth required disabled={!hasSearched || isLoadingLockers}>
        <InputLabel id="locker-label">Locker de entrega</InputLabel>
        <Select
          labelId="locker-label"
          label="Locker de entrega"
          value={formData.locker_id}
          onChange={handleChange('locker_id')}
        >
          {nearbyLockers.length === 0 && hasSearched && !isLoadingLockers ? (
            <MenuItem value="" disabled>
              No hay lockers cercanos disponibles
            </MenuItem>
          ) : (
            nearbyLockers.map((locker) => (
              <MenuItem key={locker.id} value={String(locker.id)}>
                {locker.name} - {locker.address}
                {locker.distance ? ` (${locker.distance.toFixed(2)} km)` : ''}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {formData.locker_id && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Información de la orden:
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip 
              label="Estado: En preparación" 
              size="small" 
              color="info" 
              variant="outlined" 
            />
            <Chip 
              label={`Locker #${formData.locker_id}`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Stack>
        </Box>
      )}
    </Box>
  )
})
