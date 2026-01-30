import React from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import { MOCK_ORDERS, MOCK_LOCKERS, ASSETS } from '../data/mockData.ts'
import { Inventory, AccessTime, CheckCircle, LocationOn, Add, Inventory2 } from '@mui/icons-material'
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  IconButton, 
  Card, 
  CardMedia, 
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material'

export const DashboardHome = () => {
  const { user } = useAuth()

  if (!user) return null

  if (user.role === 'admin') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">Panel de Administración</Typography>
        
        {/* Stats Grid */}
        <Grid container spacing={3}>
          {[
            { 
              icon: Inventory, 
              color: 'primary.main', 
              bgcolor: 'primary.light', 
              label: 'Total', 
              value: MOCK_ORDERS.length, 
              sub: 'Órdenes Activas' 
            },
            { 
              icon: CheckCircle, 
              color: 'success.main', 
              bgcolor: 'success.light', 
              label: 'Disponibles', 
              value: MOCK_LOCKERS.filter(l => l.status === 'available').length, 
              sub: 'Lockers Libres' 
            },
            { 
              icon: AccessTime, 
              color: 'warning.main', 
              bgcolor: 'warning.light', 
              label: 'Hoy', 
              value: 12, 
              sub: 'Entregas Pendientes' 
            }
          ].map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box 
                sx={{ 
                  transition: 'transform 0.2s', 
                  '&:hover': { transform: 'scale(1.02)' } 
                }}
              >
                <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: stat.bgcolor, 
                        color: stat.color, 
                        borderRadius: 3, 
                        display: 'flex',
                        background: (theme) => `rgba(${theme.palette.primary.main}, 0.1)` // simplified
                      }}
                    >
                      <stat.icon />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" color="text.primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.sub}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity Section */}
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Actividad Reciente</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Box 
                key={i} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 2, 
                  borderRadius: 2, 
                  '&:hover': { bgcolor: 'action.hover' },
                  cursor: 'pointer'
                }}
              >
                <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold">Nueva orden #ORD-{100+i}</Typography>
                  <Typography variant="caption" color="text.secondary">Hace {i * 15} minutos</Typography>
                </Box>
                <Chip label="Nuevo" size="small" color="primary" sx={{ height: 24 }} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    )
  }

  // Client View
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Hola, {user.name.split(' ')[0]} 👋
        </Typography>
        <IconButton 
          color="primary" 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            '&:hover': { bgcolor: 'primary.dark' },
            boxShadow: 2
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
          boxShadow: 3 
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
            '&:hover': { transform: 'scale(1.1)' } 
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
            color: 'white'
          }}
        >
          <Typography variant="caption" fontWeight="bold" sx={{ color: 'warning.main', textTransform: 'uppercase', letterSpacing: 1 }}>
            Promo del día
          </Typography>
          <Typography variant="h3" fontWeight="bold">50% OFF</Typography>
          <Typography variant="body2" sx={{ maxWidth: 200, color: 'grey.300' }}>
            En tu primera orden de hamburguesas seleccionadas.
          </Typography>
        </Box>
      </Card>

      {/* Active Order Status */}
      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Orden en curso</Typography>
          <Chip label="En camino" color="warning" size="small" />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box 
            sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: 2, 
              overflow: 'hidden', 
              flexShrink: 0 
            }}
          >
             <Box component="img" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">Combo Familiar</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>Subway • 2 items</Typography>
            <LinearProgress 
              variant="determinate" 
              value={75} 
              sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }} 
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>Llega en 15 min</Typography>
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
              bgcolor: 'info.lighter', 
              background: '#eff6ff', 
              cursor: 'pointer',
              '&:hover': { background: '#dbeafe' }
            }}
          >
            <Box sx={{ bgcolor: 'white', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'info.main' }}>
              <LocationOn />
            </Box>
            <Typography fontWeight="bold" color="text.primary">Mis Direcciones</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
           <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              background: '#f3e8ff', 
              cursor: 'pointer',
              '&:hover': { background: '#e9d5ff' }
            }}
          >
            <Box sx={{ bgcolor: 'white', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, color: 'secondary.main' }}>
              <Inventory2 />
            </Box>
            <Typography fontWeight="bold" color="text.primary">Mis Lockers</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
