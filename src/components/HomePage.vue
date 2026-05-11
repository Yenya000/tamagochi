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

    <div class="tree-zone" :class="{ 'wilted-border': user?.isWilted }">
      <div class="visual-container">
        <span class="tree-emoji">{{ treeEmoji }}</span>
      </div>
      
      <div class="tree-message">{{ treeMessage }}</div>
      
      <div v-if="allHabitsDone && !user?.isWilted" class="congratulations-card">
        <span class="stars">✨</span>
        <p>Все цели выполнены! Дерево сияет!</p>
      </div>

      <div v-if="user?.isWilted" class="wilt-warning">
        <p class="warning-title">⚠️ Дерево увяло!</p>
        <p class="warning-text">Вы пропустили день. Полейте его сейчас, чтобы сохранить прогресс.</p>
        
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
          <button @click="resetGame" class="reset-btn">Посадить новое дерево</button>
        </div>
      </div>
    </div>

    <div class="habits-section">
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
              <template v-if="habit.type === 'reading'">{{ habit.pages }} стр.</template>
              <template v-else-if="habit.type === 'exercise'">{{ habit.minutes }} мин.</template>
              <template v-else>{{ habit.amount }} {{ habit.unit }}</template>
            </span>
          </div>
          <button class="check-btn" @click="handleToggle(habit.name)">
            {{ habit.completed ? '✅' : '🔘' }}
          </button>
        </div>
      </div>
    </div>

    <div class="actions-grid">
      <router-link to="/shop" class="nav-btn secondary">🛒 Магазин</router-link>
      <router-link to="/select-habit" class="nav-btn secondary">⚙️ Настройки</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../composables/useAuth'
import { completeHabit, useWateringCan, checkCycleStatus } from '../composables/useHabitTracker'

const router = useRouter()
const user = authStore.user

// Вычисляемые данные
const habits = computed(() => user.value?.habits || [])
const completedToday = computed(() => habits.value.filter(h => h.completed).length)
const allHabitsDone = computed(() => habits.value.length > 0 && completedToday.value === habits.value.length)

// Проверка наличия лейки в инвентаре (массив строк)
const hasWateringCan = computed(() => {
  return user.value?.inventory?.includes('watering_can')
})

const treeEmoji = computed(() => {
  if (user.value?.isDead) return '💀'
  if (user.value?.isWilted) return '🥀'
  // Стадии из твоего useHabitTracker (каждые 5 очков — новый этап)
  const stages = ['🌱', '🌿', '🌳', '🌲', '🌸']
  const stageIndex = (user.value?.treeStage || 1) - 1
  return stages[stageIndex] || '🌱'
})

const treeMessage = computed(() => {
  if (user.value?.isDead) return 'Дерево погибло...'
  if (user.value?.isWilted) return 'Дерево увяло... Нужно полить!'
  if (allHabitsDone.value) return 'Дерево счастливо!'
  return 'Продолжай в том же духе!'
})

onMounted(() => {
  if (!user.value) return
  
  // Проверка пропуска дней
  if (user.value.lastLogin) {
    const lastDate = new Date(user.value.lastLogin)
    const today = new Date()
    const diffDays = Math.floor(Math.abs(today - lastDate) / (1000 * 60 * 60 * 24))

    if (diffDays >= 1) {
      if (diffDays < 2) {
        user.value.isWilted = true
      } else {
        user.value.isDead = true 
      }
    }
  }
  
  checkCycleStatus()
})

const handleToggle = (name) => {
  if (user.value.isWilted || user.value.isDead) return 
  completeHabit(name)
}

const handleWatering = () => {
  useWateringCan()
}

const resetGame = () => {
  user.value.isWilted = false
  user.value.isDead = false
  user.value.score = 0
  user.value.treeStage = 1
  user.value.habits = []
  router.push('/select-habit')
}
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #000;
  min-height: 100vh;
  color: #fff;
}

.status-panel {
  display: flex;
  justify-content: space-between;
  background-color: #0a0a0a;
  padding: 20px 30px;
  border-radius: 24px;
  border: 1px solid #1a1a1a;
  margin-bottom: 30px;
}

.stat-block { text-align: center; }

.label {
  color: #555;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 800;
  display: block;
}

.value {
  color: #34c759;
  font-size: 1.3rem;
  font-weight: 900;
}

.tree-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background-color: #0a0a0a;
  border-radius: 32px;
  border: 1px solid #1a1a1a;
  margin-bottom: 30px;
  position: relative;
}

.wilted-border { border-color: #ff3b30; }

.tree-emoji { font-size: 7rem; margin-bottom: 10px; }

.tree-message { font-weight: 700; color: #888; }

.congratulations-card {
  margin-top: 20px;
  padding: 15px 25px;
  background: rgba(52, 199, 89, 0.1);
  border-radius: 20px;
  border: 1px solid #34c759;
  text-align: center;
}

.wilt-warning { text-align: center; margin-top: 20px; }

.warning-title { color: #ff3b30; font-weight: 800; }

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

.habits-section { margin-bottom: 30px; }

.section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 15px;
  font-weight: 800;
}

.habit-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0a0a0a;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 12px;
  border: 1px solid #1a1a1a;
}

.habit-info { display: flex; flex-direction: column; gap: 4px; }

.habit-name { font-weight: 700; }

.habit-target { font-size: 0.8rem; color: #34c759; font-weight: 600; }

.completed-card { border-color: #34c759; opacity: 0.8; }

.check-btn { background: none; border: none; font-size: 1.6rem; cursor: pointer; }

.actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

.nav-btn {
  padding: 15px;
  text-align: center;
  background-color: #1a1a1a;
  border-radius: 14px;
  text-decoration: none;
  color: #fff;
  border: 1px solid #333;
  font-weight: 700;
}

.buy-link { color: #007aff; text-decoration: none; display: block; margin-top: 10px; }

.reset-btn {
  background-color: #ff3b30;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 12px;
  margin-top: 15px;
  cursor: pointer;
}
</style>