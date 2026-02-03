import { SxProps, Theme } from '@mui/material'

export const deliveryDashboardStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
  } as SxProps<Theme>,

  statsContainer: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
  } as SxProps<Theme>,

  statChip: {
    fontWeight: 'bold',
    fontSize: '0.875rem',
  } as SxProps<Theme>,

  sectionPaper: {
    p: 3,
    border: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  orderCard: {
    p: 2.5,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    '&:hover': { 
      borderColor: 'primary.main',
      boxShadow: 1,
    },
    transition: 'all 0.2s',
    cursor: 'pointer',
  } as SxProps<Theme>,

  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 1.5,
  } as SxProps<Theme>,

  orderItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
    mb: 2,
  } as SxProps<Theme>,

  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 2,
    pt: 2,
    borderTop: 1,
    borderColor: 'divider',
  } as SxProps<Theme>,

  emptyState: {
    textAlign: 'center',
    py: 8,
  } as SxProps<Theme>,

  emptyIcon: {
    fontSize: 64,
    color: 'text.disabled',
    mb: 2,
  } as SxProps<Theme>,
}
