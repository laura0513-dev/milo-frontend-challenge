import React from 'react'
import { LocationOn, Add, Inventory2 } from '@mui/icons-material'
import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  Card,
  CardMedia,
  Chip,
  LinearProgress,
} from '@mui/material'
import { ASSETS } from '../../../shared/data/mockData.ts'

interface ClientDashboardProps {
  userName: string
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ userName }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Hola, {userName.split(' ')[0]} 👋
        </Typography>
        <IconButton
          color="primary"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 2,
          }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Featured Promo */}
      <Card
        sx={{
          position: 'relative',
          height: 200,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3,
        }}
      >
        <CardMedia
          component="img"
          image={ASSETS.burger}
          alt="Promo"
          sx={{
            height: '100%',
            width: '100%',
            transition: 'transform 0.5s',
            '&:hover': { transform: 'scale(1.1)' },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={{ color: 'warning.main', textTransform: 'uppercase', letterSpacing: 1 }}
          >
            Promo del día
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            50% OFF
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: 200, color: 'grey.300' }}>
            En tu primera orden de hamburguesas seleccionadas.
          </Typography>
        </Box>
      </Card>

      {/* Active Order Status */}
      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Orden en curso
          </Typography>
          <Chip label="En camino" color="warning" size="small" />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Combo Familiar
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subway • 2 items
            </Typography>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.100',
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Llega en 15 min
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: '#eff6ff',
              cursor: 'pointer',
              '&:hover': { background: '#dbeafe' },
            }}
          >
            <Box
              sx={{
                bgcolor: 'white',
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'info.main',
              }}
            >
              <LocationOn />
            </Box>
            <Typography fontWeight="bold" color="text.primary">
              Mis Direcciones
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              background: '#f3e8ff',
              cursor: 'pointer',
              '&:hover': { background: '#e9d5ff' },
            }}
          >
            <Box
              sx={{
                bgcolor: 'white',
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'secondary.main',
              }}
            >
              <Inventory2 />
            </Box>
            <Typography fontWeight="bold" color="text.primary">
              Mis Lockers
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
