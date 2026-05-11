import { ref, computed } from 'vue'

// ===== 1. СОСТОЯНИЕ ПОЛЬЗОВАТЕЛЯ =====
const user = ref(JSON.parse(localStorage.getItem('tamagochi_user') || 'null'))

export const authStore = {
  user: user,
  isLoggedIn: computed(() => !!user.value)
}

// ===== 2. ПРОВЕРКА НА АНГЛИЙСКИЕ БУКВЫ =====
function isEnglishOnly(str) {
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/.test(str)
}

// ===== 3. ГЛОБАЛЬНОЕ УВЕДОМЛЕНИЕ =====
let globalNotificationCallback = null

export function setNotificationCallback(callback) {
  globalNotificationCallback = callback
}

function showNotification(message, type = 'error') {
  if (globalNotificationCallback) {
    globalNotificationCallback(message, type)
  } else {
    console.log(message)
  }
}

// ===== 4. ФУНКЦИЯ ВХОДА =====
export function login(email, password) {
  // Проверка на английские буквы
  if (!isEnglishOnly(email) || !isEnglishOnly(password)) {
    showNotification('Email и пароль должны содержать только английские буквы, цифры и разрешённые символы!')
    return false
  }
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  
  for (let i = 0; i < allUsers.length; i++) {
    const foundUser = allUsers[i]
    
    if (foundUser.email === email && foundUser.password === password) {
      user.value = foundUser
      localStorage.setItem('tamagochi_user', JSON.stringify(foundUser))
      return true
    }
  }
  
  showNotification('Неверный логин или пароль')
  return false
}

// ===== 5. ФУНКЦИЯ ВЫХОДА =====
export function logout() {
  user.value = null
  localStorage.removeItem('tamagochi_user')
  window.location.href = '/#/login'
}

// ===== 6. ФУНКЦИЯ РЕГИСТРАЦИИ =====
export function register(email, password, username) {
  // Проверка на английские буквы
  if (!isEnglishOnly(email) || !isEnglishOnly(password)) {
    showNotification('Email и пароль должны содержать только английские буквы, цифры и разрешённые символы!')
    return false
  }
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  
  // Проверка на существующий email
  let emailExists = false
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].email === email) {
      emailExists = true
    }
  }
  
  if (emailExists) {
    showNotification('Пользователь с таким email уже существует!')
    return false
  }
  
  // Создание нового пользователя
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
  
  showNotification('Регистрация успешна!', 'success')
  return true
}