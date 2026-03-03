import { useEffect, useState } from 'react'
import { Search, Ban, CheckCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

interface User {
  id: number
  email: string
  is_active: boolean
  subscription_status: string
  tunnel_count: number
  created_at: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const mockUsers: User[] = [
      {
        id: 1,
        email: 'user1@example.com',
        is_active: true,
        subscription_status: 'active',
        tunnel_count: 3,
        created_at: '2026-01-15',
      },
      {
        id: 2,
        email: 'user2@example.com',
        is_active: true,
        subscription_status: 'expired',
        tunnel_count: 0,
        created_at: '2026-02-10',
      },
      {
        id: 3,
        email: 'user3@example.com',
        is_active: false,
        subscription_status: 'inactive',
        tunnel_count: 5,
        created_at: '2025-12-20',
      },
    ]
    setUsers(mockUsers)
    setLoading(false)
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">用户管理</h1>
          <p className="text-slate-600">管理所有注册用户</p>
        </div>
      </div>

      <Card hoverable={false}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索用户邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">邮箱</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">订阅</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">隧道数</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">注册时间</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm">{user.id}</td>
                  <td className="py-3 px-4 text-sm font-medium">{user.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.is_active ? 'success' : 'error'}>
                      {user.is_active ? '正常' : '禁用'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant={
                        user.subscription_status === 'active' ? 'success' :
                        user.subscription_status === 'expired' ? 'warning' : 'error'
                      }
                    >
                      {user.subscription_status === 'active' ? '有效' :
                       user.subscription_status === 'expired' ? '已过期' : '未激活'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">{user.tunnel_count}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{user.created_at}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {user.is_active ? (
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
