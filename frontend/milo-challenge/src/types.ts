export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  address?: string;
}

export interface Locker {
  id: string;
  code: string;
  location: string;
  status: 'available' | 'occupied' | 'maintenance';
  capacity: 'small' | 'medium' | 'large';
}

export interface Order {
  id: string;
  userId: string;
  items: string[]; // Simplification for demo
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  lockerId?: string; // If delivered to a locker
  date: string;
}

export type Page = 'welcome' | 'login' | 'dashboard-home' | 'orders' | 'clients' | 'lockers' | 'profile';
