import React from 'react'
import { useAuth } from '../context/AuthContext.tsx'
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

const Profile = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h5" fontWeight="bold">Mi Perfil</Typography>

      <Paper sx={{ overflow: 'hidden', borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: 1 }}>
        {/* Header/Cover */}
        <Box 
          sx={{ 
            height: 128, 
            background: 'linear-gradient(to right, #fb923c, #ef4444)' // orange-400 to red-500
          }}
        />
        
        <Box sx={{ px: 3, pb: 4 }}>
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: -6, mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
               <Avatar 
                 src={user.avatarUrl} 
                 alt="Profile" 
                 sx={{ width: 96, height: 96, border: '4px solid white', bgcolor: 'white' }}
               />
               <IconButton 
                 sx={{ 
                   position: 'absolute', 
                   bottom: 0, 
                   right: 0, 
                   bgcolor: 'grey.900', 
                   color: 'white', 
                   border: '2px solid white', 
                   p: 0.5,
                   '&:hover': { bgcolor: 'grey.800' } 
                 }}
               >
                 <CameraAlt sx={{ fontSize: 16 }} />
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
                           <Email sx={{ color: 'text.secondary', mr: 1 }} />
                         </InputAdornment>
                       ),
                     }}
                     variant="filled" // to show it's read-only visually distinct
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
                           <Phone sx={{ color: 'text.secondary', mr: 1 }} />
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
                           <LocationOn sx={{ color: 'text.secondary', mr: 1 }} />
                         </InputAdornment>
                       ),
                     }}
                   />
                </Grid>
             </Grid>

             <Box sx={{ pt: 3, mt: 3, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<Save />}
                  sx={{ boxShadow: 2 }}
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
