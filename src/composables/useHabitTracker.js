import { ref } from 'vue'

// --- Данные пользователей ---
const users = ref([])
export const currentUser = ref(null)

// Загрузка из localStorage
function loadData() {
  const storedUsers = localStorage.getItem('habit_users')
  if (storedUsers) {
    users.value = JSON.parse(storedUsers)
  }
  const storedUser = localStorage.getItem('currentUser')
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser)
  }
}

// Сохранение
function saveData() {
  localStorage.setItem('habit_users', JSON.stringify(users.value))
  if (currentUser.value) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  } else {
    localStorage.removeItem('currentUser')
  }
}

loadData()

// --- Регистрация ---
export function register(username, email, password, habits, goalDays) {
  const exists = users.value.find(u => u.email === email)
  if (exists) return false

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    goalDays: Number(goalDays),
    habits: habits.map(h => ({ name: h, completed: false, streak: 0 })),
    coins: 100,
    currentStreak: 0,
    lastActivityDate: null,
    treeStage: 1,
    isWilted: false,
    inventory: { wateringCan: false }
  }

  users.value.push(newUser)
  saveData()
  return true
}

// --- Логин ---
export function login(email, password) {
  const user = users.value.find(u => u.email === email && u.password === password)
  if (user) {
    currentUser.value = { ...user }
    saveData()
    return true
  }
  return false
}

// --- Выход ---
export function logout() {
  currentUser.value = null
  saveData()
}

// --- Вспомогательная функция обновления ---
function updateUserAndSave(callback) {
  if (!currentUser.value) return
  const idx = users.value.findIndex(u => u.id === currentUser.value.id)
  if (idx !== -1) {
    callback(users.value[idx])
    currentUser.value = { ...users.value[idx] }
    saveData()
  }
}

// --- Обновление стадии дерева по стрику ---
function updateTreeStage(user) {
  const streak = user.currentStreak
  if (streak >= 30) user.treeStage = 4
  else if (streak >= 15) user.treeStage = 3
  else if (streak >= 5) user.treeStage = 2
  else user.treeStage = 1
  
  // Если есть стрик и дерево увяло — восстанавливаем
  if (user.isWilted && streak > 0) {
    user.isWilted = false
  }
}

// --- Проверка дня и сброс ---
export function checkDailyReset() {
  updateUserAndSave(user => {
    const today = new Date().toDateString()
    const last = user.lastActivityDate
    
    if (last !== today) {
      // Проверяем, были ли все задачи выполнены вчера
      if (last) {
        const allDoneBefore = user.habits.every(h => h.completed === true)
        if (allDoneBefore) {
          // Все задачи выполнены вчера → увеличиваем стрик
          user.currentStreak += 1
          updateTreeStage(user)
        } else {
          // Был пропуск → сбрасываем стрик и дерево увядает
          if (user.currentStreak > 0) {
            user.isWilted = true
          }
          user.currentStreak = 0
          updateTreeStage(user)
        }
      }
      
      // Сбрасываем чекбоксы на сегодня
      user.habits.forEach(h => h.completed = false)
      user.lastActivityDate = today
    }
  })
}

// --- Выполнить привычку ---
export function completeHabit(habitIndex) {
  updateUserAndSave(user => {
    const habit = user.habits[habitIndex]
    if (!habit.completed) {
      habit.completed = true
      habit.streak += 1
      user.coins += 10
      
      // Проверяем, все ли привычки выполнены СЕГОДНЯ
      const allDoneToday = user.habits.every(h => h.completed === true)
      
      // Если все выполнены сегодня — увеличиваем стрик сразу
      if (allDoneToday) {
        user.currentStreak += 1
        updateTreeStage(user)
        user.isWilted = false
      }
    }
  })
}

// --- Купить лейку ---
export function buyItem(itemId) {
  if (itemId === 'wateringCan') {
    updateUserAndSave(user => {
      if (user.coins >= 50 && !user.inventory.wateringCan) {
        user.coins -= 50
        user.inventory.wateringCan = true
      }
    })
    return true
  }
  return false
}

// --- Использовать лейку ---
export function useWateringCan() {
  updateUserAndSave(user => {
    if (user.inventory.wateringCan && user.isWilted) {
      user.isWilted = false
      // Восстанавливаем стрик до 1 (или оставляем как есть)
      if (user.currentStreak === 0) {
        user.currentStreak = 1
        updateTreeStage(user)
      }
    }
  })
}

// --- Хук для компонентов ---
export function useHabitTracker() {
  return {
    currentUser,
    register,
    login,
    logout,
    checkDailyReset,
    completeHabit,
    buyItem,
    useWateringCan
  }
}