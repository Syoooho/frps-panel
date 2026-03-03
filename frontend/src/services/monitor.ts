import api from './api'

export interface SystemStats {
  cpu_percent: number
  memory_percent: number
  disk_percent: number
}

export interface TunnelStats {
  total: number
  online: number
  offline: number
  by_type: {
    tcp: number
    udp: number
    http: number
    https: number
  }
}

export interface UserStats {
  total: number
  active: number
  new_today: number
}

export interface SubscriptionStats {
  total: number
  active: number
  expired: number
  expiring_soon: number
}

export interface MonitorOverview {
  system: SystemStats
  tunnels: TunnelStats
  users: UserStats
  subscriptions: SubscriptionStats
}

export const monitorService = {
  async getOverview(): Promise<MonitorOverview> {
    try {
      console.log('正在请求监控数据...')
      const data = await api.get('/monitor/overview')
      console.log('API 响应数据:', data)
      return data as unknown as MonitorOverview
    } catch (error: any) {
      console.error('监控服务错误:', error)
      console.error('错误响应:', error.response)
      throw error
    }
  }
}
