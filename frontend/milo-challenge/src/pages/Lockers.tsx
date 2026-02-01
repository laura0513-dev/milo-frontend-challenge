import React from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import { usePageLoading } from '../hooks/usePageLoading.ts'
import { LoadingState } from '../components/ui/index.ts'
import { MOCK_LOCKERS, ASSETS } from '../data/mockData.ts'
import { LocationOn, Inventory2, Add, Settings } from '@mui/icons-material'
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton, 
  Chip 
} from '@mui/material'

const Lockers = () => {
  const { user } = useAuth()
  const isLoading = usePageLoading()

  if (!user) return null

  if (isLoading) {
    return <LoadingState message="Cargando lockers..." />
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
       <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">Lockers Disponibles</Typography>
        {user.role === 'admin' && (
          <Button 
            variant="contained" 
            startIcon={<Add />}
          >
            Nuevo Locker
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {MOCK_LOCKERS.map((locker) => (
          <Grid item xs={12} sm={6} lg={4} key={locker.id}>
            <Card sx={{ position: 'relative' }}>
               <Box sx={{ position: 'relative', height: 140 }}>
                 <CardMedia
                   component="img"
                   image={ASSETS.locker}
                   alt="Locker"
                   sx={{ height: '100%', width: '100%' }}
                 />
                 <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                   <Chip 
                      label={locker.status === 'available' ? 'Libre' : locker.status === 'occupied' ? 'Ocupado' : 'Mtto.'}
                      color={locker.status === 'available' ? 'success' : locker.status === 'occupied' ? 'error' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold', color: 'white' }}
                   />
                 </Box>
               </Box>
              
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{locker.code}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{locker.location}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                     <Inventory2 sx={{ color: 'text.secondary' }} />
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip 
                    label={`Capacidad: ${locker.capacity === 'small' ? 'Pequeña' : locker.capacity === 'medium' ? 'Mediana' : 'Grande'}`}
                    variant="outlined"
                    size="small"
                  />
                  
                  {user.role === 'admin' && (
                     <IconButton size="small">
                       <Settings fontSize="small" />
                     </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default Lockers;
