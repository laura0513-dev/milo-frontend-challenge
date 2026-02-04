import React, { useState, useEffect } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { LoadingState, ActionMenu, ErrorState } from '../../shared/components/ui/index.ts'
import { ASSETS } from '../../shared/constants/assets.ts'
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
  const { user, token } = useAuth()
  const [lockers, setLockers] = useState<Locker[]>([])
  const [isLoadingLockers, setIsLoadingLockers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openModal, setOpenModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [lockerToEdit, setLockerToEdit] = useState<Locker | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [lockerToDelete, setLockerToDelete] = useState<Locker | null>(null)

  useEffect(() => {
    const loadLockers = async () => {
      if (!token) {
        setIsLoadingLockers(false)
        return
      }

      setError(null)
      try {
        const fetchedLockers = await lockerService.getAllLockers(token)
        setLockers(fetchedLockers)
      } catch (error) {
        console.error('Error cargando lockers:', error)
        setError('Algo salió mal, intenta de nuevo más tarde')
        setLockers([])
      } finally {
        setIsLoadingLockers(false)
      }
    }

    loadLockers()
  }, [token])

  const handleCloseModal = () => {
    setOpenModal(false)
    setIsEditMode(false)
    setLockerToEdit(null)
  }

  const handleEditLocker = async (lockerId: string) => {
    if (!token) return
    try {
      const locker = await lockerService.getLockerById(Number(lockerId), token)
      if (!locker) {
        setError('Algo salió mal, intenta de nuevo más tarde')
        return
      }
      setLockerToEdit(locker)
      setIsEditMode(true)
      setOpenModal(true)
    } catch (error) {
      console.error('Error al obtener locker para editar:', error)
      setError('Algo salió mal, intenta de nuevo más tarde')
    }
  }

  const handleCreateLocker = async (data: any) => {
    if (!token || !user) return
    
    try {
      if (isEditMode && lockerToEdit) {
        // Editar locker existente
        const updatedLocker = await lockerService.updateLocker(Number(lockerToEdit.id), data, token)
        if (updatedLocker) {
          // Actualizar el locker en la lista
          setLockers(lockers.map(l => l.id === updatedLocker.id ? updatedLocker : l))
          setOpenModal(false)
          setIsEditMode(false)
          setLockerToEdit(null)
        } else {
          setError('Algo salió mal, intenta de nuevo más tarde')
        }
      } else {
        // Crear nuevo locker - agregar created_by
        const lockerData = {
          ...data,
          created_by: parseInt(user.id)
        }
        const newLocker = await lockerService.createLocker(lockerData, token)
        if (newLocker) {
          // Agregar el nuevo locker a la lista
          setLockers([...lockers, newLocker])
          setOpenModal(false)
          setIsEditMode(false)
          setLockerToEdit(null)
        } else {
          setError('Algo salió mal, intenta de nuevo más tarde')
        }
      }
    } catch (error) {
      console.error('Error creando/editando locker:', error)
      setError('Algo salió mal, intenta de nuevo más tarde')
    }
  }

  const handleOpenDeleteModal = (locker: Locker) => {
    setLockerToDelete(locker)
    setOpenDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (lockerToDelete && token) {
      try {
        const result = await lockerService.deleteLocker(Number(lockerToDelete.id), token)
        if (result) {
          // Eliminar el locker de la lista localmente
          setLockers(lockers.filter(l => l.id !== lockerToDelete.id))
          setOpenDeleteModal(false)
          setLockerToDelete(null)
        } else {
          setError('Algo salió mal, intenta de nuevo más tarde')
        }
      } catch (error) {
        console.error('Error al eliminar el locker:', error)
        setError('Algo salió mal, intenta de nuevo más tarde')
      }
    }
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
    setLockerToDelete(null)
  }

  const handleRetry = async () => {
    if (!token) return
    setIsLoadingLockers(true)
    setError(null)
    try {
      const fetchedLockers = await lockerService.getAllLockers(token)
      setLockers(fetchedLockers)
    } catch (error) {
      console.error('Error cargando lockers:', error)
      setError('Algo salió mal, intenta de nuevo más tarde')
    } finally {
      setIsLoadingLockers(false)
    }
  }

  if (!user) return null

  if (isLoadingLockers) {
    return <LoadingState message="Cargando lockers..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} fullHeight />
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
        {lockers.map((locker) => (
          // @ts-ignore - MUI Grid type issue
          <Grid item xs={12} sm={6} lg={4} key={String(locker.id)} sx={lockersStyles.gridItem}>
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
                      label={locker.is_active !== false ? 'Activo' : 'Inactivo'}
                      color={locker.is_active !== false ? 'success' : 'default'}
                      size="small"
                      sx={lockersStyles.statusBadge}
                   />
                 </Box>
               </Box>
              
              <CardContent sx={lockersStyles.cardContent}>
                <Box sx={lockersStyles.cardHeaderContainer}>
                  <Box sx={lockersStyles.cardTitleContainer}>
                    <Typography variant="h6" sx={lockersStyles.cardTitle}>
                      {locker.name}
                    </Typography>
                    <Box sx={lockersStyles.locationContainer}>
                      <LocationOn sx={lockersStyles.locationIcon} />
                      <Typography variant="body2" sx={lockersStyles.locationText}>
                        {locker.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={lockersStyles.iconBox}>
                     <Inventory2 sx={lockersStyles.inventoryIcon} />
                  </Box>
                </Box>
                
                <Box sx={lockersStyles.cardFooter}>
                  <Chip 
                    label={`Lat: ${Number(locker.latitude).toFixed(4)} | Lng: ${Number(locker.longitude).toFixed(4)}`}
                    variant="outlined"
                    size="small"
                    sx={lockersStyles.coordinatesChip}
                  />
                  
                  {user.role === 'admin' && (
                     <ActionMenu
                       buttonIcon={Settings}
                       size="small"
                       actions={[
                         {
                           label: 'Editar',
                           icon: Edit,
                           onClick: () => handleEditLocker(String(locker.id)),
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
