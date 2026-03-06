export interface User {
  id: number
  email: string
  frp_token?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
  subscription?: Subscription
}

export interface Subscription {
  id: number
  user_id: number
  plan_type: 'monthly' | 'yearly'
  max_tunnels: number
  start_date: string
  end_date: string
  is_active: boolean
}

export interface Tunnel {
  id: number
  user_id: number
  name: string
  type: 'tcp' | 'udp' | 'http' | 'https'
  local_ip: string
  local_port: number
  remote_port?: number
  custom_domain?: string
  subdomain?: string
  custom_http_port?: number
  custom_https_port?: number
  use_encryption?: boolean
  use_compression?: boolean
  status: 'active' | 'inactive'
  created_at: string
}

export interface RedeemCode {
  id: number
  code: string
  plan_type: 'monthly' | 'yearly'
  is_used: boolean
  used_by?: number
  used_at?: string
  created_at: string
}

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}
