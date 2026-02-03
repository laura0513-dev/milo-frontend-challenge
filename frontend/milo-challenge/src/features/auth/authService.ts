
import type { User } from '../../shared/types.ts'
import { UserRole } from '../../shared/constants/enums.ts'

const API_BASE_URL = 'http://localhost:3000/api'

interface LoginResponse {
  token: string
  user: User
}

class AuthService {
  async login(email: string, password: string, role?: UserRole): Promise<LoginResponse | null> {
    try {
      // Determinar el endpoint según el rol
      let endpoint = `${API_BASE_URL}/auth/login`
      
      if (role === UserRole.CLIENT) {
        endpoint = `${API_BASE_URL}/auth/login/cliente`
      } else if (role === UserRole.DELIVERY) {
        endpoint = `${API_BASE_URL}/auth/login/delivery`
      }
      // Si es ADMIN o no se especifica rol, usa el endpoint base /api/auth/login
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        console.error('Login failed:', response.statusText)
        return null
      }

      const data = await response.json()
      return {
        token: data.token,
        user: data.user as User,
      }
    } catch (error) {
      console.error('Login error:', error)
      return null
    }
  }

  async registerCliente(name: string, email: string, password: string, address: string): Promise<LoginResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/cliente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          address,
        }),
      })

      if (!response.ok) {
        console.error('Register failed:', response.statusText)
        return null
      }

      const data = await response.json()
      return {
        token: data.token,
        user: data.user as User,
      }
    } catch (error) {
      console.error('Register error:', error)
      return null
    }
  }

  async getUserById(userId: string, token: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error('Get user failed:', response.statusText)
        return null
      }

      const data = await response.json()
      return data as User
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }
}

export const authService = new AuthService()
