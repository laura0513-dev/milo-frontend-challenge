import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path={ROUTES.DASHBOARD} element={<DashboardHome />} />
            <Route path={ROUTES.ORDERS} element={<Orders />} />
            <Route
              path={ROUTES.CLIENTS}
              element={
                <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route path={ROUTES.LOCKERS} element={<Lockers />} />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute requiredRoles={[UserRole.CLIENT]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
