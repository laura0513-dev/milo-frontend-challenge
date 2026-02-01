import { SxProps, Theme } from '@mui/material'

export const notFoundStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    gap: 3,
  } as SxProps<Theme>,

  icon: {
    fontSize: 80,
    color: 'error.main',
    opacity: 0.7,
  } as SxProps<Theme>,

  description: {
    mb: 2,
  } as SxProps<Theme>,

  button: {
    mt: 2,
  } as SxProps<Theme>,
}
