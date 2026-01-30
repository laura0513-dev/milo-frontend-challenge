import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData.ts';

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'client') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, role: 'admin' | 'client') => {
    // Mock login logic
    const mockUser = MOCK_USERS.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
    } else {
      // Fallback if not found in mock data
      setUser({
        id: 'new-user',
        name: role === 'admin' ? 'Admin User' : 'Client User',
        email,
        role,
        avatarUrl: 'https://via.placeholder.com/150'
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
