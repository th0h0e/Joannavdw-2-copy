export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

// eslint-disable-next-line react/no-unnecessary-use-prefix
export function useToast() {
  const toasts = ref<Toast[]>([])

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString()
    toasts.value.push({ id, message, type })

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(toast => toast.id !== id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
