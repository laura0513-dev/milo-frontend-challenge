import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext.tsx'
import { AppRoutes } from './routes/index.tsx'

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
