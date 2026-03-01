import { Button } from '../ui/Button'
import type { Tunnel } from '../../types'
import { formatTunnelType, formatStatus } from '../../utils/format'

interface TunnelCardProps {
  tunnel: Tunnel
  onDelete: (id: number) => void
}

export const TunnelCard = ({ tunnel, onDelete }: TunnelCardProps) => {
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getAccessUrl = () => {
    if (tunnel.type === 'http' && tunnel.subdomain) {
      return `http://${tunnel.subdomain}.yourdomain.com`
    }
    if (tunnel.type === 'https' && tunnel.custom_domain) {
      return `https://${tunnel.custom_domain}`
    }
    if (tunnel.remote_port) {
      return `server.com:${tunnel.remote_port}`
    }
    return '-'
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{tunnel.name}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${getStatusColor(tunnel.status)}`}>
            {formatStatus(tunnel.status)}
          </span>
        </div>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
          {formatTunnelType(tunnel.type)}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>本地地址:</span>
          <span className="font-mono">{tunnel.local_ip}:{tunnel.local_port}</span>
        </div>
        <div className="flex justify-between">
          <span>访问地址:</span>
          <span className="font-mono">{getAccessUrl()}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(tunnel.id)}
        >
          删除
        </Button>
      </div>
    </div>
  )
}
