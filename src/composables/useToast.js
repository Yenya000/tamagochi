// В composables/useToast.js
import { ref } from 'vue'

const toastMessage = ref('')
const toastVisible = ref(false)
let timeout = null

export function showToast(message, duration = 2000) {
  toastMessage.value = message
  toastVisible.value = true
  
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    toastVisible.value = false
  }, duration)
}

export function useToast() {
  return {
    toastMessage,
    toastVisible,
    showToast
  }
}