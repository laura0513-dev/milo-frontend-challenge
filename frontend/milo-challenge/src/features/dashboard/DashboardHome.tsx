import React, { useMemo } from 'react'
import { useCurrentUser, useAsync, usePageLoading } from '../../shared/hooks/index.ts'
import { orderService } from '../orders/orderService.ts'
import { lockerService } from '../lockers/lockerService.ts'
import { OrderStatus, LockerStatus } from '../../shared/constants/enums.ts'
import { LoadingState, ErrorState } from '../../shared/components/ui/index.ts'
import { AdminDashboard } from './components/AdminDashboard.tsx'
import { ClientDashboard } from './components/ClientDashboard.tsx'

const DashboardHome: React.FC = () => {
  const { user, isAdmin, isClient } = useCurrentUser()
  const isPageLoading = usePageLoading()

  // Cargar datos de órdenes y lockers
  const { data: orders, loading: ordersLoading, error: ordersError } = useAsync(
    () => orderService.getOrders(),
    true,
  )

  const { data: lockers, loading: lockersLoading, error: lockersError } = useAsync(
    () => lockerService.getLockers(),
    true,
  )

  // Métricas para admin
  const adminMetrics = useMemo(
    () => ({
      totalOrders: orders?.length || 0,
      availableLockers: lockers?.filter((l) => l.status === LockerStatus.AVAILABLE).length || 0,
      pendingDeliveries: orders?.filter((o) => o.status === OrderStatus.PREPARING).length || 0,
    }),
    [orders, lockers],
  )

  if (isPageLoading) {
    return <LoadingState message="Cargando dashboard..." />
  }

  if (!user) return null

  if (isAdmin) {
    if (ordersLoading || lockersLoading) return <LoadingState fullHeight />
    if (ordersError || lockersError)
      return <ErrorState title="Error" message="No se pudieron cargar los datos" fullHeight />

    return (
      <AdminDashboard
        totalOrders={adminMetrics.totalOrders}
        availableLockers={adminMetrics.availableLockers}
        pendingDeliveries={adminMetrics.pendingDeliveries}
      />
    )
  }

  if (isClient) {
    return <ClientDashboard userName={user.name} />
  }

  return null
}

export default DashboardHome
