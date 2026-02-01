import React from 'react'
import { Inventory, AccessTime, CheckCircle } from '@mui/icons-material'
import { Box, Grid, Typography, Paper, Avatar, Chip } from '@mui/material'
import { StatCard } from '../../../shared/components/ui/index.ts'
import { adminDashboardStyles } from './AdminDashboard.styles.ts'

interface AdminDashboardProps {
  totalOrders: number
  availableLockers: number
  pendingDeliveries: number
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  totalOrders,
  availableLockers,
  pendingDeliveries,
}) => {
  return (
    <Box sx={adminDashboardStyles.container}>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        Panel de Administración
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={adminDashboardStyles.statsGrid.spacing}>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={Inventory}
            label="Total"
            value={totalOrders}
            subtitle="Órdenes Activas"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={CheckCircle}
            label="Disponibles"
            value={availableLockers}
            subtitle="Lockers Libres"
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            icon={AccessTime}
            label="Hoy"
            value={pendingDeliveries}
            subtitle="Entregas Pendientes"
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
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={adminDashboardStyles.activityItem}
            >
              <Avatar sx={adminDashboardStyles.activityAvatar} />
              <Box sx={adminDashboardStyles.activityContent}>
                <Typography variant="body2" fontWeight="bold">
                  Nueva orden #ORD-{100 + i}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hace {i * 15} minutos
                </Typography>
              </Box>
              <Chip label="Nuevo" size="small" color="primary" sx={adminDashboardStyles.activityChip} />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
