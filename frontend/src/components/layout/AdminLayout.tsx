import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, LayoutDashboard, Users, Gift, Settings, Network, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: '数据概览' },
    { path: '/admin/users', icon: Users, label: '用户管理' },
    { path: '/admin/codes', icon: Gift, label: '兑换码管理' },
    { path: '/admin/tunnels', icon: Network, label: '隧道监控' },
    { path: '/admin/config', icon: Settings, label: '系统配置' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">FRP 管理后台</span>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
                        ? 'bg-red-600 text-white'
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
