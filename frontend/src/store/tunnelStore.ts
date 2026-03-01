import { create } from 'zustand'
import type { Tunnel } from '../types'

interface TunnelState {
  tunnels: Tunnel[]
  setTunnels: (tunnels: Tunnel[]) => void
  addTunnel: (tunnel: Tunnel) => void
  removeTunnel: (id: number) => void
  updateTunnel: (id: number, updates: Partial<Tunnel>) => void
}

export const useTunnelStore = create<TunnelState>((set) => ({
  tunnels: [],
  setTunnels: (tunnels) => set({ tunnels }),
  addTunnel: (tunnel) => set((state) => ({ tunnels: [...state.tunnels, tunnel] })),
  removeTunnel: (id) => set((state) => ({ tunnels: state.tunnels.filter(t => t.id !== id) })),
  updateTunnel: (id, updates) => set((state) => ({
    tunnels: state.tunnels.map(t => t.id === id ? { ...t, ...updates } : t)
  })),
}))
