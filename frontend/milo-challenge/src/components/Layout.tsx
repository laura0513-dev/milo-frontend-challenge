import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import {
  Dashboard,
  Inventory,
  People,
  Inventory2,
  Logout,
  Menu as MenuIcon,
  Person,
  ShoppingBag,
} from "@mui/icons-material";
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
} from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

const drawerWidth = 280;

export const Layout = ({
  children,
  activePage,
  onNavigate,
}: LayoutProps) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <>{children}</>;

  const adminLinks = [
    {
      id: "dashboard-home",
      label: "Dashboard",
      icon: Dashboard,
    },
    { id: "orders", label: "Órdenes", icon: Inventory },
    { id: "clients", label: "Clientes", icon: People },
    { id: "lockers", label: "Lockers", icon: Inventory2 },
  ];

  const clientLinks = [
    { id: "dashboard-home", label: "Inicio", icon: Dashboard },
    { id: "orders", label: "Mis Pedidos", icon: ShoppingBag },
    { id: "lockers", label: "Ver Lockers", icon: Inventory2 },
    { id: "profile", label: "Mi Perfil", icon: Person },
  ];

  const links =
    user.role === "admin" ? adminLinks : clientLinks;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
        {links.map((link) => (
          <ListItem key={link.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activePage === link.id}
              onClick={() => {
                onNavigate(link.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 3,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "inherit",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color:
                    activePage === link.id
                      ? "inherit"
                      : "text.secondary",
                }}
              >
                <link.icon />
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
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
  );

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
  );
};