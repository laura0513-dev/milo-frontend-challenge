import { SxProps, Theme } from '@mui/material'

export const lockersStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { sm: 'center' },
    justifyContent: 'space-between',
    gap: 2,
  } as SxProps<Theme>,

  grid: {
    spacing: 3,
  },

  card: {
    position: 'relative',
  } as SxProps<Theme>,

  cardMediaContainer: {
    position: 'relative',
    height: 140,
  } as SxProps<Theme>,

  cardMedia: {
    height: '100%',
    width: '100%',
  } as SxProps<Theme>,

  statusBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  } as SxProps<Theme>,

  statusBadge: {
    fontWeight: 'bold',
    color: 'white',
  } as SxProps<Theme>,

  cardHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 1,
  } as SxProps<Theme>,

  locationContainer: {
    display: 'flex',
    alignItems: 'center',
    color: 'text.secondary',
    mt: 0.5,
  } as SxProps<Theme>,

  locationIcon: {
    fontSize: 16,
    mr: 0.5,
  } as SxProps<Theme>,

  iconBox: {
    bgcolor: 'action.hover',
    p: 1,
    borderRadius: 1,
  } as SxProps<Theme>,

  inventoryIcon: {
    color: 'text.secondary',
  } as SxProps<Theme>,

  cardFooter: {
    mt: 2,
    pt: 2,
    borderTop: 1,
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as SxProps<Theme>,
}
