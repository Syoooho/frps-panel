import api from './api'
import type { User, RedeemCode, PaginatedResponse } from '../types'

export const adminService = {
  // 用户管理
  getUsers: (page = 1, pageSize = 20) => 
    api.get<PaginatedResponse<User>>('/admin/users', { params: { page, page_size: pageSize } }),
  
  deleteUser: (userId: number) => 
    api.delete(`/admin/users/${userId}`),
  
  // 兑换码管理
  getCodes: (page = 1, pageSize = 20) => 
    api.get<PaginatedResponse<RedeemCode>>('/admin/codes', { params: { page, page_size: pageSize } }),
  
  generateCodes: (planType: 'monthly' | 'yearly', count: number) => 
    api.post('/admin/codes/generate', { plan_type: planType, count }),
  
  deleteCode: (codeId: number) => 
    api.delete(`/admin/codes/${codeId}`),
  
  // 系统统计
  getStats: () => 
    api.get('/admin/stats'),
}
