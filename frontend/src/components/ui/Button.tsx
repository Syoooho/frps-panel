import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  loading?: boolean
}

export default function Button({ 
  variant = 'primary', 
  children, 
  loading = false,
  disabled,
  className = '',
  ...props 
}: ButtonProps) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  const disabledClass = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''
  
  return (
    <button
      className={`${baseClass} ${disabledClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '加载中...' : children}
    </button>
  )
}
