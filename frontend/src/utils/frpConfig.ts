/**
 * FRP 配置生成工具
 */
import type { Tunnel } from '../types'

/**
 * 生成 frpc 配置
 */
export function generateFrpcConfig(
  tunnel: Tunnel,
  userEmail: string,
  frpToken: string,
  serverAddr: string = '127.0.0.1',
  serverPort: number = 7000
): string {
  const lines: string[] = []
  
  // 基础配置
  lines.push('# FRP 客户端配置')
  lines.push(`# 隧道名称: ${tunnel.name}`)
  lines.push('')
  lines.push('serverAddr = "' + serverAddr + '"')
  lines.push('serverPort = ' + serverPort)
  lines.push('')
  lines.push('# 用户认证信息')
  lines.push('user = "' + userEmail + '"')
  lines.push('')
  lines.push('[metadatas]')
  lines.push('token = "' + frpToken + '"')
  lines.push('')
  
  // 隧道配置
  lines.push('# 隧道配置')
  lines.push('[[proxies]]')
  lines.push('name = "' + tunnel.name + '"')
  lines.push('type = "' + tunnel.type + '"')
  lines.push('localIP = "' + tunnel.local_ip + '"')
  lines.push('localPort = ' + tunnel.local_port)
  
  // 根据类型添加额外配置
  if (tunnel.type === 'tcp' || tunnel.type === 'udp') {
    if (tunnel.remote_port) {
      lines.push('remotePort = ' + tunnel.remote_port)
    }
  } else if (tunnel.type === 'http' || tunnel.type === 'https') {
    if (tunnel.custom_domain) {
      lines.push('customDomains = ["' + tunnel.custom_domain + '"]')
    }
    if (tunnel.subdomain) {
      lines.push('subdomain = "' + tunnel.subdomain + '"')
    }
  }
  
  lines.push('')
  lines.push('# 注意: TCP/UDP 隧道需要在服务器端分配远程端口')
  
  return lines.join('\n')
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}
