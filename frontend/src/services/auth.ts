import api from './api'

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
  refresh_token: string
  token_type: string
  user: {
    id: number
    email: string
    is_admin: boolean
    created_at: string
  }
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return api.post('/auth/login', data)
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return api.post('/auth/register', data)
  },

  async getMe() {
    return api.get('/auth/me')
  },

  async logout() {
    return api.post('/auth/logout')
  }
}
