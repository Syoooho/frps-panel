import api from './api'
import { mockApi } from './mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const tunnelService = {
  getTunnels: () => 
    USE_MOCK ? mockApi.getTunnels() : api.get('/tunnels'),
  
  createTunnel: (data: any) => 
    USE_MOCK ? mockApi.createTunnel(data) : api.post('/tunnels', data),
  
  deleteTunnel: (id: number) => 
    USE_MOCK ? mockApi.deleteTunnel(id) : api.delete(`/tunnels/${id}`),
}
