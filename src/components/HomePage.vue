<template>
  <div class="home-container">
    <div class="status-panel">
      <div class="stat-block">
        <span class="label">Выполнено сегодня</span>
        <span class="value">{{ completedToday }} / {{ habits.length }}</span>
      </div>
      <div class="stat-block">
        <span class="label">Кристаллы</span>
        <span class="value">💎 {{ user?.crystals || 0 }}</span>
      </div>
    </div>

    <!-- Уведомление -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>

    <!-- Прогресс цикла -->
    <div v-if="cycleProgress.totalDays > 0 && !user?.isDead" class="cycle-progress">
      <div class="progress-header">
        <span class="progress-label">
          Цикл: день {{ cycleProgress.currentDay }} из {{ cycleProgress.totalDays }}
        </span>
        <span class="progress-percent">{{ cycleProgress.progress }}%</span>
      </div>
      <div class="progress-bar-bg">
        <div 
          class="progress-bar-fill" 
          :style="{ width: cycleProgress.progress + '%' }"
        ></div>
      </div>
    </div>

    <div class="tree-zone" :class="{ 'wilted-border': user?.isWilted }">
      <div class="visual-container">
        <span class="tree-emoji">{{ treeEmoji }}</span>
      </div>
      
      <div class="tree-message">{{ treeMessage }}</div>
      
      <div 
        v-if="allHabitsDone && !user?.isWilted && !user?.isDead" 
        class="congratulations-card"
      >
        <span class="stars">✨</span>
        <p>Все цели выполнены! Дерево сияет!</p>
      </div>

      <div v-if="user?.isWilted && !user?.isDead" class="wilt-warning">
        <p class="warning-title">⚠️ Дерево увяло!</p>
        <p class="warning-text">Вы пропустили день. Полейте его сейчас, чтобы продолжить.</p>
        
        <button 
          v-if="hasWateringCan" 
          @click="handleWatering" 
          class="use-item-btn"
        >
          💧 Использовать лейку
        </button>
        
        <div v-else class="dead-tree-actions">
          <p class="no-can-text">У вас нет лейки...</p>
          <router-link to="/shop" class="buy-link">Купить в магазине</router-link>
        </div>
      </div>

      <div v-if="user?.isDead" class="dead-warning">
        <p class="warning-title">💀 Дерево погибло</p>
        <p class="warning-text">Вы пропустили 2 дня подряд</p>
        <button @click="resetAndRestart" class="reset-btn">Посадить новое дерево</button>
      </div>
    </div>

    <div v-if="!user?.isDead" class="habits-section">
      <h3 class="section-title">Задания на сегодня</h3>
      <div class="habits-list">
        <div 
          v-for="habit in habits" 
          :key="habit.name"
          class="habit-card"
          :class="{ 'completed-card': habit.completed }"
        >
          <div class="habit-info">
            <span class="habit-name">{{ habit.name }}</span>
            <span class="habit-target">
              <template v-if="habit.type === 'reading'">
                {{ habit.pages }} стр.
              </template>
              <template v-else-if="habit.type === 'exercise'">
                {{ habit.minutes }} мин.
              </template>
              <template v-else-if="habit.type === 'other'">
                {{ habit.targetValue }} {{ habit.unit }}
              </template>
              <template v-else>
                {{ habit.amount }} {{ habit.unit }}
              </template>
            </span>
          </div>
          <button 
            class="check-btn" 
            @click="handleToggle(habit.name)"
            :disabled="user?.isWilted || user?.isDead"
          >
            {{ habit.completed ? '✅' : '🔘' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!user?.isDead" class="actions-grid">
      <router-link to="/shop" class="nav-btn">
        🛒 Магазин
      </router-link>
      <router-link to="/select-habit" class="nav-btn">
        ⚙️ Настройки
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../composables/useAuth'
import { 
  completeHabit, 
  useWateringCan, 
  checkCycleStatus, 
  completeDay,
  getCycleProgress,
  checkCycleCompletion,
  resetAfterCycle
} from '../composables/useHabitTracker'

const router = useRouter()
const user = authStore.user

// ===== 1. УВЕДОМЛЕНИЯ (замена alert) =====
const notification = ref({ show: false, message: '', type: '' })

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 2000)
}

// ===== 2. ВЫЧИСЛЯЕМЫЕ ДАННЫЕ =====
const habits = computed(() => user.value?.habits || [])
const completedToday = computed(() => habits.value.filter(h => h.completed).length)
const allHabitsDone = computed(() => {
  return habits.value.length > 0 && completedToday.value === habits.value.length
})

// ===== 3. ПРОГРЕСС ЦИКЛА =====
const cycleProgress = ref({ currentDay: 0, totalDays: 0, progress: 0 })
let cycleCompletedFlag = false

// ===== 4. ПРОВЕРКА НАЛИЧИЯ ЛЕЙКИ =====
const hasWateringCan = computed(() => {
  return user.value?.inventory?.includes('watering_can')
})

