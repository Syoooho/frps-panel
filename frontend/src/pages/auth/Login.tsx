import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Server, Shield } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authService } from '../../services/auth'
import { useAuthStore } from '../../store/authStore'

interface LoginForm {
  email: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore(state => state.setAuth)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const isAdmin = location.pathname === '/admin/login'
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    
    try {
      const response = await authService.login({ email: data.email, password: data.password })
      setAuth(response.access_token, response.user)
      navigate(isAdmin ? '/admin' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || '登录失败，请检查邮箱和密码')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isAdmin 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-primary via-secondary to-slate-800'
    }`}>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className={`p-3 rounded-xl ${isAdmin ? 'bg-red-100' : 'bg-cta/10'}`}>
            {isAdmin ? (
              <Shield className="w-8 h-8 text-red-600" />
            ) : (
              <Server className="w-8 h-8 text-cta" />
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          {isAdmin ? '管理员登录' : 'FRP SaaS 平台'}
        </h1>
        <p className="text-center text-slate-600 mb-8">
          {isAdmin ? 'FRP SaaS 后台管理系统' : '登录您的账户'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label={isAdmin ? '管理员邮箱' : '邮箱'}
            type="email"
            placeholder={isAdmin ? 'admin@example.com' : 'your@email.com'}
            error={errors.email?.message}
            {...register('email', { 
              required: '请输入邮箱',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '邮箱格式不正确'
              }
            })}
          />

          <Input
            label="密码"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { 
              required: '请输入密码',
              minLength: {
                value: 6,
                message: '密码至少6位'
              }
            })}
          />

          <Button 
            type="submit" 
            className="w-full"
            loading={loading}
          >
            登录
          </Button>
        </form>

        <div className="text-center text-slate-600 mt-6 space-y-2">
          {!isAdmin && (
            <p>
              还没有账户？
              <Link to="/register" className="text-cta font-medium hover:underline ml-1">
                立即注册
              </Link>
            </p>
          )}
          <p>
            <Link 
              to={isAdmin ? '/login' : '/admin/login'} 
              className="text-slate-500 hover:text-primary transition-colors"
            >
              {isAdmin ? '返回用户登录' : '管理员入口'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
