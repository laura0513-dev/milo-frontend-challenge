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
import { OrderStatus } from '../../../shared/constants/enums.ts'
import { Order } from '../../../shared/types.ts'

interface NewOrderFormProps {
  isAdmin?: boolean
  onSubmit?: (data: any) => void
  initialData?: Order
}

export const NewOrderForm: React.FC<NewOrderFormProps> = ({ isAdmin = false, onSubmit, initialData }) => {
  const [formData, setFormData] = React.useState({
    clientId: initialData?.userId || '',
    items: initialData?.items.join(', ') || '',
    total: initialData?.total.toString() || '',
    lockerId: initialData?.lockerId || '',
    status: initialData?.status || OrderStatus.PENDING,
  })

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value })
  }

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
            value={formData.clientId}
            onChange={handleChange('clientId')}
          >
            <MenuItem value="client1">Juan Pérez</MenuItem>
            <MenuItem value="client2">María García</MenuItem>
            <MenuItem value="client3">Carlos Rodríguez</MenuItem>
          </Select>
        </FormControl>
      )}

      <TextField
        label="Items"
        placeholder="Hamburguesa Clásica, Papas Fritas..."
        multiline
        rows={3}
        value={formData.items}
        onChange={handleChange('items')}
        fullWidth
        helperText="Separe los items con comas"
      />

      <TextField
        label="Total"
        type="number"
        placeholder="15000"
        value={formData.total}
        onChange={handleChange('total')}
        fullWidth
        InputProps={{
          startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
        }}
      />

      <FormControl fullWidth>
        <InputLabel id="locker-label">Locker</InputLabel>
        <Select
          labelId="locker-label"
          label="Locker"
          value={formData.lockerId}
          onChange={handleChange('lockerId')}
        >
          <MenuItem value="L001">L001 - Centro Comercial</MenuItem>
          <MenuItem value="L002">L002 - Estación Metro</MenuItem>
          <MenuItem value="L003">L003 - Universidad</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-label">Estado</InputLabel>
        <Select
          labelId="status-label"
          label="Estado"
          value={formData.status}
          onChange={handleChange('status')}
        >
          <MenuItem value={OrderStatus.PENDING}>Pendiente</MenuItem>
          <MenuItem value={OrderStatus.PREPARING}>Preparando</MenuItem>
          <MenuItem value={OrderStatus.READY}>Listo</MenuItem>
          <MenuItem value={OrderStatus.DELIVERED}>Entregado</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Vista previa:
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`Total: $${formData.total || '0'}`} size="small" variant="outlined" />
          <Chip label={formData.lockerId || 'Sin locker'} size="small" color="primary" variant="outlined" />
        </Stack>
      </Box>
    </Box>
  )
}
