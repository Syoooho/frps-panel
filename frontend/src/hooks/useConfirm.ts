import { useState, useCallback } from 'react'

interface ConfirmOptions {
  title: string
  message: string
  onConfirm: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
}

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts)
    setIsOpen(true)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (options?.onConfirm) {
      await options.onConfirm()
    }
    setIsOpen(false)
  }, [options])

  const handleCancel = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
