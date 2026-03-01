import { useState } from 'react'
import { User } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuthStore } from '../../store/authStore'
import { mockApi } from '../../services/mockApi'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function Profile() {
  const user = useAuthStore(state => state.user)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: '两次密码不一致' })
      return
    }

    if (passwords.new.length < 8) {
      setMessage({ type: 'error', text: '新密码至少8位' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      if (USE_MOCK) {
        await mockApi.changePassword(passwords.current, passwords.new)
      } else {
        await fetch('/api/v1/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            current_password: passwords.current,
            new_password: passwords.new,
          })
        })
      }
      setMessage({ type: 'success', text: '密码修改成功' })
      setPasswords({ current: '', new: '', confirm: '' })
      setIsChangingPassword(false)
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || '密码修改失败' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">个人信息</h1>
        <p className="text-slate-600">管理您的账户信息</p>
      </div>

      <Card hoverable={false} className="max-w-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-cta/10 p-4 rounded-xl">
            <User className="w-12 h-12 text-cta" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">{user?.email}</h2>
            <p className="text-sm text-slate-600">用户 ID: {user?.id}</p>
          </div>
        </div>

        <div className="space-y-4 py-4 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-primary">邮箱地址</p>
              <p className="text-sm text-slate-600">{user?.email}</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-primary">FRP Token</p>
              <p className="text-sm text-slate-600 font-mono">
                {user?.frp_token || '未生成'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                用于 FRP 客户端连接验证
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-primary">密码</p>
              <p className="text-sm text-slate-600">••••••••</p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? '取消' : '修改密码'}
            </Button>
          </div>
        </div>

        {isChangingPassword && (
          <div className="mt-6 p-6 bg-slate-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-primary mb-4">修改密码</h3>

            {message.text && (
              <div className={`px-4 py-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <Input
              label="当前密码"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />

            <Input
              label="新密码"
              type="password"
              placeholder="至少8位"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />

            <Input
              label="确认新密码"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />

            <Button 
              onClick={handleChangePassword}
              loading={loading}
              className="w-full"
            >
              确认修改
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