// ===== 5. ЭМОДЗИ ДЕРЕВА =====
const treeEmoji = computed(() => {
  let emoji = '🌱'
  
  if (user.value?.isDead) {
    emoji = '💀'
  }
  else if (user.value?.isWilted) {
    emoji = '🥀'
  }
  else {
    const stages = ['🌱', '🌿', '🌳', '🌲', '🌸']
    const stageIndex = (user.value?.treeStage || 1) - 1
    emoji = stages[stageIndex] || '🌱'
  }
  
  return emoji
})

// ===== 6. СООБЩЕНИЕ ДЕРЕВА =====
const treeMessage = computed(() => {
  let message = '🌱 Продолжай выполнять привычки!'
  
  if (user.value?.isDead) {
    message = '💀 Дерево погибло... Посади новое'
  }
  else if (user.value?.isWilted) {
    message = '🥀 Дерево увяло... Нужно полить!'
  }
  else if (allHabitsDone.value) {
    message = '✨ Дерево счастливо! ✨'
  }
  
  return message
})

// ===== 7. СОХРАНЕНИЕ ПОЛЬЗОВАТЕЛЯ =====
function saveUser() {
  if (!user.value) return
  
  localStorage.setItem('tamagochi_user', JSON.stringify(user.value))
  
  const allUsers = JSON.parse(localStorage.getItem('habit_users') || '[]')
  const index = allUsers.findIndex(u => u.email === user.value.email)
  
  if (index !== -1) {
    allUsers[index] = user.value
    localStorage.setItem('habit_users', JSON.stringify(allUsers))
  }
}

// ===== 8. ОБНОВЛЕНИЕ ПРОГРЕССА ЦИКЛА =====
function updateCycleProgress() {
  cycleProgress.value = getCycleProgress()
  
  const completion = checkCycleCompletion()
  
  if (completion.isCompleted && !cycleCompletedFlag) {
    cycleCompletedFlag = true
    showNotification(`🎉 Цикл завершён! Получено ${completion.rewardAmount} кристаллов!`, 'success')
    
    setTimeout(() => {
      showNotification('Начните новый цикл!', 'info')
      resetAfterCycle()
      router.push('/select-habit')
    }, 2000)
  }
}

// ===== 9. ПРОВЕРКА НОВОГО ДНЯ =====
function checkNewDay() {
  let needUpdate = false
  let daysPassed = 0
  
  if (!user.value) {
    return false
  }
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const lastLogin = user.value.lastLogin ? new Date(user.value.lastLogin) : null
  
  if (!lastLogin) {
    user.value.lastLogin = today.toISOString()
    saveUser()
    return false
  }
  
  lastLogin.setHours(0, 0, 0, 0)
  
  daysPassed = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24))
  
  if (daysPassed !== 0) {
    needUpdate = true
    
    // Сброс привычек на новый день
    if (user.value.habits) {
      user.value.habits.forEach(h => {
        h.completed = false
      })
    }
    
    // Логика увядания/смерти
    if (daysPassed === 1) {
      if (!user.value.isDead) {
        user.value.isWilted = true
      }
    }
    else if (daysPassed >= 2) {
      user.value.isWilted = false
      user.value.isDead = true
    }
    
    user.value.lastLogin = today.toISOString()
  }
  
  if (needUpdate) {
    saveUser()
  }
  
  return daysPassed > 0
}

// ===== 10. ОТМЕТКА ПРИВЫЧКИ =====
// ВАЖНО: за каждую привычку начисляется 10 кристаллов (в completeHabit)
const handleToggle = (habitName) => {
  let errorMessage = ''
  
  if (!user.value) {
    errorMessage = 'Пользователь не найден'
  }
  else if (user.value.isDead) {
    errorMessage = 'Дерево погибло. Посади новое дерево!'
  }
  else if (user.value.isWilted) {
    errorMessage = 'Дерево увяло! Используй лейку из магазина.'
  }
  else {
    completeHabit(habitName)  // Здесь начисляются +10 за каждую привычку
    
    if (allHabitsDone.value) {
      completeDay()  // Здесь НЕТ начисления кристаллов, только рост дерева
      updateCycleProgress()
      // Показываем общее количество кристаллов, а не "10"
      showNotification(`🎉 Все привычки выполнены! Дерево подросло! Всего кристаллов: ${user.value.crystals}`, 'success')
    }
  }
  
  if (errorMessage !== '') {
    showNotification(errorMessage, 'error')
  }
}

// ===== 11. ПОЛИВ ДЕРЕВА =====
const handleWatering = () => {
  if (!user.value) {
    showNotification('Пользователь не найден', 'error')
  }
  else if (!hasWateringCan.value) {
    showNotification('У вас нет лейки! Купите в магазине.', 'error')
  }
  else {
    useWateringCan()
    user.value.isWilted = false
    user.value.lastLogin = new Date().toISOString()
    
    if (user.value.habits) {
      user.value.habits.forEach(h => {
        h.completed = false
      })
    }
    
    saveUser()
    showNotification('🌿 Дерево ожило! Продолжайте выполнять привычки!', 'success')
  }
}

