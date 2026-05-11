import { ref, computed } from 'vue'

// Реактивная переменная пользователя, синхронизированная с localStorage
const user = ref(JSON.parse(localStorage.getItem('tamagochi_user') || 'null'))

// Основной стор для проверки состояния
export const authStore = {
  user: user,
  isLoggedIn: computed(() => !!user.value)
}

// Функция входа
export function login(email, password) {
  let loginSuccess = false
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  
  for (let i = 0; i < allUsers.length; i++) {
    const foundUser = allUsers[i]
    
    if (foundUser.email === email && foundUser.password === password) {
      user.value = foundUser
      localStorage.setItem('tamagochi_user', JSON.stringify(foundUser))
      loginSuccess = true
    }
  }
  
  return loginSuccess
}

// Функция выхода
export function logout() {
  user.value = null
  localStorage.removeItem('tamagochi_user')
  window.location.href = '/login'
}

// Функция регистрации
export function register(email, password, username) {
  let registerSuccess = false
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  
  // Проверка на существующий email
  let emailExists = false
  
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].email === email) {
      emailExists = true
    }
  }
  
  // Если email не существует - регистрируем
  if (!emailExists) {
    const newUser = {
      id: Date.now(),
      username: username,
      email: email,
      password: password,
      score: 0,
      treeStage: 1,
      activeDays: 0,
      goalDays: 0,
      goalStartDate: null,
      lastLogin: new Date().toISOString(),
      habits: [],
      crystals: 100,
      inventory: [],
      isWilted: false,
      isDead: false,
      isBlocked: false,
      alreadyClaimed: false,
      isCycleCompleted: false,
      rewards: {
        registration: true,
        marathon1: false,
        marathon7: false,
        marathon30: false,
        marathon90: false
      }
    }

    allUsers.push(newUser)
    localStorage.setItem('habit_users', JSON.stringify(allUsers))
    
    user.value = newUser
    localStorage.setItem('tamagochi_user', JSON.stringify(newUser))
    
    registerSuccess = true
  }
  
  return registerSuccess
}