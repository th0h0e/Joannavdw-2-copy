/**
 * =============================================================================
 * COMPOSABLE: useAppToast
 * =============================================================================
 *
 * Wrapper around NuxtUI's useToast for consistent toast notifications
 * across the application.
 *
 * Provides:
 * - showToast(): Display a success or error toast
 * - toasts: Array of active toasts (for custom toast UI if needed)
 * - removeToast(): Manually remove a toast
 *
 * @example
 * const { showToast } = useAppToast()
 *
 * // Show success toast
 * showToast('Project saved successfully!', 'success')
 *
 * // Show error toast
 * showToast('Failed to save project', 'error')
 */

export interface Toast {
  id: string // Unique identifier (timestamp-based)
  message: string // Toast message content
  type: 'success' | 'error' // Toast type for styling
}

/**
 * Creates toast notification functionality
 *
 * Uses NuxtUI's built-in toast system under the hood,
 * with a local tracking array for potential custom UI.
 */
export function useAppToast() {
  // Access NuxtUI's toast composable
  const toast = useToast()

  // Local tracking of active toasts
  const toasts = ref<Toast[]>([])

  /**
   * Display a toast notification
   *
   * @param message - The message to display
   * @param type - 'success' (green) or 'error' (red)
   *
   * Notes:
   * - Automatically adds appropriate icon based on type
   * - Auto-dismisses after 5 seconds
   */
  const showToast = (message: string, type: 'success' | 'error') => {
    // Create toast object
    const id = Date.now().toString()
    toasts.value.push({ id,
      message,
      type })

    // Show NuxtUI toast
    toast.add({
      title: message,
      color: type === 'success' ? 'success' : 'error',
      icon: type === 'success' ? 'i-lucide-check-circle' : 'i-lucide-alert-circle',
    })

    // Auto-remove from local tracking after 5 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 5000)
  }

  /**
   * Manually remove a toast from tracking
   *
   * @param id - The toast ID to remove
   */
  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
