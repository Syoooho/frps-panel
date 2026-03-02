import { useState, useEffect } from 'react'
import { Plus, Download, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Toast from '../../components/ui/Toast'
import Pagination from '../../components/ui/Pagination'
import { adminService } from '../../services/admin'
import type { RedeemCode } from '../../types'
import { formatDate } from '../../utils/format'

export default function CodeManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' as any })
  const [codes, setCodes] = useState<RedeemCode[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)
  const [totalCodes, setTotalCodes] = useState(0)
  const [formData, setFormData] = useState({
    plan_type: 'monthly' as 'monthly' | 'yearly',
    quantity: 10,
  })

  useEffect(() => {
    loadCodes()
  }, [currentPage])

  const loadCodes = async () => {
    try {
      setLoading(true)
      const skip = (currentPage - 1) * pageSize
      const data = await adminService.getCodes(skip, pageSize) as any
      setCodes(data.codes)
      setTotalCodes(data.total)
    } catch (error: any) {
      setToast({ isVisible: true, message: error.message || '加载兑换码失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      const result = await adminService.generateCodes(formData.plan_type, formData.quantity) as any
      setIsModalOpen(false)
      setToast({ isVisible: true, message: `成功生成 ${result.codes.length} 个兑换码`, type: 'success' })
      setCurrentPage(1)
      await loadCodes()
    } catch (error: any) {
      setToast({ isVisible: true, message: error.message || '生成兑换码失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const totalPages = Math.ceil(totalCodes / pageSize)

  const handleDelete = async (codeId: number, code: string) => {
    if (!window.confirm(`确定要删除兑换码 ${code} 吗？此操作不可恢复。`)) {
      return
    }

    try {
      await adminService.deleteCode(codeId)
      setToast({ isVisible: true, message: '兑换码已删除', type: 'success' })
      await loadCodes()
    } catch (error: any) {
      setToast({ isVisible: true, message: error.message || '删除失败', type: 'error' })
    }
  }

  const handleExport = () => {
    const csv = [
      ['兑换码', '套餐类型', '状态', '使用者ID', '使用时间', '创建时间'].join(','),
      ...codes.map(code => [
        code.code,
        code.plan_type === 'monthly' ? '月付' : '年付',
        code.is_used ? '已使用' : '未使用',
        code.used_by || '',
        code.used_at ? formatDate(code.used_at) : '',
        formatDate(code.created_at)
      ].join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `兑换码_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
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
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">加载中...</p>
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">暂无兑换码</p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              <Plus className="w-5 h-5 mr-2" />
              生成兑换码
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">兑换码</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">套餐类型</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">使用者ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">使用时间</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">创建时间</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">操作</th>
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
                      <Badge variant={code.is_used ? 'error' : 'success'}>
                        {code.is_used ? '已使用' : '未使用'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {code.used_by || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {code.used_at ? formatDate(code.used_at) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{formatDate(code.created_at)}</td>
                    <td className="py-3 px-4">
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(code.id, code.code)}
                        disabled={code.is_used}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!loading && codes.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div>
            共 {totalCodes} 个兑换码，第 {currentPage} / {totalPages} 页
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

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
              onChange={(e) => setFormData({ ...formData, plan_type: e.target.value as 'monthly' | 'yearly' })}
            >
              <option value="monthly">月付套餐</option>
              <option value="yearly">年付套餐</option>
            </select>
          </div>

          <Input
            label="生成数量"
            type="number"
            placeholder="10"
            value={formData.quantity.toString()}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
          />

          <div className="flex space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              取消
            </Button>
            <Button onClick={handleGenerate} className="flex-1" disabled={loading}>
              {loading ? '生成中...' : '生成'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
