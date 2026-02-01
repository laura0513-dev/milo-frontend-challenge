import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { usePageLoading } from '../../shared/hooks/usePageLoading.ts'
import { LoadingState, ActionMenu } from '../../shared/components/ui/index.ts'
import { MOCK_LOCKERS, ASSETS } from '../../shared/data/mockData.ts'
import { Locker } from '../../shared/types.ts'
import { LocationOn, Inventory2, Add, Settings, Edit, Delete } from '@mui/icons-material'
import { LockerFormModal } from './components/LockerFormModal.tsx'
import { DeleteLockerModal } from './components/DeleteLockerModal.tsx'
import { lockerService } from './lockerService.ts'
import { lockersStyles } from './Lockers.styles.ts'
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip 
} from '@mui/material'

const Lockers = () => {
  const { user } = useAuth()
  const isLoading = usePageLoading()
  const [openModal, setOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [lockerToEdit, setLockerToEdit] = useState<Locker | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [lockerToDelete, setLockerToDelete] = useState<Locker | null>(null)

  const handleCreateLocker = () => {
    console.log(isEditMode ? 'Actualizar locker' : 'Crear nuevo locker')
    setOpenModal(false)
    setIsEditMode(false)
    setLockerToEdit(null)
  }

  const handleEditLocker = async (lockerId: string) => {
    try {
      const locker = await lockerService.getLockerById(lockerId)
      setLockerToEdit(locker)
      setIsEditMode(true)
      setOpenModal(true)
    } catch (error) {
      console.error('Error al obtener locker para editar:', error)
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setIsEditMode(false)
    setLockerToEdit(null)
  }

  const handleOpenDeleteModal = (locker: Locker) => {
    setLockerToDelete(locker)
    setOpenDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (lockerToDelete) {
      try {
        console.log('Eliminando locker:', lockerToDelete.id)
        setOpenDeleteModal(false)
        setLockerToDelete(null)
      } catch (error) {
        console.error('Error al eliminar el locker:', error)
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setLockerToDelete(null)
  }

  if (!user) return null

  if (isLoading) {
    return <LoadingState message="Cargando lockers..." />
  }

  return (
    <Box sx={lockersStyles.container}>
       <Box sx={lockersStyles.header}>
        <Typography variant="h5" fontWeight="bold">Lockers Disponibles</Typography>
        {user.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setOpenModal(true)}
          >
            Nuevo Locker
          </Button>
        )}
      </Box>

      <Grid container spacing={lockersStyles.grid.spacing}>
        {MOCK_LOCKERS.map((locker) => (
          <Grid item xs={12} sm={6} lg={4} key={locker.id}>
            <Card sx={lockersStyles.card}>
               <Box sx={lockersStyles.cardMediaContainer}>
                 <CardMedia
                   component="img"
                   image={ASSETS.locker}
                   alt="Locker"
                   sx={lockersStyles.cardMedia}
                 />
                 <Box sx={lockersStyles.statusBadgeContainer}>
                   <Chip 
                      label={locker.status === 'available' ? 'Libre' : locker.status === 'occupied' ? 'Ocupado' : 'Mtto.'}
                      color={locker.status === 'available' ? 'success' : locker.status === 'occupied' ? 'error' : 'default'}
                      size="small"
                      sx={lockersStyles.statusBadge}
                   />
                 </Box>
               </Box>
              
              <CardContent>
                <Box sx={lockersStyles.cardHeaderContainer}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{locker.code}</Typography>
                    <Box sx={lockersStyles.locationContainer}>
                      <LocationOn sx={lockersStyles.locationIcon} />
                      <Typography variant="body2">{locker.location}</Typography>
                    </Box>
                  </Box>
                  <Box sx={lockersStyles.iconBox}>
                     <Inventory2 sx={lockersStyles.inventoryIcon} />
                  </Box>
                </Box>
                
                <Box sx={lockersStyles.cardFooter}>
                  <Chip 
                    label={`Capacidad: ${locker.capacity === 'small' ? 'Pequeña' : locker.capacity === 'medium' ? 'Mediana' : 'Grande'}`}
                    variant="outlined"
                    size="small"
                  />
                  
                  {user.role === 'admin' && (
                     <ActionMenu
                       buttonIcon={Settings}
                       size="small"
                       actions={[
                         {
                           label: 'Editar',
                           icon: Edit,
                           onClick: () => handleEditLocker(locker.id),
                           color: 'primary'
                         },
                         {
                           label: 'Eliminar',
                           icon: Delete,
                           onClick: () => handleOpenDeleteModal(locker),
                           color: 'error'
                         }
                       ]}
                     />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal Formulario de Locker (Crear/Editar) */}
      <LockerFormModal
        open={openModal}
        isEditMode={isEditMode}
        lockerToEdit={lockerToEdit}
        onClose={handleCloseModal}
        onSubmit={handleCreateLocker}
      />

      {/* Modal Confirmación Eliminar Locker */}
      <DeleteLockerModal
        open={openDeleteModal}
        locker={lockerToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  )
}

export default Lockers;
