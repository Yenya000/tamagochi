import { ref, computed } from 'vue'

// ===== СОСТОЯНИЕ =====
const user = ref(JSON.parse(localStorage.getItem('tamagochi_user') || 'null'))
const notificationMessage = ref('')
const notificationType = ref('error')

export const authStore = {
  user: user,
  isLoggedIn: computed(() => !!user.value),
  notificationMessage: notificationMessage,
  notificationType: notificationType
}

// ===== ПРОВЕРКА НА ОТСУТСТВИЕ РУССКИХ БУКВ =====
function hasNoRussianLetters(str) {
  return !/[а-яА-ЯёЁ]/.test(str)
}

// ===== ПОКАЗ УВЕДОМЛЕНИЯ =====
function showNotification(message, type = 'error') {
  notificationMessage.value = message
  notificationType.value = type
  setTimeout(() => {
    notificationMessage.value = ''
  }, 3000)
}

// ===== ВАЛИДАЦИЯ =====
export function validateEmail(email) {
  if (!email) return 'Введите email'
  if (!hasNoRussianLetters(email)) return 'Email не должен содержать русские буквы'
  if (!email.includes('@')) return 'Введите корректный email'
  if (email.length < 5) return 'Email слишком короткий'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Введите пароль'
  if (!hasNoRussianLetters(password)) return 'Пароль не должен содержать русские буквы'
  if (password.length < 4) return 'Пароль должен быть не менее 4 символов'
  return ''
}

export function validateUsername(username) {
  if (!username) return 'Введите имя'
  if (!/^[А-ЯЁ][а-яё]+$/.test(username)) return 'Имя должно быть на русском, с большой буквы'
  return ''
}

// ===== ВХОД =====
export function login(email, password) {
  const emailError = validateEmail(email)
  const passError = validatePassword(password)
  
  if (emailError) {
    showNotification(emailError)
    return false
  }
  if (passError) {
    showNotification(passError)
    return false
  }
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  const foundUser = allUsers.find(u => u.email === email && u.password === password)
  
  if (foundUser) {
    user.value = foundUser
    localStorage.setItem('tamagochi_user', JSON.stringify(foundUser))
    showNotification('Вход выполнен успешно!', 'success')
    return true
  }
  
  showNotification('Неверный email или пароль')
  return false
}

// ===== РЕГИСТРАЦИЯ =====
export function register(email, password, username) {
  const emailError = validateEmail(email)
  const passError = validatePassword(password)
  const nameError = validateUsername(username)
  
  if (emailError) {
    showNotification(emailError)
    return false
  }
  if (passError) {
    showNotification(passError)
    return false
  }
  if (nameError) {
    showNotification(nameError)
    return false
  }
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  const userExists = allUsers.some(u => u.email === email)
  
  if (userExists) {
    showNotification('Пользователь с таким email уже существует!')
    return false
  }
  
  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    password: password,
    score: 0,
    treeStage: 1,
    activeDays: 0,
    missedDays: 0,
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

// ===== ВЫХОД (ИСПРАВЛЕН) =====
export function logout() {
  user.value = null
  localStorage.removeItem('tamagochi_user')
}