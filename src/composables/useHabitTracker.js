import { authStore } from './useAuth'

// Вспомогательная функция для обновления всех хранилищ
function updateDatabase() {
  const user = authStore.user.value
  
  if (user) {
    const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
    
    // Ищем пользователя по email и обновляем его в общем массиве
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].email === user.email) {
        allUsers[i] = user
      }
    }
    
    // Сохраняем и базу, и текущую сессию
    localStorage.setItem('habit_users', JSON.stringify(allUsers))
    localStorage.setItem('tamagochi_user', JSON.stringify(user))
  }
}

// 1. ПРИВЫЧКИ И КРИСТАЛЛЫ
export function completeHabit(habitName) {
  const user = authStore.user.value
  
  if (user) {
    user.habits.forEach(function(h) {
      if (h.name === habitName) {
        h.completed = !h.completed
        
        // Твоя логика: начисление/штраф кристаллов сразу
        if (h.completed === true) {
          user.crystals = user.crystals + 10
        } else {
          user.crystals = user.crystals - 10
        }
      }
    })
    updateDatabase()
  }
}

// 2. ЗАВЕРШЕНИЕ ДНЯ И РОСТ (Твоя логика сложности)
export function completeDay() {
  const user = authStore.user.value
  
  if (user) {
    user.score = (user.score || 0) + 1
    user.treeStage = Math.floor(user.score / 5) + 1
    user.activeDays = (user.activeDays || 0) + 1
    
    user.habits.forEach(function(h) {
      if (h.type === 'exercise') {
        h.daysPassed = (h.daysPassed || 0) + 1
        if (h.daysPassed >= 5 && h.minutes < 30) {
          h.minutes = h.minutes + 5
          h.daysPassed = 0
        }
      }
      if (h.type === 'reading' && h.autoIncrease === true) {
        h.daysInWeek = (h.daysInWeek || 0) + 1
        if (h.daysInWeek >= 7) {
          h.pages = h.pages + 10
          h.daysInWeek = 0
        }
      }
    })

    user.alreadyClaimed = true
    user.lastLogin = new Date().toISOString()
    updateDatabase()
  }
}

// 3. МАГАЗИН И ИНВЕНТАРЬ
export function buyItem(itemId, cost) {
  const user = authStore.user.value

  if (user) {
    if (user.crystals >= cost) {
      user.crystals = user.crystals - cost
      user.inventory.push(itemId)
      updateDatabase()
      return true
    }
  }
  return false
}

export function useWateringCan() {
  const user = authStore.user.value

  if (user) {
    const index = user.inventory.indexOf('watering_can')
    
    if (index > -1) {
      user.inventory.splice(index, 1)
      user.isWilted = false
      user.isDead = false
      user.lastLogin = new Date().toISOString()
      updateDatabase()
    }
  }
}

// 4. НАГРАДЫ (Добавил экспорт, который требует твой ShopPage)
export function claimCrystalReward(amount) {
  const user = authStore.user.value
  if (user && user.rewards) {
    if (user.rewards.registration === true) {
      user.crystals = (user.crystals || 0) + amount
      user.rewards.registration = false // Помечаем как забранную
      updateDatabase()
      return true
    }
  }
  return false
}

export function claimReward(rewardType) {
  const user = authStore.user.value
  const amounts = {
    marathon7: 50,
    marathon30: 150,
    marathon90: 300
  }

  if (user && user.rewards) {
    if (user.rewards[rewardType] === false) {
      user.crystals = user.crystals + amounts[rewardType]
      user.rewards[rewardType] = true
      updateDatabase()
    }
  }
}

// 5. ЦИКЛЫ И БЛОКИРОВКА
export function checkCycleStatus() {
  const user = authStore.user.value
  let isFinished = false

  if (user && user.goalStartDate) {
    const start = new Date(user.goalStartDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= user.goalDays) {
      isFinished = true
    }
  }

  if (isFinished) {
    user.isBlocked = true
    updateDatabase()
  }
}

export function startNewCycle(newGoal) {
  const user = authStore.user.value
  
  if (user) {
    user.goalDays = Number(newGoal)
    user.goalStartDate = new Date().toISOString()
    user.isBlocked = false
    user.alreadyClaimed = false
    
    user.habits.forEach(function(h) {
      h.completed = false
    })
    
    const rewardKey = 'marathon' + newGoal
    if (user.rewards && Object.prototype.hasOwnProperty.call(user.rewards, rewardKey)) {
      user.rewards[rewardKey] = false
    }

    updateDatabase()
  }
}