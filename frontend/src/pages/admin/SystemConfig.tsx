import { useState } from 'react'
import { Save } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Toast from '../../components/ui/Toast'

export default function SystemConfig() {
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as any })
  const [config, setConfig] = useState({
    monthly_ports: '10',
    yearly_ports: '20',
    default_domain: 'frp.example.com',
    port_range_start: '10000',
    port_range_end: '20000',
    grace_period_days: '1',
  })

  const handleSave = () => {
    setToast({ isVisible: true, message: '配置保存成功', type: 'success' })
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
        <h2 className="text-xl font-bold text-primary mb-6">套餐配置</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="月付套餐端口数"
            type="number"
            value={config.monthly_ports}
            onChange={(e) => setConfig({ ...config, monthly_ports: e.target.value })}
          />
          <Input
            label="年付套餐端口数"
            type="number"
            value={config.yearly_ports}
            onChange={(e) => setConfig({ ...config, yearly_ports: e.target.value })}
          />
        </div>
      </Card>

      <Card hoverable={false}>
        <h2 className="text-xl font-bold text-primary mb-6">服务器配置</h2>
        <div className="space-y-6">
          <Input
            label="默认域名"
            placeholder="frp.example.com"
            value={config.default_domain}
            onChange={(e) => setConfig({ ...config, default_domain: e.target.value })}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="端口范围起始"
              type="number"
              value={config.port_range_start}
              onChange={(e) => setConfig({ ...config, port_range_start: e.target.value })}
            />
            <Input
              label="端口范围结束"
              type="number"
              value={config.port_range_end}
              onChange={(e) => setConfig({ ...config, port_range_end: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card hoverable={false}>
        <h2 className="text-xl font-bold text-primary mb-6">订阅配置</h2>
        <Input
          label="宽限期（天）"
          type="number"
          value={config.grace_period_days}
          onChange={(e) => setConfig({ ...config, grace_period_days: e.target.value })}
          className="max-w-md"
        />
        <p className="text-sm text-slate-600 mt-2">
          订阅到期后，用户仍可使用服务的天数
        </p>
      </Card>
    </div>
  )
}
