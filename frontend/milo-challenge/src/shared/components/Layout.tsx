import React, { useState, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../features/auth/AuthContext.tsx"
import { Logout, Menu as MenuIcon } from "@mui/icons-material"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material"
import { getNavLinksByRole } from "../constants/navigation.ts"
import { layoutStyles } from './styles/Layout.styles.ts'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filtra los links según el rol del usuario de forma eficiente
  const links = useMemo(() => {
    return user ? getNavLinksByRole(user.role) : []
  }, [user])

  // Si no hay usuario autenticado (en login), renderizar solo el contenido sin layout
  if (!user) return <>{children}</>

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <Box sx={layoutStyles.drawerContainer}>
      <Box sx={layoutStyles.drawerHeader}>
        <Box sx={layoutStyles.logo}>
          R
        </Box>
        <Typography variant="h6" sx={layoutStyles.title}>
          RappiClone
        </Typography>
      </Box>

      <List sx={layoutStyles.list}>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.path
          return (
            <ListItem key={link.id} disablePadding sx={layoutStyles.listItem}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path)
                  // Cerrar drawer en móvil después de navegar
                  if (mobileOpen) {
                    setMobileOpen(false)
                  }
                }}
                sx={layoutStyles.listItemButton(isActive)}
              >
                <ListItemIcon sx={layoutStyles.listItemIcon(isActive)}>
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={layoutStyles.listItemText(isActive)}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={layoutStyles.userSection}>
        <Box sx={layoutStyles.userInfo}>
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={layoutStyles.avatar}
          />
          <Box sx={layoutStyles.userTextContainer}>
            <Typography variant="subtitle2" noWrap sx={layoutStyles.userName}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={layoutStyles.userRole}>
              {user.role}
            </Typography>
          </Box>
        </Box>
        <ListItemButton onClick={logout} sx={layoutStyles.logoutButton}>
          <ListItemIcon sx={layoutStyles.logoutIcon}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            primaryTypographyProps={layoutStyles.logoutText}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={layoutStyles.container}>
      <AppBar position="fixed" sx={layoutStyles.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={layoutStyles.appBarMenuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={layoutStyles.appBarTitle}>
            RappiClone
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={layoutStyles.nav}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={layoutStyles.mobileDrawer}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={layoutStyles.desktopDrawer}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box component="main" sx={layoutStyles.main}>
        <Box sx={layoutStyles.contentContainer}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}