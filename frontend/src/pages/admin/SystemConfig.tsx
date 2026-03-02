import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Toast from '../../components/ui/Toast'
import { systemService } from '../../services/system'

export default function SystemConfig() {
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as any })
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({
    frp_server_addr: '',
    frp_server_port: '',
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const data = await systemService.getConfig()
      setConfig({
        frp_server_addr: data.frp_server_addr,
        frp_server_port: data.frp_server_port.toString(),
      })
    } catch (err) {
      setToast({ isVisible: true, message: '加载配置失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await systemService.updateConfig({
        frp_server_addr: config.frp_server_addr,
        frp_server_port: parseInt(config.frp_server_port),
      })
      setToast({ isVisible: true, message: '配置保存成功', type: 'success' })
    } catch (err) {
      setToast({ isVisible: true, message: '保存失败，请重试', type: 'error' })
    }
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
          <h1 className="text-3xl font-bold text-primary mb-2">系统配置</h1>
          <p className="text-slate-600">管理系统全局配置</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" />
          保存配置
        </Button>
      </div>

      <Card hoverable={false}>
        <h2 className="text-xl font-bold text-primary mb-6">FRP 服务器配置</h2>
        <div className="space-y-6">
          <Input
            label="服务器地址"
            placeholder="frp.example.com 或 1.2.3.4"
            value={config.frp_server_addr}
            onChange={(e) => setConfig({ ...config, frp_server_addr: e.target.value })}
          />
          <Input
            label="服务器端口"
            type="number"
            placeholder="7000"
            value={config.frp_server_port}
            onChange={(e) => setConfig({ ...config, frp_server_port: e.target.value })}
            className="max-w-md"
          />
          <p className="text-sm text-slate-600">
            此配置用于生成客户端配置文件，用户复制配置时会使用这里设置的服务器地址和端口
          </p>
        </div>
      </Card>
    </div>
  )
}
