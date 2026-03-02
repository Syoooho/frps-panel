import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Server } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { authService } from '../../services/auth'

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError('')
    
    try {
      await authService.register({ email: data.email, password: data.password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || '注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-cta/10 p-3 rounded-xl">
            <Server className="w-8 h-8 text-cta" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-primary mb-2">
          创建账户
        </h1>
        <p className="text-center text-slate-600 mb-8">
          开始使用 EasyTunnel 易隧道服务
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="邮箱"
            type="email"
            placeholder="your@email.com"
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
            placeholder="至少8位"
            error={errors.password?.message}
            {...register('password', { 
              required: '请输入密码',
              minLength: {
                value: 8,
                message: '密码至少8位'
              }
            })}
          />

          <Input
            label="确认密码"
            type="password"
            placeholder="再次输入密码"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', { 
              required: '请确认密码',
              validate: value => value === password || '两次密码不一致'
            })}
          />

          <Button 
            type="submit" 
            className="w-full"
            loading={loading}
          >
            注册
          </Button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          已有账户？
          <Link to="/login" className="text-cta font-medium hover:underline ml-1">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  )
}
