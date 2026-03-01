interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export const Card = ({ title, children, className = '', actions }: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
