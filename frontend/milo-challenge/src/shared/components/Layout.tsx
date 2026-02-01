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
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { getNavLinksByRole } from "../constants/navigation.ts"

interface LayoutProps {
  children: React.ReactNode
}

const drawerWidth = 280

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          px: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }}
        >
          R
        </Box>
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.primary"
        >
          RappiClone
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.path
          return (
            <ListItem key={link.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(link.path)
                  // Cerrar drawer en móvil después de navegar
                  if (mobileOpen) {
                    setMobileOpen(false)
                  }
                }}
                sx={{
                  borderRadius: 3,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  bgcolor: isActive ? "primary.main" : "transparent",
                  color: isActive ? "white" : "text.primary",
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  "&:hover": {
                    bgcolor: isActive ? "primary.main" : "action.hover",
                    color: isActive ? "white" : "text.primary",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "white" : "text.secondary",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      <Box sx={{ pt: 2, borderTop: 1, borderColor: "divider" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
            px: 1,
          }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid",
              borderColor: "primary.light",
            }}
          />
          <Box sx={{ overflow: "hidden" }}>
            <Typography
              variant="subtitle2"
              noWrap
              fontWeight="bold"
            >
              {user.name}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: "capitalize" }}
            >
              {user.role}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 3,
            color: "error.main",
            "&:hover": {
              bgcolor: "error.light",
              color: "error.contrastText",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar Sesión"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          display: { md: "none" },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            RappiClone
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, md: 0 },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ maxWidth: "lg", mx: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}