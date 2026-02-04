import { SxProps, Theme } from '@mui/material'

export const customModalStyles = {
  paper: {
    borderRadius: 2,
  } as SxProps<Theme>,

  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as SxProps<Theme>,

  closeButton: {
    color: 'text.secondary',
    '&:hover': {
      bgcolor: 'action.hover',
    },
  } as SxProps<Theme>,

  content: {
    mt: 2,
  } as SxProps<Theme>,

  actions: {
    p: 2,
    gap: 1,
  } as SxProps<Theme>,
}
