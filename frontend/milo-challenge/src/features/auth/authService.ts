
import { MOCK_USERS } from '../../shared/data/mockData.ts'
import type { User } from '../../shared/types.ts'
import { UserRole } from '../../shared/constants/enums.ts'

class AuthService {
  async login(email: string, role: UserRole): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let user = MOCK_USERS.find((u) => u.role === role)
        if (!user) {
          user = {
            id: 'new-user',
            name: role === UserRole.ADMIN ? 'Admin User' : 'Client User',
            email,
            role,
            avatarUrl: 'https://via.placeholder.com/150',
          }
        }
        resolve(user)
      }, 500)
    })
  }

  async getUserById(userId: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USERS.find((u) => u.id === userId) || null)
      }, 300)
    })
  }
}

export const authService = new AuthService()
