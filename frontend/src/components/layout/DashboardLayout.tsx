import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Server, LayoutDashboard, Network, Gift, User, LogOut, Users, Settings, Shield, Activity } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // 普通用户菜单
  const userNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: '概览' },
    { path: '/dashboard/tunnels', icon: Network, label: '隧道管理' },
    { path: '/dashboard/activate', icon: Gift, label: '激活兑换码' },
    { path: '/dashboard/profile', icon: User, label: '个人信息' },
  ]

  // 管理员额外菜单
  const adminNavItems = [
    { path: '/dashboard/monitor', icon: Activity, label: '系统监控' },
    { path: '/dashboard/users', icon: Users, label: '用户管理' },
    { path: '/dashboard/codes', icon: Gift, label: '兑换码管理' },
    { path: '/dashboard/config', icon: Settings, label: '系统配置' },
  ]

  const navItems = user?.is_admin ? [...userNavItems, ...adminNavItems] : userNavItems

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${user?.is_admin ? 'bg-red-600' : 'bg-cta/10'}`}>
                {user?.is_admin ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <Server className="w-6 h-6 text-cta" />
                )}
              </div>
              <div>
                <span className="text-xl font-bold text-primary">EasyTunnel</span>
                {user?.is_admin && (
                  <p className="text-xs text-slate-500">管理员</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>退出</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? user?.is_admin ? 'bg-red-600 text-white' : 'bg-cta text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
