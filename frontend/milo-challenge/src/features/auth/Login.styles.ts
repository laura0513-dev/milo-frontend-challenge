import { SxProps, Theme } from '@mui/material'

export const loginStyles = {
  mainContainer: {
    minHeight: '100vh',
    bgcolor: 'background.default',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    py: 6,
    px: 2,
  } as SxProps<Theme>,

  headerBox: {
    textAlign: 'center',
    mb: 4,
  } as SxProps<Theme>,

  iconBox: {
    width: 48,
    height: 48,
    bgcolor: 'primary.main',
    borderRadius: 3,
    mx: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 3,
    mb: 3,
  } as SxProps<Theme>,

  iconText: {
    color: 'white',
    fontWeight: 'bold',
  } as SxProps<Theme>,

  title: {
    fontWeight: 800,
  } as SxProps<Theme>,

  paper: {
    p: 4,
    border: '1px solid',
    borderColor: 'divider',
  } as SxProps<Theme>,

  alert: {
    mb: 3,
  } as SxProps<Theme>,

  formBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  } as SxProps<Theme>,

  inputAdornment: {
    color: 'text.secondary',
  } as SxProps<Theme>,

  toggleButton: {
    textTransform: 'none',
  } as SxProps<Theme>,

  submitButton: {
    py: 1.5,
    borderRadius: 50,
  } as SxProps<Theme>,
}
