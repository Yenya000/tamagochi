import { authStore } from './useAuth'

// Вспомогательная функция для обновления всех хранилищ
export function updateDatabase() {
  const user = authStore.user.value
  
  if (user) {
    const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
    
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].email === user.email) {
        allUsers[i] = user
      }
    }
    
    localStorage.setItem('habit_users', JSON.stringify(allUsers))
    localStorage.setItem('tamagochi_user', JSON.stringify(user))
  }
}

// 1. ПРИВЫЧКИ И КРИСТАЛЛЫ
export function completeHabit(habitName) {
  let habitFound = false
  let actionDone = false
  
  const user = authStore.user.value
  
  if (user) {
    for (let i = 0; i < user.habits.length; i++) {
      const h = user.habits[i]
      
      if (h.name === habitName) {
        habitFound = true
        h.completed = !h.completed
        
        if (h.completed === true) {
          user.crystals = user.crystals + 10
          actionDone = true
        } else {
          user.crystals = user.crystals - 10
          actionDone = true
        }
      }
    }
    
    if (habitFound && actionDone) {
      updateDatabase()
    }
  }
}

// 2. ЗАВЕРШЕНИЕ ДНЯ И РОСТ
export function completeDay() {
  let needUpdate = false
  
  const user = authStore.user.value
  
  if (user) {
    user.score = (user.score || 0) + 1
    user.treeStage = Math.floor(user.score / 5) + 1
    user.activeDays = (user.activeDays || 0) + 1
    needUpdate = true
    
    for (let i = 0; i < user.habits.length; i++) {
      const h = user.habits[i]
      
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
    }

    user.alreadyClaimed = true
    user.lastLogin = new Date().toISOString()
    
    if (needUpdate) {
      updateDatabase()
    }
  }
}

// 3. МАГАЗИН И ИНВЕНТАРЬ
export function buyItem(itemId, cost) {
  let buySuccess = false
  
  const user = authStore.user.value

  if (user) {
    if (user.crystals >= cost) {
      user.crystals = user.crystals - cost
      user.inventory.push(itemId)
      updateDatabase()
      buySuccess = true
    }
  }
  
  return buySuccess
}

export function useWateringCan() {
  let useSuccess = false
  
  const user = authStore.user.value

  if (user) {
    const index = user.inventory.indexOf('watering_can')
    
    if (index > -1) {
      user.inventory.splice(index, 1)
      user.isWilted = false
      user.isDead = false
      user.lastLogin = new Date().toISOString()
      
      if (user.habits) {
        for (let i = 0; i < user.habits.length; i++) {
          user.habits[i].completed = false
        }
      }
      
      updateDatabase()
      useSuccess = true
    }
  }
  
  return useSuccess
}

// 4. НАГРАДЫ
export function claimCrystalReward(amount) {
  let claimSuccess = false
  
  const user = authStore.user.value
  
  if (user && user.rewards) {
    if (user.rewards.registration === true) {
      user.crystals = (user.crystals || 0) + amount
      user.rewards.registration = false
      updateDatabase()
      claimSuccess = true
    }
  }
  
  return claimSuccess
}

export function claimReward(rewardType) {
  let claimSuccess = false
  
  const user = authStore.user.value
  const amounts = {
    marathon1: 10,
    marathon7: 50,
    marathon30: 150,
    marathon90: 300
  }

  if (user && user.rewards) {
    if (user.rewards[rewardType] === false) {
      user.crystals = user.crystals + amounts[rewardType]
      user.rewards[rewardType] = true
      updateDatabase()
      claimSuccess = true
    }
  }
  
  return claimSuccess
}

// 5. ЦИКЛЫ И БЛОКИРОВКА
export function checkCycleStatus() {
  let isFinished = false
  let needUpdate = false
  
  const user = authStore.user.value

  if (user && user.goalStartDate) {
    const start = new Date(user.goalStartDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= user.goalDays) {
      isFinished = true
    }
  }

  if (isFinished && user && !user.isBlocked) {
    user.isBlocked = true
    needUpdate = true
  }
  
  if (needUpdate) {
    updateDatabase()
  }
}

