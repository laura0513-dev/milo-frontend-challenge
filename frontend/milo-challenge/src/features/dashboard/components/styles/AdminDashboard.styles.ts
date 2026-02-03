import { SxProps, Theme } from '@mui/material'

export const adminDashboardStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  } as SxProps<Theme>,

  statsGrid: {
    spacing: 3,
  },

  activityPaper: {
    p: 3,
    border: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  } as SxProps<Theme>,

  activityItem: {
    display: 'flex',
    alignItems: 'center',
    p: 2,
    borderRadius: 2,
    '&:hover': { bgcolor: 'action.hover' },
    cursor: 'pointer',
  } as SxProps<Theme>,

  activityAvatar: {
    width: 40,
    height: 40,
    mr: 2,
  } as SxProps<Theme>,

  activityContent: {
    flexGrow: 1,
  } as SxProps<Theme>,

  activityChip: {
    height: 24,
  } as SxProps<Theme>,
}
