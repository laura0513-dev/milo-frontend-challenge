import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { LoadingState, ErrorState } from '../../shared/components/ui/index.ts'
import { User } from '../../shared/types.ts'
import { clientService } from './clientService.ts'
import { Search, Email, Phone, LocationOn } from '@mui/icons-material'
import { clientsStyles } from './Clients.styles.ts'
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

const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    'client': 'Cliente',
    'delivery': 'Delivery',
    'admin': 'Administrador'
  }
  return roleLabels[role] || role
}

const Clients = () => {
  const { token, user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadUsers = async () => {
      if (!token || !user) {
        setIsLoadingUsers(false)
        return
      }

      // Verificar que el usuario sea admin
      if (user.role !== 'admin') {
        setError('No tienes permisos para ver esta página')
        setIsLoadingUsers(false)
        return
      }

      setError(null)
      try {
        const fetchedUsers = await clientService.getAllUsers(token)
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error cargando usuarios:', error)
        setError('Algo salió mal, intenta de nuevo más tarde')
        setUsers([])
      } finally {
        setIsLoadingUsers(false)
      }
    }

    loadUsers()
  }, [token, user])

  const handleRetry = async () => {
    if (!token || !user) return
    
    // Verificar que el usuario sea admin
    if (user.role !== 'admin') {
      setError('No tienes permisos para ver esta página')
      return
    }

    setIsLoadingUsers(true)
    setError(null)
    try {
      const fetchedUsers = await clientService.getAllUsers(token)
      setUsers(fetchedUsers)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      setError('Algo salió mal, intenta de nuevo más tarde')
    } finally {
      setIsLoadingUsers(false)
    }
  }
  
  if (isLoadingUsers) {
    return <LoadingState message="Cargando usuarios..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} fullHeight />
  }

  return (
    <Box sx={clientsStyles.container}>
      <Typography variant="h5" sx={clientsStyles.title}>Gestión de Usuarios</Typography>

      <Paper 
        component="form" 
        sx={clientsStyles.searchPaper}
      >
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <Search sx={{ color: 'text.secondary' }} />
        </IconButton>
        <InputBase
          sx={clientsStyles.searchInput}
          placeholder="Buscar usuarios..."
        />
      </Paper>

      <TableContainer component={Paper} sx={clientsStyles.tableContainer}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={clientsStyles.tableHead}>
            <TableRow>
              <TableCell sx={clientsStyles.tableHeaderCell}>Usuario</TableCell>
              <TableCell sx={clientsStyles.tableHeaderCell}>Rol</TableCell>
              <TableCell sx={clientsStyles.tableHeaderCell}>Contacto</TableCell>
              <TableCell sx={clientsStyles.tableHeaderCell}>Ubicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay usuarios registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((client) => (
              <TableRow
                key={client.id}
                sx={clientsStyles.tableRow}
              >
                <TableCell component="th" scope="row">
                  <Box sx={clientsStyles.clientNameBox}>
                    <Avatar src={client.avatarUrl} alt={client.name} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">{client.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={clientsStyles.clientNameText}>
                        {client.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {getRoleLabel(client.role)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack sx={clientsStyles.contactStack}>
                     <Box sx={clientsStyles.contactItem}>
                       <Email sx={clientsStyles.iconSize} />
                       <Typography variant="caption">{client.email}</Typography>
                     </Box>
                     {client.phone && (
                       <Box sx={clientsStyles.contactItem}>
                         <Phone sx={clientsStyles.iconSize} />
                         <Typography variant="caption">{client.phone}</Typography>
                       </Box>
                     )}
                  </Stack>
                </TableCell>
                <TableCell>
                   {client.address ? (
                     <Box sx={clientsStyles.locationBox}>
                       <LocationOn sx={clientsStyles.iconSize} />
                       <Typography variant="caption">{client.address}</Typography>
                     </Box>
                   ) : (
                     <Typography variant="caption" color="text.disabled" sx={clientsStyles.emptyLocationText}>Sin dirección</Typography>
                   )}
                </TableCell>
              </TableRow>
            )))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default Clients;
