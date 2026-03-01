import { useEffect, useState } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Toast from '../../components/ui/Toast'
import Input from '../../components/ui/Input'
import { tunnelService } from '../../services/tunnel'
import { useTunnelStore } from '../../store/tunnelStore'

export default function Tunnels() {
  const { tunnels, setTunnels, removeTunnel } = useTunnelStore()
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; tunnel: any }>({
    isOpen: false,
    tunnel: null,
  })
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as any })
  const [formData, setFormData] = useState({
    name: '',
    type: 'tcp',
    local_port: '',
    remote_port: '',
    custom_domain: '',
  })

  useEffect(() => {
    fetchTunnels()
  }, [])

  const fetchTunnels = async () => {
    try {
      const data = await tunnelService.getTunnels()
      setTunnels(data as any)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await tunnelService.createTunnel(formData)
      setIsModalOpen(false)
      fetchTunnels()
      setFormData({ name: '', type: 'tcp', local_port: '', remote_port: '', custom_domain: '' })
      setToast({ isVisible: true, message: '隧道创建成功', type: 'success' })
    } catch (err) {
      setToast({ isVisible: true, message: '创建失败，请重试', type: 'error' })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await tunnelService.deleteTunnel(id)
      removeTunnel(id)
      setToast({ isVisible: true, message: '隧道已删除', type: 'success' })
    } catch (err) {
      setToast({ isVisible: true, message: '删除失败，请重试', type: 'error' })
    }
  }

  const copyConfig = (tunnel: any) => {
    const config = `[${tunnel.name}]
type = ${tunnel.type}
local_port = ${tunnel.local_port}
${tunnel.remote_port ? `remote_port = ${tunnel.remote_port}` : ''}
${tunnel.custom_domain ? `custom_domains = ${tunnel.custom_domain}` : ''}`
    
    navigator.clipboard.writeText(config)
    setToast({ isVisible: true, message: '配置已复制到剪贴板', type: 'success' })
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">隧道管理</h1>
          <p className="text-slate-600">管理您的内网穿透隧道</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          创建隧道
        </Button>
      </div>

      {tunnels.length === 0 ? (
        <Card hoverable={false} className="text-center py-12">
          <p className="text-slate-600 mb-4">还没有创建任何隧道</p>
          <Button onClick={() => setIsModalOpen(true)}>创建第一个隧道</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tunnels.map((tunnel) => (
            <Card key={tunnel.id} hoverable={false}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-primary mb-2">{tunnel.name}</h3>
                  <Badge variant={tunnel.status === 'online' ? 'success' : 'error'}>
                    {tunnel.status === 'online' ? '在线' : '离线'}
                  </Badge>
                </div>
                <Badge variant="info">{tunnel.type.toUpperCase()}</Badge>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">本地端口:</span>
                  <span className="font-medium">{tunnel.local_port}</span>
                </div>
                {tunnel.remote_port && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">远程端口:</span>
                    <span className="font-medium">{tunnel.remote_port}</span>
                  </div>
                )}
                {tunnel.custom_domain && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">域名:</span>
                    <span className="font-medium">{tunnel.custom_domain}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => copyConfig(tunnel)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>复制配置</span>
                </button>
                <button
                  onClick={() => setDeleteConfirm({ isOpen: true, tunnel })}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="创建隧道"
        size="md"
      >
        <div className="space-y-5">
          <Input
            label="隧道名称"
            placeholder="my-tunnel"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              隧道类型
            </label>
            <select
              className="input w-full cursor-pointer"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="tcp">TCP - 适用于 SSH、数据库等</option>
              <option value="udp">UDP - 适用于游戏服务器等</option>
              <option value="http">HTTP - 适用于网站、API</option>
              <option value="https">HTTPS - 适用于加密网站</option>
            </select>
          </div>

          <Input
            label="本地端口"
            type="number"
            placeholder="3000"
            value={formData.local_port}
            onChange={(e) => setFormData({ ...formData, local_port: e.target.value })}
          />

          {(formData.type === 'tcp' || formData.type === 'udp') && (
            <Input
              label="远程端口（可选）"
              type="number"
              placeholder="留空自动分配"
              value={formData.remote_port}
              onChange={(e) => setFormData({ ...formData, remote_port: e.target.value })}
            />
          )}

          {(formData.type === 'http' || formData.type === 'https') && (
            <Input
              label="自定义域名"
              placeholder="example.com"
              value={formData.custom_domain}
              onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
            />
          )}

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              onClick={handleCreate} 
              className="flex-1"
            >
              创建隧道
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, tunnel: null })}
        onConfirm={() => handleDelete(deleteConfirm.tunnel?.id)}
        title="删除隧道"
        message={
          <div>
            <p className="mb-2">确定要删除隧道 <span className="font-semibold">{deleteConfirm.tunnel?.name}</span> 吗？</p>
            <p className="text-sm">此操作无法撤销。</p>
          </div>
        }
        confirmText="删除"
        cancelText="取消"
      />
    </div>
  )
}
