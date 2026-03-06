import api from './api'
import type { User, RedeemCode } from '../types'

export const adminService = {
  // 用户管理
  getUsers: (skip = 0, limit = 100) => 
    api.get<User[]>('/admin/users', { params: { skip, limit } }),
  
  deleteUser: (userId: number) => 
    api.delete(`/admin/users/${userId}`),
  
  // 兑换码管理
  getCodes: (skip = 0, limit = 100) => 
    api.get<RedeemCode[]>('/activation/codes', { params: { skip, limit } }),
  
  generateCodes: (planType: 'monthly' | 'yearly', count: number) => 
    api.post('/activation/generate', { plan_type: planType, count }),
  
  deleteCode: (codeId: number) => 
    api.delete(`/activation/codes/${codeId}`),
  
  // 系统统计
  getStats: () => 
    api.get('/admin/stats'),
}
