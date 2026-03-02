import { useState, useEffect } from 'react'
import Button from '../ui/Button'
import type { Tunnel } from '../../types'
import { formatTunnelType, formatStatus } from '../../utils/format'
import { generateFrpcConfig, copyToClipboard } from '../../utils/frpConfig'
import { useAuthStore } from '../../store/authStore'
import { systemService } from '../../services/system'
import { Copy } from 'lucide-react'

interface TunnelCardProps {
  tunnel: Tunnel
  onDelete: (id: number) => void
  onEdit: (tunnel: Tunnel) => void
  onCopySuccess?: () => void
}

export const TunnelCard = ({ tunnel, onDelete, onEdit, onCopySuccess }: TunnelCardProps) => {
  const user = useAuthStore(state => state.user)
  const [serverConfig, setServerConfig] = useState({ addr: '127.0.0.1', port: 7000 })
  
  useEffect(() => {
    systemService.getConfig().then(config => {
      setServerConfig({ addr: config.frp_server_addr, port: config.frp_server_port })
    }).catch(() => {
      // 使用默认配置
    })
  }, [])
  
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
  
  const handleCopyConfig = async () => {
    if (!user?.email || !user?.frp_token) {
      alert('无法获取用户信息,请重新登录')
      return
    }
    
    const config = generateFrpcConfig(
      tunnel,
      user.email,
      user.frp_token,
      serverConfig.addr,
      serverConfig.port
    )
    
    const success = await copyToClipboard(config)
    if (success) {
      onCopySuccess?.()
    } else {
      alert('复制失败,请手动复制')
    }
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
          variant="secondary"
          onClick={handleCopyConfig}
          className="text-sm py-1.5 px-3"
        >
          <Copy className="w-4 h-4 mr-1" />
          复制配置
        </Button>
        <Button
          variant="secondary"
          onClick={() => onEdit(tunnel)}
          className="text-sm py-1.5 px-3"
        >
          编辑
        </Button>
        <Button
          variant="secondary"
          onClick={() => onDelete(tunnel.id)}
          className="text-sm py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white"
        >
          删除
        </Button>
      </div>
    </div>
  )
}
