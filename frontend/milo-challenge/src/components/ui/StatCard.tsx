import React from 'react'
import { Box, Paper, Typography } from '@mui/material'
import { SvgIconProps } from '@mui/material'

interface StatCardProps {
  icon: React.ComponentType<SvgIconProps>
  label: string
  value: number | string
  subtitle: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  sx?: any
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: IconComponent,
  label,
  value,
  subtitle,
  color = 'primary',
  sx,
}) => {
  const colorMap = {
    primary: { main: 'primary.main', light: 'primary.light' },
    success: { main: 'success.main', light: 'success.light' },
    warning: { main: 'warning.main', light: 'warning.light' },
    error: { main: 'error.main', light: 'error.light' },
    info: { main: 'info.main', light: 'info.light' },
  }

  return (
    <Box sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
      <Paper sx={{ p: 3, border: '1px solid', borderColor: 'divider', ...sx }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              bgcolor: colorMap[color].light,
              color: colorMap[color].main,
              borderRadius: 3,
              display: 'flex',
            }}
          >
            <IconComponent />
          </Box>
          <Typography variant="body2" color="text.secondary" fontWeight="medium">
            {label}
          </Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
          {value}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Paper>
    </Box>
  )
}
