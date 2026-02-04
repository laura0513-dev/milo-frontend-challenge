import React from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
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

  if (!user) return null

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
               <IconButton sx={profileStyles.cameraButton} aria-label="Cambiar foto de perfil">
                 <CameraAlt sx={profileStyles.cameraIcon} />
               </IconButton>
            </Box>
          </Box>

          <form aria-label="Formulario de perfil de usuario">
             <Grid container spacing={3}>
                {/* @ts-ignore - MUI Grid type issue */}
                <Grid item xs={12} md={6}>
                   <TextField
                     fullWidth
                     label="Nombre Completo"
                     defaultValue={user.name}
                     variant="outlined"
                     aria-label="Ingrese su nombre completo"
                   />
                </Grid>
                
                {/* @ts-ignore - MUI Grid type issue */}
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
                     aria-label="Correo electrónico (solo lectura)"
                     aria-readonly="true"
                   />
                </Grid>

                {/* @ts-ignore - MUI Grid type issue */}
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
                     aria-label="Ingrese su número de teléfono"
                   />
                </Grid>

                {/* @ts-ignore - MUI Grid type issue */}
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
                     aria-label="Ingrese su dirección principal"
                   />
                </Grid>
             </Grid>

             <Box sx={profileStyles.formFooter}>
                <Button 
                  variant="contained" 
                  startIcon={<Save />}
                  sx={profileStyles.saveButton}
                  aria-label="Guardar cambios en el perfil"
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
