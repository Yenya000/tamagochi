<template>
  <div class="selection-wrapper">
    <div class="habit-card-base selection-container">
      <h1>Выбор пути</h1>
      <p class="subtitle">Какую привычку будем превращать в дерево?</p>

      <div class="habit-grid">
        <div 
          v-for="habit in availableHabits" 
          :key="habit.id"
          :class="['grid-item', { active: selectedHabitId === habit.id }]"
          @click="selectedHabitId = habit.id"
        >
          <div class="habit-icon">{{ habit.icon }}</div>
          <span class="habit-name">{{ habit.name }}</span>
        </div>
      </div>

      <button 
        class="main-button full-width" 
        :disabled="!selectedHabitId"
        @click="confirmSelection"
      >
        Начать рост
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedHabitId = ref(null)

const availableHabits = [
  { id: 1, name: 'Вода', icon: '💧' },
  { id: 2, name: 'Спорт', icon: '⚡' },
  { id: 3, name: 'Сон', icon: '🌙' },
  { id: 4, name: 'Код', icon: '💻' }
]

const confirmSelection = () => {
  const habit = availableHabits.find(h => h.id === selectedHabitId.value)
  localStorage.setItem('userHabit', JSON.stringify(habit))
  router.push({ name: 'home' })
}
</script>

<style scoped>
.selection-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  padding: 20px;
}
.selection-container {
  max-width: 400px;
  width: 100%;
  text-align: center;
}
.subtitle {
  color: var(--text-secondary);
  margin-bottom: 32px;
}
.habit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}
.grid-item {
  background: var(--bg-color);
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.grid-item:hover {
  transform: scale(1.02);
}
.grid-item.active {
  border-color: var(--accent-color);
  background: var(--card-bg);
}
.habit-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
.habit-name {
  font-weight: 500;
  font-size: 0.9rem;
}
.full-width {
  width: 100%;
}
</style>