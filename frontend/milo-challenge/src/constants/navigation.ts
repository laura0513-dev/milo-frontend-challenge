import { Dashboard, Inventory, People, Inventory2, Person, ShoppingBag } from '@mui/icons-material'
import type { SvgIconProps } from '@mui/material'
import { UserRole } from './enums.ts'
import { ROUTES } from './routes.ts'

export interface NavLink {
  id: string
  label: string
  path: string
  icon: React.ComponentType<SvgIconProps>
  roles: UserRole[]
}

export const NAV_LINKS: NavLink[] = [
  {
    id: 'dashboard-home',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: Dashboard,
    roles: [UserRole.ADMIN, UserRole.CLIENT],
  },
  {
    id: 'orders',
    label: 'Órdenes',
    path: ROUTES.ORDERS,
    icon: Inventory,
    roles: [UserRole.ADMIN, UserRole.CLIENT],
  },
  {
    id: 'clients',
    label: 'Clientes',
    path: ROUTES.CLIENTS,
    icon: People,
    roles: [UserRole.ADMIN],
  },
  {
    id: 'lockers',
    label: 'Lockers',
    path: ROUTES.LOCKERS,
    icon: Inventory2,
    roles: [UserRole.ADMIN, UserRole.CLIENT],
  },
  {
    id: 'profile',
    label: 'Mi Perfil',
    path: ROUTES.PROFILE,
    icon: Person,
    roles: [UserRole.CLIENT],
  },
]

export const getNavLinksByRole = (role: UserRole): NavLink[] => {
  return NAV_LINKS.filter((link) => link.roles.includes(role))
}
