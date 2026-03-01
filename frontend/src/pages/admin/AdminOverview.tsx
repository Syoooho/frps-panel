import { useEffect, useState } from 'react'
import { Users, Network, Activity, Gift } from 'lucide-react'
import Card from '../../components/ui/Card'
import { mockApi } from '../../services/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

interface AdminStats {
  total_users: number
  active_users: number
  total_tunnels: number
  online_tunnels: number
  total_codes: number
  used_codes: number
}

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      if (USE_MOCK) {
        const data = {
          total_users: 156,
          active_users: 89,
          total_tunnels: 342,
          online_tunnels: 218,
          total_codes: 500,
          used_codes: 156,
        }
        setStats(data)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">数据概览</h1>
        <p className="text-slate-600">系统运行状态和关键指标</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hoverable={false} className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">总用户数</p>
              <p className="text-2xl font-bold text-primary">{stats?.total_users || 0}</p>
              <p className="text-xs text-green-600 mt-1">活跃: {stats?.active_users || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">总隧道数</p>
              <p className="text-2xl font-bold text-primary">{stats?.total_tunnels || 0}</p>
              <p className="text-xs text-green-600 mt-1">在线: {stats?.online_tunnels || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Network className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">兑换码</p>
              <p className="text-2xl font-bold text-primary">{stats?.total_codes || 0}</p>
              <p className="text-xs text-orange-600 mt-1">已使用: {stats?.used_codes || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Gift className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card hoverable={false} className="border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">在线率</p>
              <p className="text-2xl font-bold text-primary">
                {stats ? Math.round((stats.online_tunnels / stats.total_tunnels) * 100) : 0}%
              </p>
              <p className="text-xs text-purple-600 mt-1">隧道在线率</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hoverable={false}>
          <h2 className="text-xl font-bold text-primary mb-4">用户增长趋势</h2>
          <div className="h-64 flex items-center justify-center text-slate-400">
            图表区域（可集成 Recharts）
          </div>
        </Card>

        <Card hoverable={false}>
          <h2 className="text-xl font-bold text-primary mb-4">隧道类型分布</h2>
          <div className="h-64 flex items-center justify-center text-slate-400">
            图表区域（可集成 Recharts）
          </div>
        </Card>
      </div>
    </div>
  )
}
