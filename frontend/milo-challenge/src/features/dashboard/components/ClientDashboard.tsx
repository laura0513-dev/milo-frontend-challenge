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
import { clientDashboardStyles } from './ClientDashboard.styles.ts'

interface ClientDashboardProps {
  userName: string
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ userName }) => {
  return (
    <Box sx={clientDashboardStyles.container}>
      <Box sx={clientDashboardStyles.header}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          Hola, {userName.split(' ')[0]} 👋
        </Typography>
        <IconButton
          color="primary"
          sx={clientDashboardStyles.addButton}
        >
          <Add />
        </IconButton>
      </Box>

      {/* Featured Promo */}
      <Card sx={clientDashboardStyles.promoCard}>
        <CardMedia
          component="img"
          image={ASSETS.burger}
          alt="Promo"
          sx={clientDashboardStyles.promoImage}
        />
        <Box sx={clientDashboardStyles.promoOverlay}>
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={clientDashboardStyles.promoLabel}
          >
            Promo del día
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            50% OFF
          </Typography>
          <Typography variant="body2" sx={clientDashboardStyles.promoDescription}>
            En tu primera orden de hamburguesas seleccionadas.
          </Typography>
        </Box>
      </Card>

      {/* Active Order Status */}
      <Paper sx={clientDashboardStyles.activeOrderPaper}>
        <Box sx={clientDashboardStyles.activeOrderHeader}>
          <Typography variant="h6" fontWeight="bold">
            Orden en curso
          </Typography>
          <Chip label="En camino" color="warning" size="small" />
        </Box>
        <Box sx={clientDashboardStyles.orderContent}>
          <Box sx={clientDashboardStyles.orderImageContainer}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              sx={clientDashboardStyles.orderImage}
            />
          </Box>
          <Box sx={clientDashboardStyles.orderDetails}>
            <Typography variant="subtitle1" fontWeight="bold">
              Combo Familiar
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Subway • 2 items
            </Typography>
            <LinearProgress
              variant="determinate"
              value={75}
              sx={clientDashboardStyles.progressBar}
            />
            <Typography variant="caption" color="text.secondary" sx={clientDashboardStyles.estimatedTime}>
              Llega en 15 min
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Grid container spacing={clientDashboardStyles.quickActionsGrid.spacing}>
        <Grid item xs={6}>
          <Paper sx={clientDashboardStyles.quickActionPaperBlue}>
            <Box
              sx={{
                ...clientDashboardStyles.quickActionIcon,
                ...clientDashboardStyles.quickActionIconBlue,
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
          <Paper sx={clientDashboardStyles.quickActionPaperPurple}>
            <Box
              sx={{
                ...clientDashboardStyles.quickActionIcon,
                ...clientDashboardStyles.quickActionIconPurple,
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
