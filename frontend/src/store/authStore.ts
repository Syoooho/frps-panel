import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'
import { authService } from '../services/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  logout: () => void
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        localStorage.setItem('access_token', token)
        set({ token, user, isAuthenticated: true })
      },
      clearAuth: () => {
        localStorage.removeItem('access_token')
        set({ token: null, user: null, isAuthenticated: false })
      },
      logout: () => {
        localStorage.removeItem('access_token')
        set({ token: null, user: null, isAuthenticated: false })
      },
      refreshUser: async () => {
        try {
          const user = await authService.getMe()
          set({ user })
        } catch (error) {
          console.error('刷新用户信息失败:', error)
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
