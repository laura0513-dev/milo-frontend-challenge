import { User, Locker, Order } from '../types'

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Carlos Admin',
    email: 'admin@rappiclone.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1521296797187-726205347ca9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHVzZXIlMjBhdmF0YXIlMjBzbWlsaW5nfGVufDF8fHx8MTc2OTc2MDc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 'client1',
    name: 'Ana Cliente',
    email: 'ana@client.com',
    role: 'client',
    phone: '+57 300 123 4567',
    address: 'Calle 123 #45-67, Bogotá',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000',
  }
]

export const MOCK_LOCKERS: Locker[] = [
  { id: 'l1', code: 'L-001', location: 'Centro Comercial Andino', status: 'available', capacity: 'medium' },
  { id: 'l2', code: 'L-002', location: 'Parque 93', status: 'occupied', capacity: 'small' },
  { id: 'l3', code: 'L-003', location: 'Titan Plaza', status: 'maintenance', capacity: 'large' },
  { id: 'l4', code: 'L-004', location: 'Unicentro', status: 'available', capacity: 'medium' },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    userId: 'client1',
    items: ['Hamburguesa Doble', 'Papas Fritas', 'Coca Cola'],
    total: 35000,
    status: 'delivered',
    lockerId: 'l2',
    date: '2023-10-25T14:30:00',
  },
  {
    id: 'ord-002',
    userId: 'client1',
    items: ['Pizza Pepperoni', 'Limonada'],
    total: 42000,
    status: 'preparing',
    date: '2023-10-26T18:15:00',
  },
  {
    id: 'ord-003',
    userId: 'client1',
    items: ['Sushi Roll', 'Té Helado'],
    total: 28000,
    status: 'pending',
    date: '2023-10-27T12:00:00',
  }
]

export const ASSETS = {
  welcomeBg: 'https://images.unsplash.com/photo-1646920912229-bc0d5d94e68b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRlbGl2ZXJ5JTIwY291cmllciUyMGhvbGRpbmclMjBwYWNrYWdlfGVufDF8fHx8MTc2OTc4NTg0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  burger: 'https://images.unsplash.com/photo-1761315413256-e149b40f577b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBidXJnZXIlMjBtZWFsfGVufDF8fHx8MTc2OTcyNDg1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  locker: 'https://images.unsplash.com/photo-1711852700869-17004fc26e44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGxvY2tlciUyMGRlbGl2ZXJ5JTIwcGFja2FnZXxlbnwxfHx8fDE3Njk3ODU4NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
}
