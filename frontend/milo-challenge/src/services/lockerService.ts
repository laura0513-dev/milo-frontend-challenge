
import { MOCK_LOCKERS } from '../data/mockData.ts'
import type { Locker } from '../types.ts'
import { LockerStatus } from '../constants/enums.ts'

class LockerService {
  async getLockers(): Promise<Locker[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_LOCKERS), 300)
    })
  }


  async getAvailableLockers(): Promise<Locker[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_LOCKERS.filter((locker) => locker.status === LockerStatus.AVAILABLE))
      }, 300)
    })
  }


  async getLockerById(lockerId: string): Promise<Locker | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_LOCKERS.find((locker) => locker.id === lockerId) || null)
      }, 300)
    })
  }
}

export const lockerService = new LockerService()
