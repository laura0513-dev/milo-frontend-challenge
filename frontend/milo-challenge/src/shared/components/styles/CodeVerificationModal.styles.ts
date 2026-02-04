import { SxProps, Theme } from '@mui/material'

export const codeVerificationModalStyles = {
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  } as SxProps<Theme>,

  contentContainer: {
    pt: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  } as SxProps<Theme>,

  codeInput: {
    '& input': {
      textAlign: 'center',
      letterSpacing: '0.5em',
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
  } as SxProps<Theme>,
}
