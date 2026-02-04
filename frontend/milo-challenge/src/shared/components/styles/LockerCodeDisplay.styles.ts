import { SxProps, Theme } from '@mui/material'

export const lockerCodeDisplayStyles = {
  paper: {
    p: 2,
    bgcolor: 'warning.main',
    color: 'white',
    mt: 2,
  } as SxProps<Theme>,

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 1,
  } as SxProps<Theme>,

  icon: {
    fontSize: 20,
  } as SxProps<Theme>,

  title: {
    color: 'white',
  } as SxProps<Theme>,

  code: {
    letterSpacing: 4,
    color: 'white',
    my: 1,
  } as SxProps<Theme>,

  expirationText: (isUrgent: boolean) => ({
    color: 'white',
    fontWeight: isUrgent ? 'bold' : 'normal',
    textDecoration: isUrgent ? 'underline' : 'none',
  } as SxProps<Theme>),
}
