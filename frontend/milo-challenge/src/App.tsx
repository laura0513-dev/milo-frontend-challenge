import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { Layout } from './components/Layout.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'
import { LoadingState } from './components/ui/index.ts'
import { UserRole } from './constants/enums.ts'
import { ROUTES } from './constants/routes.ts'

const Login = React.lazy(() => import('./pages/Login.tsx'))
const DashboardHome = React.lazy(() => import('./pages/DashboardHome.tsx'))
const Orders = React.lazy(() => import('./pages/Orders.tsx'))
const Clients = React.lazy(() => import('./pages/Clients.tsx'))
const Lockers = React.lazy(() => import('./pages/Lockers.tsx'))
const Profile = React.lazy(() => import('./pages/Profile.tsx'))
const NotFound = React.lazy(() => import('./pages/not-found/NotFound.tsx'))

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingState fullHeight />}>{children}</Suspense>
)

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.DASHBOARD} />} />
            <Route
              path={ROUTES.LOGIN}
              element={
                <SuspenseWrapper>
                  <Login />
                </SuspenseWrapper>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <SuspenseWrapper>
                    <DashboardHome />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ORDERS}
              element={
                <ProtectedRoute>
                  <SuspenseWrapper>
                    <Orders />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CLIENTS}
              element={
                <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
                  <SuspenseWrapper>
                    <Clients />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.LOCKERS}
              element={
                <ProtectedRoute>
                  <SuspenseWrapper>
                    <Lockers />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute requiredRoles={[UserRole.CLIENT]}>
                  <SuspenseWrapper>
                    <Profile />
                  </SuspenseWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.NOT_FOUND}
              element={
                <SuspenseWrapper>
                  <NotFound />
                </SuspenseWrapper>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
