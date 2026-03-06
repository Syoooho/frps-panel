import { useEffect, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Toast from '../../components/ui/Toast'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { useToast } from '../../hooks/useToast'
import { useConfirm } from '../../hooks/useConfirm'
import { adminService } from '../../services/admin'
import type { User } from '../../types'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const { toasts, showToast, removeToast } = useToast()
  const { isOpen, options, confirm, handleConfirm, handleCancel } = useConfirm()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminService.getUsers(0, 100)
      setUsers(response.data)
    } catch (error: any) {
      showToast(error.response?.data?.detail || '获取用户列表失败', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = (user: User) => {
    confirm({
      title: '删除用户',
      message: `确定要删除用户 ${user.email} 吗？此操作将同时删除该用户的所有隧道和订阅信息。`,
      confirmText: '删除',
      cancelText: '取消',
      onConfirm: async () => {
        try {
          await adminService.deleteUser(user.id)
          showToast('用户删除成功', 'success')
          fetchUsers()
        } catch (error: any) {
          showToast(error.response?.data?.detail || '删除用户失败', 'error')
        }
      }
    })
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const getSubscriptionStatus = (user: User) => {
    if (!user.subscription) return { text: '未激活', variant: 'error' as const }
    if (user.subscription.is_active) return { text: '有效', variant: 'success' as const }
    return { text: '已过期', variant: 'warning' as const }
  }

  if (loading) {
    return <div className="text-center py-12">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} onClose={removeToast} />
      <ConfirmDialog
        isOpen={isOpen}
        title={options?.title || ''}
        message={options?.message || ''}
        confirmText={options?.confirmText}
        cancelText={options?.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">角色</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">订阅</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">注册时间</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    {searchTerm ? '未找到匹配的用户' : '暂无用户'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const subStatus = getSubscriptionStatus(user)
                  return (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm">{user.id}</td>
                      <td className="py-3 px-4 text-sm font-medium">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.is_admin ? 'error' : 'info'}>
                          {user.is_admin ? '管理员' : '普通用户'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={user.is_active ? 'success' : 'error'}>
                          {user.is_active ? '正常' : '禁用'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={subStatus.variant}>
                          {subStatus.text}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{formatDate(user.created_at)}</td>
                      <td className="py-3 px-4">
                        {!user.is_admin && (
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="删除用户"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
