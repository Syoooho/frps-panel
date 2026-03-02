import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Server, Activity, Clock, Zap } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { mockApi } from '../../services/mockApi'
import api from '../../services/api'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

interface DashboardStats {
  subscription: {
    plan_type: string
    max_tunnels: number
    end_date: string
    is_active: boolean
  } | null
  tunnels: {
    total: number
    online: number
    offline: number
    by_type: Record<string, number>
    usage_percent: number
  }
}

export default function Overview() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = USE_MOCK 
        ? await mockApi.getStats() 
        : await api.get('/dashboard/stats')
      setStats(data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  const subscription = stats?.subscription
  const tunnels = stats?.tunnels
  const quotaPercentage = tunnels?.usage_percent || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">仪表板概览</h1>
        <p className="text-slate-600">欢迎回来，查看您的服务状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverable={false} className="border-l-4 border-l-cta">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">订阅状态</p>
              <p className="text-2xl font-bold text-primary">
                {subscription?.is_active ? '正常' : '未激活'}
              </p>
            </div>
            <div className="bg-cta/10 p-3 rounded-lg">
              <Server className="w-6 h-6 text-cta" />
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">在线隧道</p>
              <p className="text-2xl font-bold text-primary">
                {tunnels?.online || 0} / {tunnels?.total || 0}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">端口配额</p>
              <p className="text-2xl font-bold text-primary">
                {tunnels?.total || 0} / {subscription?.max_tunnels || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">到期时间</p>
              <p className="text-lg font-bold text-primary">
                {subscription?.end_date ? new Date(subscription.end_date).toLocaleDateString('zh-CN') : '未激活'}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card hoverable={false}>
        <h2 className="text-xl font-bold text-primary mb-4">配额使用情况</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">端口使用率</span>
            <span className="font-semibold text-primary">{quotaPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-cta h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-600">
            已使用 {tunnels?.total || 0} 个端口，剩余 {(subscription?.max_tunnels || 0) - (tunnels?.total || 0)} 个
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => navigate('/dashboard/tunnels')}>
          <h3 className="text-lg font-bold text-primary mb-2">隧道管理</h3>
          <p className="text-slate-600 mb-4">创建和管理您的内网穿透隧道</p>
          <Button variant="secondary">前往管理</Button>
        </Card>

        <Card onClick={() => navigate('/dashboard/activate')}>
          <h3 className="text-lg font-bold text-primary mb-2">激活兑换码</h3>
          <p className="text-slate-600 mb-4">使用兑换码激活或续费订阅</p>
          <Button variant="secondary">立即激活</Button>
        </Card>
      </div>
    </div>
  )
}
