import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inventory, LocalShipping, Warehouse } from '@mui/icons-material'
import { Box, Grid, Typography, Paper, Avatar, Chip } from '@mui/material'
import { StatCard } from '../../../shared/components/ui/index.ts'
import { adminDashboardStyles } from './styles/AdminDashboard.styles.ts'
import { ROUTES } from '../../../shared/constants/routes.ts'
import { Order } from '../../../shared/types.ts'

interface AdminDashboardProps {
  preparingOrders: number
  totalLockers: number
  inTransitOrders: number
  orders: Order[]
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  preparingOrders,
  totalLockers,
  inTransitOrders,
  orders = [],
}) => {
  const navigate = useNavigate()

  // Filtrar órdenes recientes (menos de 10 minutos) y ordenar por fecha descendente
  const recentOrders = useMemo(() => {
    const now = new Date()
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000)
    
    // Filtrar órdenes creadas hace menos de 10 minutos
    const recent = orders
      .filter(order => order.created_at && new Date(order.created_at) >= tenMinutesAgo)
      .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })
    
    // Si hay menos de 5 órdenes recientes, tomar las 5 más recientes en general
    if (recent.length < 5) {
      return orders
        .sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
        .slice(0, 5)
    }
    
    return recent.slice(0, 5)
  }, [orders])

  // Función para calcular el tiempo transcurrido
  const getTimeAgo = (date: string | undefined) => {
    if (!date) return 'N/A'
    const now = new Date()
    const orderDate = new Date(date)
    const diffMs = now.getTime() - orderDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    
    if (diffMinutes < 1) return 'Ahora mismo'
    if (diffMinutes === 1) return 'Hace 1 minuto'
    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`
    
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours === 1) return 'Hace 1 hora'
    if (diffHours < 24) return `Hace ${diffHours} horas`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Hace 1 día'
    return `Hace ${diffDays} días`
  }
  return (
    <Box sx={adminDashboardStyles.container}>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        Panel de Administración
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={adminDashboardStyles.statsGrid.spacing}>
        {/* @ts-ignore - MUI Grid type issue */}
        <Grid item xs={12} md={4}>
          <StatCard
            icon={Inventory}
            label="En preparación"
            value={preparingOrders}
            subtitle="Órdenes Activas"
            color="primary"
          />
        </Grid>
        {/* @ts-ignore - MUI Grid type issue */}
        <Grid item xs={12} md={4}>
          <StatCard
            icon={Warehouse}
            label="Total"
            value={totalLockers}
            subtitle="Lockers"
            color="success"
            onClick={() => navigate(ROUTES.LOCKERS)}
          />
        </Grid>
        {/* @ts-ignore - MUI Grid type issue */}
        <Grid item xs={12} md={4}>
          <StatCard
            icon={LocalShipping}
            label="En tránsito"
            value={inTransitOrders}
            subtitle="Órdenes Pendientes"
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Recent Activity Section */}
      <Paper sx={adminDashboardStyles.activityPaper}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Actividad Reciente
        </Typography>
        <Box sx={adminDashboardStyles.activityList}>
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => {
              const statusLabels: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
                'En preparación': { label: 'En preparación', color: 'info' },
                'En camino': { label: 'En camino', color: 'warning' },
                'En el locker': { label: 'En el locker', color: 'secondary' },
                'Entregada': { label: 'Entregada', color: 'success' },
                'Cancelada': { label: 'Cancelada', color: 'error' },
              }
              const statusInfo = (order.status && statusLabels[order.status]) || statusLabels['En preparación']

              return (
                <Box
                  key={order.id}
                  sx={adminDashboardStyles.activityItem}
                >
                  <Avatar sx={adminDashboardStyles.activityAvatar}>
                    {String(order.id).substring(0, 2).toUpperCase()}
                  </Avatar>
                  <Box sx={adminDashboardStyles.activityContent}>
                    <Typography variant="body2" fontWeight="bold">
                      Orden #{order.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getTimeAgo(order.created_at)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={statusInfo.label} 
                    size="small" 
                    color={statusInfo.color} 
                    sx={adminDashboardStyles.activityChip} 
                  />
                </Box>
              )
            })
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
              No hay actividad reciente
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
