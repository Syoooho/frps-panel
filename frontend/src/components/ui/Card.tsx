import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export default function Card({ children, className = '', onClick, hoverable = true }: CardProps) {
  const hoverClass = hoverable ? 'card' : 'bg-white rounded-xl p-6 shadow-md'
  
  return (
    <div 
      className={`${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
