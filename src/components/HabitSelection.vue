<template>
  <div class="selection-wrapper">
    <div class="habit-card-base settings-container">
      <h2>Настройка целей 🌱</h2>
      <p class="subtitle">Настрой параметры, чтобы дерево росло правильно</p>

      <div class="goals-list">
        <div class="goal-item glass-card">
          <div class="goal-header">
            <span>💧 Вода</span>
            <input type="checkbox" v-model="goals.water.active">
          </div>
          <div v-if="goals.water.active" class="goal-controls">
            <select v-model="goals.water.unit">
              <option value="стаканов">Стаканы</option>
              <option value="литров">Литры</option>
            </select>
            <input type="number" v-model="goals.water.amount" min="1" max="20">
          </div>
        </div>

        <div class="goal-item glass-card">
          <div class="goal-header">
            <span>🏃 Зарядка</span>
            <input type="checkbox" v-model="goals.exercise.active">
          </div>
          <div v-if="goals.exercise.active" class="goal-controls">
            <span>План: {{ goals.exercise.minutes }} мин.</span>
            <small>(Растет каждые 5 дней)</small>
          </div>
        </div>

        <div class="goal-item glass-card">
          <div class="goal-header">
            <span>📚 Чтение</span>
            <input type="checkbox" v-model="goals.reading.active">
          </div>
          <div v-if="goals.reading.active" class="goal-controls">
            <span>Цель: {{ goals.reading.pages }} стр.</span>
            <input type="checkbox" v-model="goals.reading.autoIncrease"> 
            <small>+10 стр. в неделю</small>
          </div>
        </div>
      </div>

      <button class="main-button full-width" @click="saveGoals">Сохранить и начать</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goals = ref({
  water: { active: true, amount: 8, unit: 'стаканов' },
  exercise: { active: true, minutes: 5, daysPassed: 0 },
  reading: { active: true, pages: 20, autoIncrease: true, daysInWeek: 0 }
})

onMounted(() => {
  const saved = localStorage.getItem('userGoals')
  if (saved) goals.value = JSON.parse(saved)
})

const saveGoals = () => {
  localStorage.setItem('userGoals', JSON.stringify(goals.value))
  router.push('/home')
}
</script>

<style scoped>
.settings-container { max-width: 500px; margin: 0 auto; }
.goal-item { margin-bottom: 15px; text-align: left; }
.goal-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 10px; }
.goal-controls { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
input[type="number"] { width: 60px; padding: 5px; border-radius: 8px; border: 1px solid var(--border-color); }
select { padding: 5px; border-radius: 8px; }
.subtitle { color: var(--text-secondary); margin-bottom: 20px; }
</style>