export interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

export function useAppToast() {
  const toast = useToast()
  const toasts = ref<Toast[]>([])

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now().toString()
    toasts.value.push({ id, message, type })

    // Use Nuxt UI toast
    toast.add({
      title: message,
      color: type === 'success' ? 'success' : 'error',
      icon: type === 'success' ? 'i-lucide-check-circle' : 'i-lucide-alert-circle',
    })

    // Auto-dismiss from local tracking after 5 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
