import { useEffect, useState } from 'react'
import { Users, Network, Activity, Gift, Cpu, HardDrive, Database, Server } from 'lucide-react'
import Card from '../../components/ui/Card'
import { monitorService, MonitorOverview } from '../../services/monitor'
import { useAuthStore } from '../../store/authStore'

export default function AdminOverview() {
  const user = useAuthStore(state => state.user)
  const [data, setData] = useState<MonitorOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('当前用户:', user)
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // 每30秒刷新
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const overview = await monitorService.getOverview()
      console.log('监控数据:', overview)
      setData(overview)
    } catch (err: any) {
      console.error('获取监控数据失败:', err)
      console.error('错误详情:', err.response?.data || err.message)
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
        <h1 className="text-3xl font-bold text-primary mb-2">系统监控</h1>
        <p className="text-slate-600">实时系统状态和关键指标</p>
      </div>

      {/* 系统资源监控 */}
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">系统资源</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hoverable={false} className="border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">CPU 使用率</p>
                <p className="text-3xl font-bold text-primary">
                  {data?.system?.cpu_percent?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false} className="border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">内存使用率</p>
                <p className="text-3xl font-bold text-primary">
                  {data?.system?.memory_percent?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Database className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false} className="border-l-4 border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">磁盘使用率</p>
                <p className="text-3xl font-bold text-primary">
                  {data?.system?.disk_percent?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false} className={`border-l-4 ${data?.system?.frps_running ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">FRP 服务器</p>
                <p className={`text-2xl font-bold ${data?.system?.frps_running ? 'text-green-600' : 'text-red-600'}`}>
                  {data?.system?.frps_running ? '运行中' : '已停止'}
                </p>
              </div>
              <div className={`${data?.system?.frps_running ? 'bg-green-100' : 'bg-red-100'} p-3 rounded-lg`}>
                <Server className={`w-6 h-6 ${data?.system?.frps_running ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 用户统计 */}
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">用户统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">总用户数</p>
                <p className="text-2xl font-bold text-primary">{data?.users.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">活跃用户</p>
                <p className="text-2xl font-bold text-primary">{data?.users.active || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">今日新增</p>
                <p className="text-2xl font-bold text-primary">{data?.users.new_today || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 隧道统计 */}
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">隧道统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hoverable={false}>
            <div>
              <p className="text-sm text-slate-600 mb-1">总隧道数</p>
              <p className="text-2xl font-bold text-primary">{data?.tunnels.total || 0}</p>
            </div>
          </Card>

          <Card hoverable={false}>
            <div>
              <p className="text-sm text-slate-600 mb-1">在线隧道</p>
              <p className="text-2xl font-bold text-green-600">{data?.tunnels.online || 0}</p>
            </div>
          </Card>

          <Card hoverable={false}>
            <div>
              <p className="text-sm text-slate-600 mb-1">离线隧道</p>
              <p className="text-2xl font-bold text-slate-400">{data?.tunnels.offline || 0}</p>
            </div>
          </Card>

          <Card hoverable={false}>
            <div>
              <p className="text-sm text-slate-600 mb-1">在线率</p>
              <p className="text-2xl font-bold text-primary">
                {data?.tunnels.total ? Math.round((data.tunnels.online / data.tunnels.total) * 100) : 0}%
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card hoverable={false} className="bg-blue-50">
            <p className="text-xs text-slate-600">TCP</p>
            <p className="text-xl font-bold text-blue-600">{data?.tunnels.by_type.tcp || 0}</p>
          </Card>
          <Card hoverable={false} className="bg-green-50">
            <p className="text-xs text-slate-600">UDP</p>
            <p className="text-xl font-bold text-green-600">{data?.tunnels.by_type.udp || 0}</p>
          </Card>
          <Card hoverable={false} className="bg-orange-50">
            <p className="text-xs text-slate-600">HTTP</p>
            <p className="text-xl font-bold text-orange-600">{data?.tunnels.by_type.http || 0}</p>
          </Card>
          <Card hoverable={false} className="bg-purple-50">
            <p className="text-xs text-slate-600">HTTPS</p>
            <p className="text-xl font-bold text-purple-600">{data?.tunnels.by_type.https || 0}</p>
          </Card>
        </div>
      </div>

      {/* 订阅统计 */}
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">订阅统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">总订阅数</p>
                <p className="text-2xl font-bold text-primary">{data?.subscriptions.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Gift className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">有效订阅</p>
                <p className="text-2xl font-bold text-green-600">{data?.subscriptions.active || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">已过期</p>
                <p className="text-2xl font-bold text-red-600">{data?.subscriptions.expired || 0}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Network className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">即将过期</p>
                <p className="text-2xl font-bold text-orange-600">{data?.subscriptions.expiring_soon || 0}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