export function startNewCycle(newGoal) {
  let needUpdate = false
  
  const user = authStore.user.value
  
  if (user) {
    user.goalDays = Number(newGoal)
    user.goalStartDate = new Date().toISOString()
    user.isBlocked = false
    user.alreadyClaimed = false
    user.isCycleCompleted = false
    needUpdate = true
    
    if (user.habits) {
      for (let i = 0; i < user.habits.length; i++) {
        user.habits[i].completed = false
      }
    }
    
    const rewardKey = 'marathon' + newGoal
    if (user.rewards && Object.prototype.hasOwnProperty.call(user.rewards, rewardKey)) {
      user.rewards[rewardKey] = false
    }

    if (needUpdate) {
      updateDatabase()
    }
  }
}

// 6. СБРОС ЕЖЕДНЕВНЫХ ПРИВЫЧЕК
export function resetDailyHabits() {
  let needUpdate = false
  
  const user = authStore.user.value
  
  if (user && user.habits) {
    for (let i = 0; i < user.habits.length; i++) {
      user.habits[i].completed = false
      needUpdate = true
    }
  }
  
  if (needUpdate) {
    updateDatabase()
  }
}

// 7. ОТСЛЕЖИВАНИЕ ДНЕЙ ЦИКЛА
export function getCycleProgress() {
  let currentDay = 0
  let totalDays = 0
  let progress = 0
  
  const user = authStore.user.value
  
  if (user && user.goalStartDate && user.goalDays) {
    const start = new Date(user.goalStartDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    totalDays = user.goalDays
    currentDay = Math.min(daysPassed + 1, totalDays)
    progress = Math.floor((currentDay / totalDays) * 100)
  }
  
  return {
    currentDay: currentDay,
    totalDays: totalDays,
    progress: progress
  }
}

// 8. ПРОВЕРКА ЗАВЕРШЕНИЯ ЦИКЛА И ВЫДАЧА НАГРАДЫ
export function checkCycleCompletion() {
  let isCompleted = false
  let rewardAmount = 0
  
  const user = authStore.user.value
  
  if (user && user.goalStartDate && user.goalDays && !user.isCycleCompleted) {
    const start = new Date(user.goalStartDate)
    const today = new Date()
    const diffTime = today - start
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (daysPassed >= user.goalDays) {
      isCompleted = true
      
      if (user.goalDays === 1) {
        rewardAmount = 10
      } else if (user.goalDays === 7) {
        rewardAmount = 50
      } else if (user.goalDays === 30) {
        rewardAmount = 150
      } else if (user.goalDays === 90) {
        rewardAmount = 300
      }
      
      user.crystals = (user.crystals || 0) + rewardAmount
      user.isCycleCompleted = true
      user.isBlocked = true
      
      const rewardKey = 'marathon' + user.goalDays
      if (user.rewards) {
        user.rewards[rewardKey] = true
      }
      
      updateDatabase()
    }
  }
  
  return {
    isCompleted: isCompleted,
    rewardAmount: rewardAmount
  }
}

// 9. СБРОС ПОСЛЕ ЦИКЛА
export function resetAfterCycle() {
  const user = authStore.user.value
  
  if (user) {
    user.isCycleCompleted = false
    user.isBlocked = false
    user.goalDays = 0
    user.goalStartDate = null
    user.habits = []
    user.score = 0
    user.treeStage = 1
    user.activeDays = 0
    user.isWilted = false
    user.isDead = false
    user.alreadyClaimed = false
    updateDatabase()
  }
}

// 10. СБРОС МЕРТВОГО ДЕРЕВА
export function resetDeadTree() {
  const user = authStore.user.value
  
  if (user) {
    user.isWilted = false
    user.isDead = false
    user.score = 0
    user.treeStage = 1
    user.lastLogin = new Date().toISOString()
    updateDatabase()
  }
}