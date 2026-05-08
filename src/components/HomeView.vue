<template>
  <div class="home-page">
    <div class="header">
      <h1>🌱 Привет, {{ user?.username }}!</h1>
      <p>Твой сад продуктивности</p>
    </div>

    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <div class="stat-value">{{ user?.currentStreak || 0 }}</div>
          <div class="stat-label">дней серия</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🪙</div>
        <div class="stat-info">
          <div class="stat-value">{{ user?.coins || 0 }}</div>
          <div class="stat-label">монет</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ completedToday }}/{{ user?.habits?.length || 0 }}</div>
          <div class="stat-label">сегодня</div>
        </div>
      </div>
    </div>

    <div class="tree-container" :class="{ wilted: user?.isWilted }">
      <div class="tree-emoji">{{ treeEmoji }}</div>
      <div class="tree-message">{{ treeMessage }}</div>
      <div v-if="user?.isWilted" class="wilt-warning">
        ⚠️ Дерево увяло! Выполняй задания или купи лейку в магазине
      </div>
    </div>

    <div class="actions">
      <router-link to="/tasks" class="action-btn primary">
        ✅ Выполнить задачи
      </router-link>
      <router-link to="/shop" class="action-btn secondary">
        🛒 Магазин
      </router-link>
    </div>

    <button v-if="user?.inventory?.wateringCan && user?.isWilted" @click="waterTree" class="water-btn">
      💧 Использовать лейку
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitTracker } from '../composables/useHabitTracker'

const { currentUser, useWateringCan, checkDailyReset } = useHabitTracker()
const user = ref(null)

onMounted(() => {
  checkDailyReset()
  user.value = currentUser.value
})

const completedToday = computed(() => {
  return user.value?.habits?.filter(h => h.completed).length || 0
})

const treeEmoji = computed(() => {
  if (user.value?.isWilted) return '🥀'
  const stages = ['🌱', '🌿', '🌳', '🌸']
  const stage = user.value?.treeStage || 1
  return stages[stage - 1]
})

const treeMessage = computed(() => {
  if (user.value?.isWilted) return 'Дерево увяло... Нужно поливать!'
  if (user.value?.currentStreak >= 30) return 'Великолепное цветущее дерево!'
  if (user.value?.currentStreak >= 15) return 'Крепкое дерево! Так держать!'
  if (user.value?.currentStreak >= 5) return 'Маленький росток растёт!'
  return 'Посади семечко — выполняй задания каждый день'
})

const waterTree = () => {
  useWateringCan()
  user.value = currentUser.value
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 20px 16px 80px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  color: #2d3e2d;
  margin-bottom: 4px;
}

.header p {
  color: #5a7a5a;
  font-size: 14px;
}

.stats-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.stat-icon {
  font-size: 32px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #2d3e2d;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.tree-container {
  background: linear-gradient(145deg, #a5d6a7, #81c784);
  border-radius: 32px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 24px;
  transition: all 0.3s;
}

.tree-container.wilted {
  background: linear-gradient(145deg, #bcaaa4, #a1887f);
  filter: grayscale(0.2);
}

.tree-emoji {
  font-size: 120px;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
  margin-bottom: 16px;
}

.tree-message {
  font-size: 16px;
  color: #1b3a1b;
  font-weight: 500;
}

.wilt-warning {
  margin-top: 16px;
  padding: 8px;
  background: rgba(255,255,255,0.7);
  border-radius: 20px;
  font-size: 13px;
  color: #c62828;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 14px;
  border-radius: 40px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: transform 0.2s;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.secondary {
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.water-btn {
  width: 100%;
  padding: 14px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 40px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.water-btn:hover {
  transform: translateY(-2px);
  background: #16a34a;
}
</style>