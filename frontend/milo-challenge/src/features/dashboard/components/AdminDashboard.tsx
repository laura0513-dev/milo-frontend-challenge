import React from 'react'
import { Inventory, AccessTime, CheckCircle } from '@mui/icons-material'
import { Box, Grid, Typography, Paper, Avatar, Chip } from '@mui/material'
import { StatCard } from '../../../shared/components/ui/index.ts'

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
