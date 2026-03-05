import { useState } from 'react'
import Button from '../ui/Button'
import type { Tunnel } from '../../types'

interface TunnelFormProps {
  onSubmit: (data: Partial<Tunnel>) => void
  onCancel: () => void
  initialData?: Partial<Tunnel>
}

export const TunnelForm = ({ onSubmit, onCancel, initialData }: TunnelFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'tcp',
    local_ip: initialData?.local_ip || '127.0.0.1',
    local_port: initialData?.local_port || '',
    remote_port: initialData?.remote_port || '',
    custom_domain: initialData?.custom_domain || '',
    subdomain: initialData?.subdomain || '',
    use_encryption: initialData?.use_encryption || false,
    use_compression: initialData?.use_compression || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      local_port: Number(formData.local_port),
      remote_port: formData.remote_port ? Number(formData.remote_port) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">隧道名称</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">协议类型</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="tcp">TCP</option>
          <option value="udp">UDP</option>
          <option value="http">HTTP</option>
          <option value="https">HTTPS</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">本地IP</label>
          <input
            type="text"
            value={formData.local_ip}
            onChange={(e) => setFormData({ ...formData, local_ip: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">本地端口</label>
          <input
            type="number"
            value={formData.local_port}
            onChange={(e) => setFormData({ ...formData, local_port: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
      </div>

      {(formData.type === 'tcp' || formData.type === 'udp') && (
        <div>
          <label className="block text-sm font-medium mb-1">远程端口</label>
          <input
            type="number"
            value={formData.remote_port}
            onChange={(e) => setFormData({ ...formData, remote_port: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      )}

      {formData.type === 'http' && (
        <div>
          <label className="block text-sm font-medium mb-1">子域名</label>
          <input
            type="text"
            value={formData.subdomain}
            onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="myapp"
          />
        </div>
      )}

      {formData.type === 'https' && (
        <div>
          <label className="block text-sm font-medium mb-1">自定义域名</label>
          <input
            type="text"
            value={formData.custom_domain}
            onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="example.com"
          />
        </div>
      )}

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">启用加密传输</label>
            <p className="text-xs text-gray-500 mt-1">使用 TLS 加密隧道数据传输</p>
          </div>
          <input
            type="checkbox"
            checked={formData.use_encryption}
            onChange={(e) => setFormData({ ...formData, use_encryption: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium">启用压缩</label>
            <p className="text-xs text-gray-500 mt-1">压缩传输数据，节省带宽</p>
          </div>
          <input
            type="checkbox"
            checked={formData.use_compression}
            onChange={(e) => setFormData({ ...formData, use_compression: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {initialData ? '更新' : '创建'}
        </Button>
      </div>
    </form>
  )
}
