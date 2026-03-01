import { create } from 'zustand'

interface Tunnel {
  id: number
  name: string
  type: 'tcp' | 'udp' | 'http' | 'https'
  local_port: number
  remote_port?: number
  custom_domain?: string
  status: 'online' | 'offline'
}

interface TunnelState {
  tunnels: Tunnel[]
  setTunnels: (tunnels: Tunnel[]) => void
  addTunnel: (tunnel: Tunnel) => void
  removeTunnel: (id: number) => void
}

export const useTunnelStore = create<TunnelState>((set) => ({
  tunnels: [],
  setTunnels: (tunnels) => set({ tunnels }),
  addTunnel: (tunnel) => set((state) => ({ tunnels: [...state.tunnels, tunnel] })),
  removeTunnel: (id) => set((state) => ({ tunnels: state.tunnels.filter(t => t.id !== id) })),
}))
