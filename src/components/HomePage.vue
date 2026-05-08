<template>
  <div class="home-wrapper">
    <div class="central-container">
      
      <div class="habit-card-base tree-card-centered">
        <div class="streak-badge">
          🔥 {{ activeDays }} дн.
        </div>

        <div class="tree-display">
          <span class="emoji-tree">{{ treeEmoji }}</span>
        </div>
        <div class="level-badge">Уровень {{ level }}</div>
      </div>

      <div class="habit-card-base tasks-card">
        <h3>Задания на сегодня</h3>
        
        <div class="tasks-list">
          <label v-if="userGoals.water.active === true" class="task-item-interactive">
            <input type="checkbox" v-model="todayProgress.water" v-on:change="checkGoals">
            <span class="task-text">💧 Выпить {{ userGoals.water.amount }} {{ userGoals.water.unit }} воды</span>
          </label>

          <label v-if="userGoals.exercise.active === true" class="task-item-interactive">
            <input type="checkbox" v-model="todayProgress.exercise" v-on:change="checkGoals">
            <span class="task-text">🏃 Зарядка ({{ userGoals.exercise.minutes }} мин)</span>
          </label>

          <label v-if="userGoals.reading.active === true" class="task-item-interactive">
            <input type="checkbox" v-model="todayProgress.reading" v-on:change="checkGoals">
            <div class="task-text reading-layout">
              <span>📚 Прочитать {{ userGoals.reading.pages }} стр.</span>
              <input type="number" placeholder="Факт" class="small-fact-input" v-on:click.stop>
            </div>
          </label>
        </div>

        <button 
          class="main-button full-width-btn" 
          :disabled="isAllDone === false || alreadyClaimed === true"
          v-on:click="completeDay"
        >
          {{ buttonText }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// ФЛАГИ СОСТОЯНИЯ
const userGoals = ref({ water: {}, exercise: {}, reading: {} })
const score = ref(0)
const level = ref(1)
const activeDays = ref(0) // Наш новый флаг для дней
const alreadyClaimed = ref(false)
const todayProgress = ref({ water: false, exercise: false, reading: false })

const isAllDone = ref(false)
const treeEmoji = ref('🌱')
const buttonText = ref('Засчитать день')

function calculateTreeState() {
  level.value = Math.floor(score.value / 5) + 1
  
  if (level.value >= 7) {
    treeEmoji.value = '🌲'
  } 
  else if (level.value >= 4) {
    treeEmoji.value = '🌳'
  } 
  else if (level.value >= 2) {
    treeEmoji.value = '🌿'
  } 
  else {
    treeEmoji.value = '🌱'
  }
}

function checkGoals() {
  isAllDone.value = true

  if (userGoals.value.water.active === true && todayProgress.value.water === false) {
    isAllDone.value = false
  } 
  else if (userGoals.value.exercise.active === true && todayProgress.value.exercise === false) {
    isAllDone.value = false
  } 
  else if (userGoals.value.reading.active === true && todayProgress.value.reading === false) {
    isAllDone.value = false
  }
}

function updateButtonText() {
  if (alreadyClaimed.value === true) {
    buttonText.value = 'День завершен! 🎉'
  } else {
    buttonText.value = 'Засчитать день'
  }
}

function updateGoalDifficulty() {
  let g = userGoals.value
  
  if (g.exercise.active === true) {
    g.exercise.daysPassed = g.exercise.daysPassed + 1
    if (g.exercise.daysPassed >= 5) {
      if (g.exercise.minutes < 30) {
        g.exercise.minutes = g.exercise.minutes + 5
        g.exercise.daysPassed = 0
      }
    }
  }
  
  if (g.reading.active === true && g.reading.autoIncrease === true) {
    g.reading.daysInWeek = g.reading.daysInWeek + 1
    if (g.reading.daysInWeek >= 7) {
      g.reading.pages = g.reading.pages + 10
      g.reading.daysInWeek = 0
    }
  }
  
  localStorage.setItem('userGoals', JSON.stringify(g))
}

function completeDay() {
  // 1. Увеличиваем общий балл дерева
  score.value = score.value + 1
  localStorage.setItem('treeScore', score.value)
  
  // 2. Увеличиваем счетчик активных дней
  activeDays.value = activeDays.value + 1
  localStorage.setItem('activeDays', activeDays.value)
  
  // 3. Обновляем флаги и сложность
  alreadyClaimed.value = true
  calculateTreeState()
  updateButtonText()
  updateGoalDifficulty()
}

onMounted(function() {
  // Загружаем цели
  const savedGoals = localStorage.getItem('userGoals')
  if (savedGoals) {
    userGoals.value = JSON.parse(savedGoals)
  }
  
  // Загружаем очки дерева
  const savedScore = localStorage.getItem('treeScore')
  if (savedScore) {
    score.value = parseInt(savedScore)
  }

  // Загружаем количество дней
  const savedDays = localStorage.getItem('activeDays')
  if (savedDays) {
    activeDays.value = parseInt(savedDays)
  }

  calculateTreeState()
  checkGoals()
  updateButtonText()
})
</script>

<style scoped>
.home-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.central-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 480px;
}

/* Карточка Дерева */
.tree-card-centered {
  width: 100%;
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  border-radius: 32px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  position: relative; /* Для позиционирования счетчика */
}

/* Счетчик дней (огонек) */
.streak-badge {
  position: absolute;
  top: 20px;
  right: 25px;
  background: #fff5f5;
  color: #ff4d4f;
  padding: 6px 14px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  border: 1px solid #ffccc7;
}

.emoji-tree {
  font-size: 8rem;
  display: block;
  margin-bottom: 20px;
}

.level-badge {
  display: inline-block;
  background: var(--focus-shadow);
  color: var(--accent-color);
  padding: 8px 20px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1rem;
}

/* Карточка Задач */
.tasks-card {
  width: 100%;
  background: var(--card-bg);
  border-radius: 32px;
  padding: 35px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  box-sizing: border-box;
}

h3 {
  margin: 0 0 25px 0;
  text-align: center;
  font-size: 1.4rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.task-item-interactive {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-item-interactive:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  background: var(--card-bg);
}

.task-text {
  flex: 1;
  text-align: left;
  font-weight: 600;
  font-size: 1.05rem;
}

.reading-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.small-fact-input {
  width: 70px;
  padding: 8px !important;
  text-align: center;
  border-radius: 10px !important;
}

.full-width-btn {
  width: 100%;
}

input[type="checkbox"] {
  width: 24px;
  height: 24px;
  accent-color: var(--accent-color);
  cursor: pointer;
}
</style>