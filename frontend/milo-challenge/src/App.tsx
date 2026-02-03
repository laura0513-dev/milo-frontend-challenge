import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext.tsx'
import { OrderStatusProvider } from './features/orders/OrderStatusContext.tsx'
import { OrdersProvider } from './features/orders/OrdersContext.tsx'
import { AppRoutes } from './routes/index.tsx'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderStatusProvider>
          <OrdersProvider>
            <AppRoutes />
          </OrdersProvider>
        </OrderStatusProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
