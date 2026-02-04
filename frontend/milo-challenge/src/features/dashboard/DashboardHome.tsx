import React, { useMemo } from 'react'
import { useAuth } from '../auth/AuthContext.tsx'
import { useCurrentUser, useAsync } from '../../shared/hooks/index.ts'
import { orderService } from '../orders/orderService.ts'
import { lockerService } from '../lockers/lockerService.ts'
import { UserRole } from '../../shared/constants/enums.ts'
import { LoadingState, ErrorState } from '../../shared/components/ui/index.ts'
import { AdminDashboard } from './components/AdminDashboard.tsx'
import { ClientDashboard } from './components/ClientDashboard.tsx'
import { DeliveryDashboard } from './components/DeliveryDashboard.tsx'

const DashboardHome: React.FC = () => {
  const { user, token } = useAuth()
  const { isAdmin, isClient } = useCurrentUser()

  // Cargar datos de órdenes solo para admin
  const { data: orders, loading: ordersLoading, error: ordersError } = useAsync(
    () => (token && isAdmin ? orderService.getOrders(token) : Promise.resolve([])),
    !!(token && isAdmin),
  )

  // Cargar datos de lockers solo para admin
  const { data: lockers, loading: lockersLoading, error: lockersError } = useAsync(
    () => (token && isAdmin ? lockerService.getAllLockers(token) : Promise.resolve([])),
    !!(token && isAdmin),
  )

  // Métricas para admin
  const adminMetrics = useMemo(
    () => ({
      preparingOrders: orders?.filter((o) => o.status_id === 1).length || 0,
      totalLockers: lockers?.length || 0,
      inTransitOrders: orders?.filter((o) => o.status_id === 2).length || 0,
    }),
    [orders, lockers],
  )

  if (!user || !token) return null

  if (isAdmin) {
    if (ordersLoading || lockersLoading) return <LoadingState fullHeight />
    if (ordersError || lockersError)
      return <ErrorState title="Error" message="No se pudieron cargar los datos" fullHeight />

    return (
      <AdminDashboard
        preparingOrders={adminMetrics.preparingOrders}
        totalLockers={adminMetrics.totalLockers}
        inTransitOrders={adminMetrics.inTransitOrders}
        orders={orders || []}
      />
    )
  }

  if (isClient) {
    return <ClientDashboard userName={user.name} userId={user.id} token={token} />
  }

  if (user.role === UserRole.DELIVERY) {
    return <DeliveryDashboard userId={user.id} userName={user.name} token={token} />
  }

  return null
}

export default DashboardHome
