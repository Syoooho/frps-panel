import { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: ReactNode
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = '确认操作',
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'danger',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const variantColors = {
    danger: 'text-red-600',
    warning: 'text-orange-600',
    info: 'text-blue-600',
  }

  const variantBg = {
    danger: 'bg-red-50',
    warning: 'bg-orange-50',
    info: 'bg-blue-50',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${variantBg[variant]} mb-4`}>
          <AlertTriangle className={`w-8 h-8 ${variantColors[variant]}`} />
        </div>
        
        <h3 className="text-xl font-bold text-primary mb-3">
          {title}
        </h3>
        
        <div className="text-slate-600 mb-6">
          {message}
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
