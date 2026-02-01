import React from 'react'
import { usePageLoading } from '../hooks/usePageLoading.ts'
import { LoadingState } from '../components/ui/index.ts'
import { MOCK_USERS } from '../data/mockData.ts'
import { Search, Email, Phone, LocationOn } from '@mui/icons-material'
import { 
  Box, 
  Typography, 
  Paper, 
  InputBase, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Avatar,
  Stack
} from '@mui/material'

const Clients = () => {
  const isLoading = usePageLoading()
  
  if (isLoading) {
    return <LoadingState message="Cargando clientes..." />
  }

  const clients = MOCK_USERS.filter(u => u.role === 'client')

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" fontWeight="bold">Gestión de Clientes</Typography>

      <Paper 
        component="form" 
        sx={{ 
          p: '2px 4px', 
          display: 'flex', 
          alignItems: 'center', 
          width: '100%', 
          borderRadius: 3,
          boxShadow: 0,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <Search sx={{ color: 'text.secondary' }} />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar clientes..."
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 0 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Contacto</TableCell>
              <TableCell sx={{ color: 'text.secondary', fontWeight: 'medium' }}>Ubicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow
                key={client.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={client.avatarUrl} alt={client.name} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">{client.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: { md: 'none' } }}>
                        {client.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                       <Email sx={{ fontSize: 16 }} />
                       <Typography variant="caption">{client.email}</Typography>
                     </Box>
                     {client.phone && (
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                         <Phone sx={{ fontSize: 16 }} />
                         <Typography variant="caption">{client.phone}</Typography>
                       </Box>
                     )}
                  </Stack>
                </TableCell>
                <TableCell>
                   {client.address ? (
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                       <LocationOn sx={{ fontSize: 16 }} />
                       <Typography variant="caption">{client.address}</Typography>
                     </Box>
                   ) : (
                     <Typography variant="caption" color="text.disabled" fontStyle="italic">Sin dirección</Typography>
                   )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Clients;
