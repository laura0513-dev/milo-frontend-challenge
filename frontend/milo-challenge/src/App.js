import React, { useState, useMemo } from 'react'
import Login from './pages/Login.tsx'
import { DashboardHome } from './pages/DashboardHome.tsx'
import { Orders } from './pages/Orders.tsx'
import { Lockers } from './pages/Lockers.tsx'
import { Clients } from './pages/Clients.tsx'
import { Profile } from './pages/Profile.tsx'
import { useAuth } from './context/AuthContext.tsx'
import { Layout } from './components/Layout.tsx'

export default function App() {
  const { isAuthenticated, user } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard-home')

  if (!isAuthenticated) {
    return <Login />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard-home':
        return <DashboardHome />
      case 'orders':
        return <Orders />
      case 'clients':
        if (user?.role === 'admin') return <Clients />
        return <DashboardHome />
      case 'lockers':
        return <Lockers />
      case 'profile':
        if (user?.role === 'client') return <Profile />
        return <DashboardHome />
      default:
        return <DashboardHome />
    }
  }

    return (
      <Layout activePage={currentPage} onNavigate={(page) => setCurrentPage(page)}>
        {renderPage()}
      </Layout>
    )
}
