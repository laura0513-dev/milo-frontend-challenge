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
import { LockerStatus } from '../../../shared/constants/enums.ts'
import { Locker } from '../../../shared/types.ts'

interface NewLockerFormProps {
  onSubmit?: (data: any) => void
  initialData?: Locker
}

export const NewLockerForm: React.FC<NewLockerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState({
    code: initialData?.code || '',
    location: initialData?.location || '',
    capacity: initialData?.capacity || '',
    status: initialData?.status || LockerStatus.AVAILABLE,
  })

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value })
  }

  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Complete los datos del nuevo locker
      </Typography>

      <TextField
        label="Código del Locker"
        placeholder="L001"
        value={formData.code}
        onChange={handleChange('code')}
        fullWidth
        required
        helperText="Código único identificador"
      />

      <TextField
        label="Ubicación"
        placeholder="Centro Comercial Plaza Norte"
        value={formData.location}
        onChange={handleChange('location')}
        fullWidth
        required
        helperText="Dirección o punto de referencia"
      />

      <FormControl fullWidth required>
        <InputLabel id="capacity-label">Capacidad</InputLabel>
        <Select
          labelId="capacity-label"
          label="Capacidad"
          value={formData.capacity}
          onChange={handleChange('capacity')}
        >
          <MenuItem value="small">Pequeña</MenuItem>
          <MenuItem value="medium">Mediana</MenuItem>
          <MenuItem value="large">Grande</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth required>
        <InputLabel id="status-label">Estado</InputLabel>
        <Select
          labelId="status-label"
          label="Estado"
          value={formData.status}
          onChange={handleChange('status')}
        >
          <MenuItem value={LockerStatus.AVAILABLE}>Disponible</MenuItem>
          <MenuItem value={LockerStatus.OCCUPIED}>Ocupado</MenuItem>
          <MenuItem value={LockerStatus.MAINTENANCE}>Mantenimiento</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Vista previa:
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip 
            label={formData.code || 'Sin código'} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={formData.capacity ? `Capacidad: ${formData.capacity === 'small' ? 'Pequeña' : formData.capacity === 'medium' ? 'Mediana' : 'Grande'}` : 'Sin capacidad'} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={formData.status === LockerStatus.AVAILABLE ? 'Disponible' : formData.status === LockerStatus.OCCUPIED ? 'Ocupado' : 'Mantenimiento'} 
            size="small" 
            color={formData.status === LockerStatus.AVAILABLE ? 'success' : formData.status === LockerStatus.OCCUPIED ? 'error' : 'default'}
          />
        </Stack>
      </Box>
    </Box>
  )
}
