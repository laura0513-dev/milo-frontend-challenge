import React, { useMemo } from 'react'
import { useCurrentUser, useAsync, usePageLoading } from '../hooks/index.ts'
import { orderService } from '../services/orderService.ts'
import { lockerService } from '../services/lockerService.ts'
import { OrderStatus, LockerStatus, UserRole } from '../constants/enums.ts'
import { ASSETS } from '../data/mockData.ts'
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
  LinearProgress,
} from '@mui/material'
import { StatCard, LoadingState, ErrorState } from '../components/ui/index.ts'

const DashboardHome: React.FC = () => {
  const { user, isAdmin, isClient } = useCurrentUser()
  const isPageLoading = usePageLoading()

  // Cargar datos de órdenes y lockers - ANTES del if
  const { data: orders, loading: ordersLoading, error: ordersError } = useAsync(
    () => orderService.getOrders(),
    true,
  )

  const { data: lockers, loading: lockersLoading, error: lockersError } = useAsync(
    () => lockerService.getLockers(),
    true,
  )

  // Métricas para admin
  const adminMetrics = useMemo(
    () => ({
      totalOrders: orders?.length || 0,
      availableLockers: lockers?.filter((l) => l.status === LockerStatus.AVAILABLE).length || 0,
      pendingDeliveries: orders?.filter((o) => o.status === OrderStatus.PREPARING).length || 0,
    }),
    [orders, lockers],
  )

  if (isPageLoading) {
    return <LoadingState message="Cargando dashboard..." />
  }

  if (!user) return null

  if (isAdmin) {
    if (ordersLoading || lockersLoading) return <LoadingState fullHeight />
    if (ordersError || lockersError)
      return <ErrorState title="Error" message="No se pudieron cargar los datos" fullHeight />

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Panel de Administración
        </Typography>

        {/* Stats Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={Inventory}
              label="Total"
              value={adminMetrics.totalOrders}
              subtitle="Órdenes Activas"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={CheckCircle}
              label="Disponibles"
              value={adminMetrics.availableLockers}
              subtitle="Lockers Libres"
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              icon={AccessTime}
              label="Hoy"
              value={adminMetrics.pendingDeliveries}
              subtitle="Entregas Pendientes"
              color="warning"
            />
          </Grid>
        </Grid>

        {/* Recent Activity Section */}
        <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Actividad Reciente
          </Typography>
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
                  cursor: 'pointer',
                }}
              >
                <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Nueva orden #ORD-{100 + i}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Hace {i * 15} minutos
                  </Typography>
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
  if (isClient) {
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

  return null
}

export default DashboardHome
