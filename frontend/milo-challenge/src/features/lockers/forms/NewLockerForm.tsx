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
} from '@mui/material'
import { Locker } from '../../../shared/types.ts'
import { newLockerFormStyles } from './NewLockerForm.styles.ts'

interface NewLockerFormProps {
  onSubmit?: (data: any) => void
  initialData?: Locker
}

export const NewLockerForm: React.FC<NewLockerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    address: initialData?.address || '',
    is_active: initialData?.is_active !== undefined ? initialData.is_active : true,
  })

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value })
  }

  return (
    <Box component="form" sx={newLockerFormStyles.form} aria-label="Formulario para crear un nuevo locker">
      <Typography variant="body2" color="text.secondary" sx={newLockerFormStyles.description}>
        Complete los datos del nuevo locker
      </Typography>

      <TextField
        label="Nombre del Locker"
        placeholder="Locker Centro Comercial"
        value={formData.name}
        onChange={handleChange('name')}
        fullWidth
        required
        helperText="Nombre identificador del locker"
        aria-label="Ingrese el nombre del locker"
        aria-required="true"
      />

      <TextField
        label="Dirección"
        placeholder="Av. Principal 123, Centro Comercial Plaza Norte"
        value={formData.address}
        onChange={handleChange('address')}
        fullWidth
        required
        helperText="Dirección completa del locker"
        aria-label="Ingrese la dirección completa del locker"
        aria-required="true"
      />

      <FormControl fullWidth required>
        <InputLabel id="is-active-label">Estado</InputLabel>
        <Select
          labelId="is-active-label"
          label="Estado"
          value={formData.is_active}
          onChange={handleChange('is_active')}
          aria-label="Seleccione el estado del locker"
          aria-required="true"
        >
          <MenuItem value={true as any}>Activo</MenuItem>
          <MenuItem value={false as any}>Inactivo</MenuItem>
        </Select>
      </FormControl>

      <Box sx={newLockerFormStyles.previewContainer}>
        <Typography variant="caption" color="text.secondary" sx={newLockerFormStyles.previewLabel}>
          Vista previa:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip 
            label={formData.name || 'Sin nombre'} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={formData.is_active ? 'Activo' : 'Inactivo'} 
            size="small" 
            color={formData.is_active ? 'success' : 'default'}
          />
        </Stack>
      </Box>
    </Box>
  )
}
