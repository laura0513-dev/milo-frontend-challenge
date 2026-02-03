import { SxProps, Theme } from '@mui/material'

export const clientDashboardStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as SxProps<Theme>,

  addButton: {
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': { bgcolor: 'primary.dark' },
    boxShadow: 2,
  } as SxProps<Theme>,

  promoCard: {
    position: 'relative',
    height: 200,
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: 3,
  } as SxProps<Theme>,

  promoImage: {
    height: '100%',
    width: '100%',
    transition: 'transform 0.5s',
    '&:hover': { transform: 'scale(1.1)' },
  } as SxProps<Theme>,

  promoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
  } as SxProps<Theme>,

  promoLabel: {
    color: 'warning.main',
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as SxProps<Theme>,

  promoDescription: {
    maxWidth: 200,
    color: 'grey.300',
  } as SxProps<Theme>,

  activeOrderPaper: {
    p: 3,
    border: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  activeOrderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
  } as SxProps<Theme>,

  orderContent: {
    display: 'flex',
    gap: 2,
  } as SxProps<Theme>,

  orderImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 2,
    overflow: 'hidden',
    flexShrink: 0,
  } as SxProps<Theme>,

  orderImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as SxProps<Theme>,

  orderDetails: {
    flexGrow: 1,
  } as SxProps<Theme>,

  progressBar: {
    height: 8,
    borderRadius: 4,
    bgcolor: 'grey.100',
    '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
  } as SxProps<Theme>,

  estimatedTime: {
    display: 'block',
    mt: 0.5,
  } as SxProps<Theme>,

  quickActionsGrid: {
    spacing: 2,
  },

  quickActionPaperBlue: {
    p: 3,
    textAlign: 'center',
    background: '#eff6ff',
    cursor: 'pointer',
    '&:hover': { background: '#dbeafe' },
  } as SxProps<Theme>,

  quickActionPaperPurple: {
    p: 3,
    textAlign: 'center',
    background: '#f3e8ff',
    cursor: 'pointer',
    '&:hover': { background: '#e9d5ff' },
  } as SxProps<Theme>,

  quickActionIcon: {
    bgcolor: 'white',
    width: 48,
    height: 48,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mx: 'auto',
    mb: 2,
  } as SxProps<Theme>,

  quickActionIconBlue: {
    color: 'info.main',
  } as SxProps<Theme>,

  quickActionIconPurple: {
    color: 'secondary.main',
  } as SxProps<Theme>,
}
