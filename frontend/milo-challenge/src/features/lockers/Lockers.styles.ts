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

  gridItem: {
    display: 'flex',
    justifyContent: 'center',
  } as SxProps<Theme>,

  card: {
    position: 'relative',
    width: { xs: '100%', sm: '100%', lg: 360 },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 4,
    },
  } as SxProps<Theme>,

  cardMediaContainer: {
    position: 'relative',
    height: 180,
    flexShrink: 0,
  } as SxProps<Theme>,

  cardMedia: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
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

  cardContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    p: 2,
  } as SxProps<Theme>,

  cardHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    mb: 1.5,
    minHeight: 60,
  } as SxProps<Theme>,

  cardTitleContainer: {
    flex: 1,
    minWidth: 0,
  } as SxProps<Theme>,

  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    mb: 0.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  } as SxProps<Theme>,

  locationContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    color: 'text.secondary',
    gap: 0.5,
  } as SxProps<Theme>,

  locationIcon: {
    fontSize: 16,
    flexShrink: 0,
    mt: 0.25,
  } as SxProps<Theme>,

  locationText: {
    fontSize: '0.875rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  } as SxProps<Theme>,

  iconBox: {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    p: 1,
    borderRadius: 1.5,
    flexShrink: 0,
    ml: 1,
  } as SxProps<Theme>,

  inventoryIcon: {
    fontSize: 24,
  } as SxProps<Theme>,

  coordinatesChip: {
    fontSize: '0.75rem',
    height: 28,
  } as SxProps<Theme>,

  cardFooter: {
    mt: 'auto',
    pt: 2,
    borderTop: 1,
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
  } as SxProps<Theme>,
}
