import { ref, computed } from 'vue'

const currentUser = ref(null)

function loadCurrentUser() {
  const saved = localStorage.getItem('tamagochi_user')
  if (saved) {
    currentUser.value = JSON.parse(saved)
  }
}

function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem('tamagochi_user', JSON.stringify(user))
    currentUser.value = user
  } else {
    localStorage.removeItem('tamagochi_user')
    currentUser.value = null
  }
}

export function useAuth() {
  function login(email, password) {
    // Упрощенная логика для прототипа
    const user = { email, name: email.split('@')[0], id: Date.now() }
    saveCurrentUser(user)
    return { success: true }
  }

  function register(email, password, name) {
    const newUser = { email, name, id: Date.now() }
    saveCurrentUser(newUser)
    return { success: true }
  }

  function logout() {
    saveCurrentUser(null)
  }

  const isAuthenticated = computed(function() {
    return currentUser.value !== null
  })

  loadCurrentUser()

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout
  }
}