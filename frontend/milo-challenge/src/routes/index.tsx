import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext.tsx'
import { Layout } from '../shared/components/Layout.tsx'
import { ProtectedRoute } from '../shared/components/ProtectedRoute.tsx'
import { UserRole } from '../shared/constants/enums.ts'
import { ROUTES } from '../shared/constants/routes.ts'

//@pages
import Login from '../features/auth/Login.tsx'
import AdminLogin from '../features/auth/AdminLogin.tsx'
import DashboardHome from '../features/dashboard/DashboardHome.tsx'
import Orders from '../features/orders/Orders.tsx'
import Clients from '../features/clients/Clients.tsx'
import Lockers from '../features/lockers/Lockers.tsx'
import Profile from '../features/profile/Profile.tsx'
import NotFound from '../features/not-found/NotFound.tsx'

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.LOGIN_ADMIN} element={<AdminLogin />} />
      {isAuthenticated ? (
        <>
          <Route
            path={ROUTES.ROOT}
            element={
              <Layout>
                <Navigate to={ROUTES.DASHBOARD} replace />
              </Layout>
            }
          />
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <Layout>
                <DashboardHome />
              </Layout>
            }
          />
          <Route
            path={ROUTES.ORDERS}
            element={
              <Layout>
                <Orders />
              </Layout>
            }
          />
          <Route
            path={ROUTES.CLIENTS}
            element={
              <Layout>
                <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
                  <Clients />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path={ROUTES.LOCKERS}
            element={
              <Layout>
                <Lockers />
              </Layout>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <Layout>
                <ProtectedRoute requiredRoles={[UserRole.CLIENT]}>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            }
          />
          <Route
            path={ROUTES.NOT_FOUND}
            element={
              <Layout>
                <NotFound />
              </Layout>
            }
          />
        </>
      ) : (
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      )}
    </Routes>
  )
}
