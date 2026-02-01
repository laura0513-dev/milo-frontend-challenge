import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { useAuth } from './context/AuthContext.tsx'
import { Layout } from './components/Layout.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import Login from './pages/Login.tsx'
import DashboardHome from './pages/DashboardHome.tsx'
import Orders from './pages/Orders.tsx'
import Clients from './pages/Clients.tsx'
import Lockers from './pages/Lockers.tsx'
import Profile from './pages/Profile.tsx'
import NotFound from './pages/not-found/NotFound.tsx'
import { UserRole } from './constants/enums.ts'
import { ROUTES } from './constants/routes.ts'

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
