// Mock API for development without backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockUser = {
  id: 1,
  email: 'demo@example.com',
}

const mockToken = 'mock-jwt-token-12345'

const mockTunnels = [
  {
    id: 1,
    name: 'ssh-server',
    type: 'tcp',
    local_port: 22,
    remote_port: 10022,
    status: 'online',
  },
  {
    id: 2,
    name: 'web-app',
    type: 'http',
    local_port: 3000,
    custom_domain: 'myapp.example.com',
    status: 'online',
  },
  {
    id: 3,
    name: 'game-server',
    type: 'udp',
    local_port: 7777,
    remote_port: 17777,
    status: 'offline',
  },
]

const mockStats = {
  subscription_status: 'active',
  expire_date: '2026-12-31',
  port_quota: 10,
  used_ports: 3,
  total_tunnels: 3,
  online_tunnels: 2,
}

export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(500)
    return { user: mockUser, access_token: mockToken }
  },

  register: async (email: string, password: string) => {
    await delay(500)
    return { message: '注册成功' }
  },

  // Dashboard
  getStats: async () => {
    await delay(300)
    return mockStats
  },

  // Tunnels
  getTunnels: async () => {
    await delay(300)
    return mockTunnels
  },

  createTunnel: async (data: any) => {
    await delay(500)
    const newTunnel = {
      id: Date.now(),
      ...data,
      status: 'offline',
    }
    mockTunnels.push(newTunnel)
    return newTunnel
  },

  deleteTunnel: async (id: number) => {
    await delay(300)
    const index = mockTunnels.findIndex(t => t.id === id)
    if (index > -1) {
      mockTunnels.splice(index, 1)
    }
    return { message: '删除成功' }
  },

  // Activation
  activateCode: async (code: string) => {
    await delay(500)
    if (code === 'DEMO-CODE-1234-5678') {
      return { message: '激活成功' }
    }
    throw new Error('兑换码无效')
  },

  // Profile
  changePassword: async (currentPassword: string, newPassword: string) => {
    await delay(500)
    return { message: '密码修改成功' }
  },
}
