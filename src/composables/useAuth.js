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
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  const foundUser = allUsers.find(u => u.email === email && u.password === password)

  if (foundUser) {
    user.value = foundUser
    localStorage.setItem('tamagochi_user', JSON.stringify(foundUser))
    return true
  }
  return false
}

// Функция выхода (теперь экспортируется отдельно для TheHeader.vue)
export function logout() {
  user.value = null
  localStorage.removeItem('tamagochi_user')
  // Редирект на логин через перезагрузку или роутер
  window.location.href = '/login'
}

// Функция регистрации
export function register(email, password, username) {
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  
  // Проверка на существующий email
  if (allUsers.find(u => u.email === email)) {
    return false
  }

  // Создание нового пользователя со всеми начальными статами
  const newUser = {
    id: Date.now(),
    username: username,
    email: email,
    password: password,
    // Прогресс
    score: 0,
    treeStage: 1,
    activeDays: 0,
    // Цели
    goalDays: 0,
    goalStartDate: null,
    lastLogin: new Date().toISOString(),
    // Игровые элементы
    habits: [],
    crystals: 100, // Начальный капитал
    inventory: [],
    // Состояния тамагочи
    isWilted: false,
    isDead: false,
    isBlocked: false,
    alreadyClaimed: false,
    // Система наград
    rewards: {
      registration: true,
      marathon7: false,
      marathon30: false,
      marathon90: false
    }
  }

  // Сохраняем в общий список и в текущую сессию
  allUsers.push(newUser)
  localStorage.setItem('habit_users', JSON.stringify(allUsers))
  
  user.value = newUser
  localStorage.setItem('tamagochi_user', JSON.stringify(newUser))
  
  return true
}