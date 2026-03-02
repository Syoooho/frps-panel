import { useState } from 'react'
import { Gift } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { subscriptionService } from '../../services/subscription'
import { useAuthStore } from '../../store/authStore'

export default function Activate() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const navigate = useNavigate()
  const refreshUser = useAuthStore(state => state.refreshUser)

  const handleActivate = async () => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: '请输入兑换码' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await subscriptionService.activateCode(code)
      setMessage({ type: 'success', text: '激活成功！订阅已更新' })
      setCode('')
      
      // 刷新用户信息
      await refreshUser()
      
      // 3秒后跳转到概览页面
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || '激活失败，请检查兑换码是否正确' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">激活兑换码</h1>
        <p className="text-slate-600">使用兑换码激活或续费您的订阅</p>
      </div>

      <Card hoverable={false} className="max-w-2xl">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-cta/10 p-4 rounded-xl">
            <Gift className="w-12 h-12 text-cta" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-primary text-center mb-6">
          输入您的兑换码
        </h2>

        {message.text && (
          <div className={`px-4 py-3 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <Input
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center text-lg tracking-wider"
          />

          <Button 
            onClick={handleActivate} 
            className="w-full"
            loading={loading}
          >
            激活
          </Button>
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-primary mb-2">使用说明</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• 兑换码格式：XXXX-XXXX-XXXX-XXXX</li>
            <li>• 每个兑换码只能使用一次</li>
            <li>• 激活后订阅立即生效</li>
            <li>• 如已有订阅，将自动延长到期时间</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
