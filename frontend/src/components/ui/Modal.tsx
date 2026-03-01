import { ReactNode, useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 200)
      document.body.style.overflow = 'unset'
      return () => clearTimeout(timer)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen && !isAnimating) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        isOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={onClose}
      style={{ 
        animation: isOpen ? 'fadeIn 200ms ease-out' : 'fadeOut 200ms ease-in',
      }}
    >
      <div 
        className={`bg-white rounded-2xl p-6 sm:p-8 shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto transition-all duration-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          animation: isOpen ? 'slideUp 200ms ease-out' : 'slideDown 200ms ease-in',
        }}
      >
        <div className="flex items-start justify-between mb-6">
          {title && (
            <h2 className="text-xl sm:text-2xl font-bold text-primary pr-8">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-auto"
            aria-label="关闭"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}
