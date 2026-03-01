import api from './api'
import type { Tunnel } from '../types'

export const tunnelService = {
  getTunnels: () => api.get<Tunnel[]>('/tunnels'),
  
  getTunnel: (id: number) => api.get<Tunnel>(`/tunnels/${id}`),
  
  createTunnel: (data: Partial<Tunnel>) => api.post<Tunnel>('/tunnels', data),
  
  updateTunnel: (id: number, data: Partial<Tunnel>) => api.put<Tunnel>(`/tunnels/${id}`, data),
  
  deleteTunnel: (id: number) => api.delete(`/tunnels/${id}`),
}
