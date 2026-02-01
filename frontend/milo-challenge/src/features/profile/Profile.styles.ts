import { SxProps, Theme } from '@mui/material'

export const profileStyles = {
  container: {
    maxWidth: 'sm',
    mx: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  } as SxProps<Theme>,

  title: {
    fontWeight: 'bold'
  } as SxProps<Theme>,

  paper: {
    overflow: 'hidden',
    borderRadius: 4,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 1
  } as SxProps<Theme>,

  coverHeader: {
    height: 128,
    background: 'linear-gradient(to right, #fb923c, #ef4444)'
  } as SxProps<Theme>,

  paperContent: {
    px: 3,
    pb: 4
  } as SxProps<Theme>,

  avatarContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    mt: -6,
    mb: 3
  } as SxProps<Theme>,

  avatarWrapper: {
    position: 'relative'
  } as SxProps<Theme>,

  avatar: {
    width: 96,
    height: 96,
    border: '4px solid white',
    bgcolor: 'white'
  } as SxProps<Theme>,

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    bgcolor: 'grey.900',
    color: 'white',
    border: '2px solid white',
    p: 0.5,
    '&:hover': {
      bgcolor: 'grey.800'
    }
  } as SxProps<Theme>,

  cameraIcon: {
    fontSize: 16
  } as SxProps<Theme>,

  inputIcon: {
    color: 'text.secondary',
    mr: 1
  } as SxProps<Theme>,

  formFooter: {
    pt: 3,
    mt: 3,
    borderTop: 1,
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'flex-end'
  } as SxProps<Theme>,

  saveButton: {
    boxShadow: 2
  } as SxProps<Theme>
}
