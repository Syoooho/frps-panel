import api from './api'
import type { Subscription } from '../types'

export const subscriptionService = {
  getMySubscription: () => api.get<Subscription>('/subscriptions/me'),
  
  activateCode: (code: string) => api.post('/activation/activate', { code }),
}
