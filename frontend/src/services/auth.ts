import api from './api'
import type { User } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return api.post('/auth/login', data)
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return api.post('/auth/register', data)
  },

  async getMe(): Promise<User> {
    return api.get('/auth/me')
  },

  logout() {
    localStorage.removeItem('access_token')
  }
}
