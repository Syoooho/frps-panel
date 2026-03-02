import { useState, useEffect } from 'react'
import type { Tunnel } from '../../types'
import { formatTunnelType, formatStatus } from '../../utils/format'
import { generateFrpcConfig, copyToClipboard } from '../../utils/frpConfig'
import { useAuthStore } from '../../store/authStore'
import { systemService } from '../../services/system'
import { Copy, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface TunnelCardProps {
  tunnel: Tunnel
  onDelete: (id: number) => void
  onEdit: (tunnel: Tunnel) => void
  onCopySuccess?: () => void
}

export const TunnelCard = ({ tunnel, onDelete, onEdit, onCopySuccess }: TunnelCardProps) => {
  const user = useAuthStore(state => state.user)
  const [serverConfig, setServerConfig] = useState({ addr: '127.0.0.1', port: 7000 })
  const [isExpanded, setIsExpanded] = useState(false)
  
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
      return `${serverConfig.addr}:${tunnel.remote_port}`
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
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      {/* 卡片头部 - 始终可见 */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{tunnel.name}</h3>
              <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(tunnel.status)}`}>
                {formatStatus(tunnel.status)}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {formatTunnelType(tunnel.type)}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-mono">{tunnel.local_ip}:{tunnel.local_port}</span>
              <span className="mx-2">→</span>
              <span className="font-mono">{getAccessUrl()}</span>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => onEdit(tunnel)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="编辑"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(tunnel.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
              title={isExpanded ? "收起" : "展开配置"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 展开的配置详情 */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">配置信息</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">隧道类型:</span>
                  <span className="font-mono">{tunnel.type.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">本地地址:</span>
                  <span className="font-mono">{tunnel.local_ip}:{tunnel.local_port}</span>
                </div>
                {tunnel.remote_port && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">远程端口:</span>
                    <span className="font-mono">{tunnel.remote_port}</span>
                  </div>
                )}
                {tunnel.subdomain && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">子域名:</span>
                    <span className="font-mono">{tunnel.subdomain}</span>
                  </div>
                )}
                {tunnel.custom_domain && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">自定义域名:</span>
                    <span className="font-mono">{tunnel.custom_domain}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleCopyConfig}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>复制 FRP 客户端配置</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
