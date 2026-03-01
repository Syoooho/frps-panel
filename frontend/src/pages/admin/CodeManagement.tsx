import { useState } from 'react'
import { Plus, Download } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Toast from '../../components/ui/Toast'

export default function CodeManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as any })
  const [formData, setFormData] = useState({
    plan_type: 'monthly',
    quantity: '10',
    valid_days: '365',
  })

  const codes = [
    { id: 1, code: 'DEMO-1234-5678-ABCD', plan_type: 'monthly', status: 'unused', created_at: '2026-03-01' },
    { id: 2, code: 'DEMO-2345-6789-BCDE', plan_type: 'yearly', status: 'used', used_by: 'user1@example.com', created_at: '2026-02-28' },
    { id: 3, code: 'DEMO-3456-7890-CDEF', plan_type: 'monthly', status: 'unused', created_at: '2026-02-25' },
  ]

  const handleGenerate = () => {
    setIsModalOpen(false)
    setToast({ isVisible: true, message: `成功生成 ${formData.quantity} 个兑换码`, type: 'success' })
  }

  const handleExport = () => {
    setToast({ isVisible: true, message: '兑换码已导出为 CSV 文件', type: 'success' })
  }

  return (
    <div className="space-y-6">
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">兑换码管理</h1>
          <p className="text-slate-600">生成和管理订阅兑换码</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-5 h-5 mr-2" />
            导出 CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            批量生成
          </Button>
        </div>
      </div>

      <Card hoverable={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">兑换码</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">套餐类型</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">使用者</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">创建时间</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-mono">{code.code}</td>
                  <td className="py-3 px-4">
                    <Badge variant="info">
                      {code.plan_type === 'monthly' ? '月付' : '年付'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={code.status === 'unused' ? 'success' : 'error'}>
                      {code.status === 'unused' ? '未使用' : '已使用'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {code.used_by || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{code.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="批量生成兑换码"
        size="md"
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              套餐类型
            </label>
            <select
              className="input w-full cursor-pointer"
              value={formData.plan_type}
              onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
            >
              <option value="monthly">月付套餐</option>
              <option value="yearly">年付套餐</option>
            </select>
          </div>

          <Input
            label="生成数量"
            type="number"
            placeholder="10"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />

          <Input
            label="有效期（天）"
            type="number"
            placeholder="365"
            value={formData.valid_days}
            onChange={(e) => setFormData({ ...formData, valid_days: e.target.value })}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button onClick={handleGenerate} className="flex-1">
              生成
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
