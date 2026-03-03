import api from './api'

export interface SystemConfig {
  frp_server_addr: string
  frp_server_port: number
}

export const systemService = {
  async getConfig(): Promise<SystemConfig> {
    const data = await api.get('/system/config')
    return data as unknown as SystemConfig
  },
  
  async updateConfig(config: SystemConfig): Promise<SystemConfig> {
    const data = await api.put('/system/config', config)
    return data as unknown as SystemConfig
  }
}
