<template>
  <div class="tasks-page">
    <div class="header">
      <h1>📋 Сегодняшние задачи</h1>
      <p>Отмечай выполненные — расти своё дерево!</p>
    </div>

    <div class="progress-card">
      <div class="progress-info">
        <span class="progress-label">Прогресс на сегодня</span>
        <span class="progress-percent">{{ percentDone }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: percentDone + '%' }"></div>
      </div>
      <div class="progress-stats">
        Выполнено: {{ completedCount }} из {{ totalCount }}
      </div>
    </div>

    <div class="tasks-list">
      <div 
        v-for="(habit, idx) in user?.habits" 
        :key="habit.name" 
        class="task-card"
        :class="{ completed: habit.completed }"
      >
        <div class="task-check">
          <input 
            type="checkbox" 
            :checked="habit.completed" 
            @change="complete(idx)"
            :id="'task_' + idx"
          />
          <label :for="'task_' + idx" class="task-label">
            <span class="task-emoji">{{ getEmoji(habit.name) }}</span>
            <span class="task-name">{{ habit.name }}</span>
          </label>
        </div>
        <div class="task-streak">
          🔥 {{ habit.streak }}
        </div>
      </div>
    </div>

    <div v-if="allDone" class="congrats-card">
      <div class="congrats-emoji">🎉🏆🎉</div>
      <div class="congrats-text">Молодец! Все задачи выполнены!</div>
      <div class="congrats-streak">Серия увеличилась до {{ user?.currentStreak }} дней!</div>
    </div>

    <div class="motivation">
      <span class="motivation-text">{{ motivationMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitTracker } from '../composables/useHabitTracker'

const { currentUser, completeHabit, checkDailyReset } = useHabitTracker()
const user = ref(null)

onMounted(() => {
  checkDailyReset()
  user.value = currentUser.value
})

const totalCount = computed(() => user.value?.habits?.length || 0)
const completedCount = computed(() => user.value?.habits?.filter(h => h.completed).length || 0)
const percentDone = computed(() => Math.round((completedCount.value / totalCount.value) * 100) || 0)
const allDone = computed(() => completedCount.value === totalCount.value && totalCount.value > 0)

const motivationMessage = computed(() => {
  if (allDone.value) return '✨ Ты супергерой! Продолжай в том же духе! ✨'
  if (percentDone.value >= 50) return '💪 Отлично! Осталось совсем немного!'
  if (percentDone.value > 0) return '🌱 Хороший старт! Так держать!'
  return '🌟 Начни день с выполнения привычек!'
})

const getEmoji = (name) => {
  if (name.includes('Воду')) return '💧'
  if (name.includes('Зарядка')) return '🤸'
  if (name.includes('Чтение')) return '📖'
  if (name.includes('Медитация')) return '🧘'
  if (name.includes('Прогулка')) return '🚶'
  return '✅'
}

const complete = (idx) => {
  completeHabit(idx)
  user.value = currentUser.value
}
</script>

<style scoped>
.tasks-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
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
  color: #6b7280;
  font-size: 14px;
}

.progress-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 14px;
  color: #6b7280;
}

.progress-percent {
  font-size: 18px;
  font-weight: bold;
  color: #3b82f6;
}

.progress-bar {
  height: 12px;
  background: #e5e7eb;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  border-radius: 20px;
  transition: width 0.3s ease;
}

.progress-stats {
  font-size: 13px;
  color: #9ca3af;
  text-align: right;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.task-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border: 1px solid transparent;
}

.task-card.completed {
  background: #f0fdf4;
  border-color: #22c55e;
  opacity: 0.8;
}

.task-check {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.task-check input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #22c55e;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
}

.task-emoji {
  font-size: 28px;
}

.task-name {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.task-card.completed .task-name {
  text-decoration: line-through;
  color: #9ca3af;
}

.task-streak {
  background: #fef3c7;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  color: #d97706;
}

.congrats-card {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.congrats-emoji {
  font-size: 48px;
  margin-bottom: 8px;
}

.congrats-text {
  font-size: 18px;
  font-weight: bold;
  color: #92400e;
}

.congrats-streak {
  font-size: 14px;
  color: #b45309;
  margin-top: 8px;
}

.motivation {
  text-align: center;
  padding: 16px;
  background: rgba(255,255,255,0.7);
  border-radius: 30px;
}

.motivation-text {
  font-size: 14px;
  color: #6b7280;
  font-style: italic;
}
</style>