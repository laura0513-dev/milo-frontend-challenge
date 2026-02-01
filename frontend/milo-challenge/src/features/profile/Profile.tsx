import React from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { usePageLoading } from '../../shared/hooks/usePageLoading.ts'
import { LoadingState } from '../../shared/components/ui/index.ts'
import { CameraAlt, Email, Phone, LocationOn, Save } from '@mui/icons-material'
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  IconButton, 
  Grid,
  InputAdornment
} from '@mui/material'
import { profileStyles } from './Profile.styles.ts'

const Profile = () => {
  const { user } = useAuth()
  const isLoading = usePageLoading()

  if (!user) return null

  if (isLoading) {
    return <LoadingState message="Cargando perfil..." />
  }

  return (
    <Box sx={profileStyles.container}>
      <Typography variant="h5" sx={profileStyles.title}>Mi Perfil</Typography>

      <Paper sx={profileStyles.paper}>
        {/* Header/Cover */}
        <Box sx={profileStyles.coverHeader} />
        
        <Box sx={profileStyles.paperContent}>
          <Box sx={profileStyles.avatarContainer}>
            <Box sx={profileStyles.avatarWrapper}>
               <Avatar 
                 src={user.avatarUrl} 
                 alt="Profile" 
                 sx={profileStyles.avatar}
               />
               <IconButton sx={profileStyles.cameraButton}>
                 <CameraAlt sx={profileStyles.cameraIcon} />
               </IconButton>
            </Box>
          </Box>

          <form>
             <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     label="Nombre Completo"
                     defaultValue={user.name}
                     variant="outlined"
                   />
                </Grid>
                
                <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     label="Correo Electrónico"
                     defaultValue={user.email}
                     InputProps={{
                       readOnly: true,
                       startAdornment: (
                         <InputAdornment position="start">
                           <Email sx={profileStyles.inputIcon} />
                         </InputAdornment>
                       ),
                     }}
                     variant="filled"
                   />
                </Grid>

                <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     label="Teléfono"
                     defaultValue={user.phone}
                     placeholder="+57 300 ..."
                     InputProps={{
                       startAdornment: (
                         <InputAdornment position="start">
                           <Phone sx={profileStyles.inputIcon} />
                         </InputAdornment>
                       ),
                     }}
                   />
                </Grid>

                <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     label="Dirección Principal"
                     defaultValue={user.address}
                     placeholder="Calle 123..."
                     InputProps={{
                       startAdornment: (
                         <InputAdornment position="start">
                           <LocationOn sx={profileStyles.inputIcon} />
                         </InputAdornment>
                       ),
                     }}
                   />
                </Grid>
             </Grid>

             <Box sx={profileStyles.formFooter}>
                <Button 
                  variant="contained" 
                  startIcon={<Save />}
                  sx={profileStyles.saveButton}
                >
                  Guardar Cambios
                </Button>
             </Box>
          </form>
        </Box>
      </Paper>
    </Box>
  )
}

export default Profile;
