export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatPlanType = (planType: 'monthly' | 'yearly'): string => {
  return planType === 'monthly' ? '月付' : '年付'
}

export const formatTunnelType = (type: string): string => {
  return type.toUpperCase()
}

export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '活跃',
    inactive: '未激活',
    online: '在线',
    offline: '离线',
  }
  return statusMap[status] || status
}