// ===== 12. СБРОС И ПЕРЕЗАПУСК ПОСЛЕ СМЕРТИ =====
const resetAndRestart = () => {
  if (!user.value) return
  
  user.value.isWilted = false
  user.value.isDead = false
  user.value.score = 0
  user.value.treeStage = 1
  user.value.lastLogin = new Date().toISOString()
  
  saveUser()
  router.push('/select-habit')
}

// ===== 13. ЖИЗНЕННЫЙ ЦИКЛ =====
onMounted(() => {
  if (!user.value) {
    router.push('/login')
    return
  }
  
  // Проверка смерти при загрузке
  const lastLogin = user.value.lastLogin ? new Date(user.value.lastLogin) : null
  const today = new Date()
  
  if (lastLogin) {
    const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24))
    
    if (diffDays >= 2 && !user.value.isDead) {
      user.value.isDead = true
      user.value.isWilted = false
      saveUser()
    }
    else if (diffDays === 1 && !user.value.isWilted && !user.value.isDead) {
      user.value.isWilted = true
      saveUser()
    }
  }
  
  // Если нет привычек - на выбор целей
  let hasNoHabits = false
  
  if (!user.value.habits || user.value.habits.length === 0) {
    hasNoHabits = true
  }
  
  if (!user.value.isDead && hasNoHabits) {
    router.push('/select-habit')
  }
  else if (!user.value.isDead) {
    checkNewDay()
    checkCycleStatus()
    updateCycleProgress()
  }
})
</script>

<style scoped>
/* ... твои стили ... */
.home-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: var(--bg-color, #000);
  min-height: 100vh;
  color: var(--text-main, #fff);
}

.status-panel {
  display: flex;
  justify-content: space-between;
  background-color: var(--card-bg, #0a0a0a);
  padding: 20px 30px;
  border-radius: 24px;
  border: 1px solid var(--border-color, #1a1a1a);
  margin-bottom: 30px;
}

.stat-block {
  text-align: center;
}

.label {
  color: var(--text-secondary, #555);
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 800;
  display: block;
}

.value {
  color: var(--accent-color, #34c759);
  font-size: 1.3rem;
  font-weight: 900;
}

.cycle-progress {
  background-color: var(--card-bg, #0a0a0a);
  padding: 15px 20px;
  border-radius: 16px;
  border: 1px solid var(--border-color, #1a1a1a);
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 0.8rem;
  color: var(--text-secondary, #888);
}

.progress-percent {
  font-size: 0.8rem;
  color: var(--accent-color, #34c759);
  font-weight: 700;
}

.progress-bar-bg {
  background-color: var(--border-color, #1a1a1a);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  background-color: var(--accent-color, #34c759);
  border-radius: 10px;
  height: 100%;
  transition: width 0.3s ease;
}

.tree-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: var(--card-bg, #0a0a0a);
  border-radius: 32px;
  border: 1px solid var(--border-color, #1a1a1a);
  margin-bottom: 30px;
  position: relative;
}

.wilted-border {
  border-color: #ff3b30;
}

.tree-emoji {
  font-size: 7rem;
  margin-bottom: 10px;
}

.tree-message {
  font-weight: 700;
  color: var(--text-secondary, #888);
}

.congratulations-card {
  margin-top: 20px;
  padding: 15px 25px;
  background: rgba(52, 199, 89, 0.1);
  border-radius: 20px;
  border: 1px solid var(--accent-color, #34c759);
  text-align: center;
}

.wilt-warning {
  text-align: center;
  margin-top: 20px;
}

.dead-warning {
  text-align: center;
  margin-top: 20px;
}

.warning-title {
  color: #ff3b30;
  font-weight: 800;
}

.warning-text {
  color: var(--text-secondary, #888);
}

.use-item-btn {
  background-color: #007aff;
  color: #fff;
  border: none;
  padding: 15px 30px;
  border-radius: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
}

.habits-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-secondary, #444);
  margin-bottom: 15px;
  font-weight: 800;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.habit-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card-bg, #0a0a0a);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--border-color, #1a1a1a);
}

.completed-card {
  border-color: var(--accent-color, #34c759);
  opacity: 0.8;
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.habit-name {
  font-weight: 700;
  color: var(--text-main, #fff);
}

.habit-target {
  font-size: 0.8rem;
  color: var(--accent-color, #34c759);
  font-weight: 600;
}

.check-btn {
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
}

.check-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.nav-btn {
  padding: 15px;
  text-align: center;
  background-color: var(--card-bg, #1a1a1a);
  border-radius: 14px;
  text-decoration: none;
  color: var(--text-main, #fff);
  border: 1px solid var(--border-color, #333);
  font-weight: 700;
}

.buy-link {
  color: #007aff;
  text-decoration: none;
  display: block;
  margin-top: 10px;
}

.reset-btn {
  background-color: #ff3b30;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 12px;
  margin-top: 15px;
  cursor: pointer;
}

.no-can-text {
  color: var(--text-secondary, #888);
}

.notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 30px;
  background-color: var(--card-bg, #1a1a1a);
  color: var(--text-main, #fff);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

.notification.success {
  background-color: #34c759;
  color: white;
}

.notification.error {
  background-color: #ff3b30;
  color: white;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>