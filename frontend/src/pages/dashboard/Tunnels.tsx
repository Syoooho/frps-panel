import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Toast from '../../components/ui/Toast'
import Input from '../../components/ui/Input'
import { TunnelCard } from '../../components/tunnel/TunnelCard'
import { tunnelService } from '../../services/tunnel'
import { useTunnelStore } from '../../store/tunnelStore'

export default function Tunnels() {
  const { tunnels, setTunnels, removeTunnel } = useTunnelStore()
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTunnel, setEditingTunnel] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; tunnel: any }>({
    isOpen: false,
    tunnel: null,
  })
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as any })
  const [formData, setFormData] = useState({
    name: '',
    type: 'tcp' as 'tcp' | 'udp' | 'http' | 'https',
    local_port: '',
    remote_port: '',
    custom_domain: '',
    subdomain: '',
    custom_http_port: '',
    custom_https_port: '',
    use_encryption: false,
    use_compression: false,
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
      const payload = {
        name: formData.name,
        type: formData.type,
        local_ip: '127.0.0.1',
        local_port: parseInt(formData.local_port),
        remote_port: formData.remote_port ? parseInt(formData.remote_port) : undefined,
        custom_domain: formData.custom_domain || undefined,
        subdomain: formData.subdomain || undefined,
        custom_http_port: formData.custom_http_port ? parseInt(formData.custom_http_port) : undefined,
        custom_https_port: formData.custom_https_port ? parseInt(formData.custom_https_port) : undefined,
        use_encryption: formData.use_encryption,
        use_compression: formData.use_compression,
      }
      
      if (editingTunnel) {
        await tunnelService.updateTunnel(editingTunnel.id, payload)
        setToast({ isVisible: true, message: '隧道更新成功', type: 'success' })
      } else {
        await tunnelService.createTunnel(payload)
        setToast({ isVisible: true, message: '隧道创建成功', type: 'success' })
      }
      
      setIsModalOpen(false)
      setEditingTunnel(null)
      fetchTunnels()
      setFormData({ 
        name: '', 
        type: 'tcp', 
        local_port: '', 
        remote_port: '', 
        custom_domain: '',
        subdomain: '',
        custom_http_port: '',
        custom_https_port: '',
        use_encryption: false,
        use_compression: false,
      })
    } catch (err: any) {
      const message = err.response?.data?.detail || '操作失败，请重试'
      setToast({ isVisible: true, message, type: 'error' })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await tunnelService.deleteTunnel(id)
      removeTunnel(id)
      setDeleteConfirm({ isOpen: false, tunnel: null })
      setToast({ isVisible: true, message: '隧道已删除', type: 'success' })
    } catch (err) {
      setToast({ isVisible: true, message: '删除失败，请重试', type: 'error' })
    }
  }
  
  const handleCopySuccess = () => {
    setToast({ isVisible: true, message: '配置已复制到剪贴板', type: 'success' })
  }
  
  const handleEdit = (tunnel: any) => {
    setEditingTunnel(tunnel)
    setFormData({
      name: tunnel.name,
      type: tunnel.type,
      local_port: tunnel.local_port.toString(),
      remote_port: tunnel.remote_port ? tunnel.remote_port.toString() : '',
      custom_domain: tunnel.custom_domain || '',
      subdomain: tunnel.subdomain || '',
      custom_http_port: tunnel.custom_http_port ? tunnel.custom_http_port.toString() : '',
      custom_https_port: tunnel.custom_https_port ? tunnel.custom_https_port.toString() : '',
      use_encryption: tunnel.use_encryption || false,
      use_compression: tunnel.use_compression || false,
    })
    setIsModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTunnel(null)
    setFormData({ 
      name: '', 
      type: 'tcp', 
      local_port: '', 
      remote_port: '', 
      custom_domain: '',
      subdomain: '',
      custom_http_port: '',
      custom_https_port: '',
      use_encryption: false,
      use_compression: false,
    })
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow"
          title="创建隧道"
        >
          <Plus className="w-5 h-5" />
          <span>创建隧道</span>
        </button>
      </div>

      {tunnels.length === 0 ? (
        <Card hoverable={false} className="text-center py-12">
          <p className="text-slate-600 mb-4">还没有创建任何隧道</p>
          <Button onClick={() => setIsModalOpen(true)}>创建第一个隧道</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tunnels.map((tunnel) => (
            <TunnelCard
              key={tunnel.id}
              tunnel={tunnel}
              onDelete={(id) => setDeleteConfirm({ isOpen: true, tunnel: tunnels.find(t => t.id === id) })}
              onEdit={handleEdit}
              onCopySuccess={handleCopySuccess}
            />
          ))}
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingTunnel ? '编辑隧道' : '创建隧道'}
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
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
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

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700">启用加密传输</label>
                <p className="text-xs text-slate-500 mt-1">使用 TLS 加密隧道数据传输</p>
              </div>
              <input
                type="checkbox"
                checked={formData.use_encryption}
                onChange={(e) => setFormData({ ...formData, use_encryption: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700">启用压缩</label>
                <p className="text-xs text-slate-500 mt-1">压缩传输数据，节省带宽</p>
              </div>
              <input
                type="checkbox"
                checked={formData.use_compression}
                onChange={(e) => setFormData({ ...formData, use_compression: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={handleCloseModal}
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              onClick={handleCreate} 
              className="flex-1"
            >
              {editingTunnel ? '更新' : '创建'}
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
