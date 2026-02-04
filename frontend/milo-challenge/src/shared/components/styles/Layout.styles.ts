import { SxProps, Theme } from '@mui/material'

export const drawerWidth = 280

export const layoutStyles = {
  container: {
    display: 'flex',
  } as SxProps<Theme>,

  // AppBar
  appBar: {
    width: { md: `calc(100% - ${drawerWidth}px)` },
    ml: { md: `${drawerWidth}px` },
    display: { md: 'none' },
    bgcolor: 'background.paper',
    color: 'text.primary',
    boxShadow: 1,
  } as SxProps<Theme>,

  appBarMenuButton: {
    mr: 2,
    display: { md: 'none' },
  } as SxProps<Theme>,

  appBarTitle: {
    flexGrow: 1,
    fontWeight: 'bold',
  } as SxProps<Theme>,

  // Drawer
  drawerContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    p: 2,
  } as SxProps<Theme>,

  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 4,
    px: 2,
  } as SxProps<Theme>,

  logo: {
    width: 40,
    height: 40,
    bgcolor: 'primary.main',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  } as SxProps<Theme>,

  title: {
    fontWeight: 'bold',
    color: 'text.primary',
  } as SxProps<Theme>,

  list: {
    flexGrow: 1,
  } as SxProps<Theme>,

  listItem: {
    mb: 1,
  } as SxProps<Theme>,

  listItemButton: (isActive: boolean) => ({
    borderRadius: 3,
    textDecoration: 'none',
    cursor: 'pointer',
    bgcolor: isActive ? 'primary.main' : 'transparent',
    color: isActive ? 'white' : 'text.primary',
    fontWeight: isActive ? 700 : 500,
    transition: 'all 0.2s ease',
    '&:hover': {
      bgcolor: isActive ? 'primary.main' : 'action.hover',
      color: isActive ? 'white' : 'text.primary',
    },
  } as SxProps<Theme>),

  listItemIcon: (isActive: boolean) => ({
    minWidth: 40,
    color: isActive ? 'white' : 'text.secondary',
  } as SxProps<Theme>),

  listItemText: (isActive: boolean) => ({
    fontWeight: isActive ? 700 : 500,
  }),

  // User Profile Section
  userSection: {
    pt: 2,
    borderTop: 1,
    borderColor: 'divider',
  } as SxProps<Theme>,

  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 2,
    px: 1,
  } as SxProps<Theme>,

  avatar: {
    width: 40,
    height: 40,
    border: '2px solid',
    borderColor: 'primary.light',
  } as SxProps<Theme>,

  userTextContainer: {
    overflow: 'hidden',
  } as SxProps<Theme>,

  userName: {
    fontWeight: 'bold',
  } as SxProps<Theme>,

  userRole: {
    textTransform: 'capitalize',
  } as SxProps<Theme>,

  logoutButton: {
    borderRadius: 3,
    color: 'error.main',
    '&:hover': {
      bgcolor: 'error.light',
      color: 'error.contrastText',
    },
  } as SxProps<Theme>,

  logoutIcon: {
    minWidth: 40,
    color: 'inherit',
  } as SxProps<Theme>,

  logoutText: {
    fontWeight: 600,
  },

  // Nav Container
  nav: {
    width: { md: drawerWidth },
    flexShrink: { md: 0 },
  } as SxProps<Theme>,

  mobileDrawer: {
    display: { xs: 'block', md: 'none' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
    },
  } as SxProps<Theme>,

  desktopDrawer: {
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      borderRight: '1px solid',
      borderColor: 'divider',
    },
  } as SxProps<Theme>,

  // Main Content
  main: {
    flexGrow: 1,
    p: 3,
    width: { md: `calc(100% - ${drawerWidth}px)` },
    mt: { xs: 7, md: 0 },
    minHeight: '100vh',
    bgcolor: 'background.default',
  } as SxProps<Theme>,

  contentContainer: {
    maxWidth: 'lg',
    mx: 'auto',
  } as SxProps<Theme>,
}
