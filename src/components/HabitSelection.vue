<template>
  <div class="selection-container">
    <div class="header-area">
      <h2 class="title">Настройка привычек</h2>
      <p class="subtitle">Нажми на карточку, чтобы активировать цель</p>
    </div>

    <!-- Уведомление -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>

    <div class="goals-grid">
      <!-- Водный баланс -->
      <div 
        class="goal-card-item" 
        :class="{ 'active': goals.water.active }"
        @click="goals.water.active = !goals.water.active"
      >
        <div class="card-main-info">
          <span class="emoji"> 💧 </span>
          <div class="info-text">
            <strong>Водный баланс</strong>
          </div>
        </div>
        
        <div v-if="goals.water.active" class="card-parameters" @click.stop>
          <div class="input-group">
            <input 
              type="number" 
              v-model="goals.water.val"
              class="num-input"
            />
            <select v-model="goals.water.unit" class="select-input">
              <option value="стаканов">стаканов</option>
              <option value="литров">литров</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Зарядка -->
      <div 
        class="goal-card-item" 
        :class="{ 'active': goals.gym.active }"
        @click="goals.gym.active = !goals.gym.active"
      >
        <div class="card-main-info">
          <span class="emoji"> 🤸 </span>
          <div class="info-text">
            <strong>Зарядка</strong>
          </div>
        </div>
        <div v-if="goals.gym.active" class="card-parameters" @click.stop>
          <div class="input-group">
            <input 
              type="number" 
              v-model="goals.gym.val"
              class="num-input"
            />
            <span class="unit-label">минут</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="goals.gym.inc" />
            <span class="slider"></span>
            <span class="toggle-text">+5 мин / 5 дней</span>
          </label>
        </div>
      </div>

      <!-- Чтение -->
      <div 
        class="goal-card-item" 
        :class="{ 'active': goals.books.active }"
        @click="goals.books.active = !goals.books.active"
      >
        <div class="card-main-info">
          <span class="emoji"> 📚 </span>
          <div class="info-text">
            <strong>Чтение</strong>
          </div>
        </div>
        <div v-if="goals.books.active" class="card-parameters" @click.stop>
          <div class="input-group">
            <input 
              type="number" 
              v-model="goals.books.val"
              class="num-input"
            />
            <span class="unit-label">страниц</span>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" v-model="goals.books.inc" />
            <span class="slider"></span>
            <span class="toggle-text">+5 стр / 5 дней</span>
          </label>
        </div>
      </div>

      <!-- Медитация -->
      <div 
        class="goal-card-item" 
        :class="{ 'active': goals.meditation.active }"
        @click="goals.meditation.active = !goals.meditation.active"
      >
        <div class="card-main-info">
          <span class="emoji"> 🧘 </span>
          <div class="info-text">
            <strong>Медитация</strong>
          </div>
        </div>
        <div v-if="goals.meditation.active" class="card-parameters" @click.stop>
          <div class="input-group">
            <input 
              type="number" 
              v-model="goals.meditation.val"
              class="num-input"
            />
            <span class="unit-label">минут</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Выбор длительности цикла -->
    <div class="cycle-box">
      <div class="cycle-info">
        <h3>Длительность цикла</h3>
        <p>На сколько дней ставим цель?</p>
      </div>
      <div class="days-selector">
        <div 
          v-for="d in [1, 7, 30, 90]" 
          :key="d" 
          class="custom-radio" 
          :class="{ 'selected': goalDays === d }" 
          @click="goalDays = d"
        >
          <div class="radio-circle"></div>
          <span class="radio-label">{{ d }} {{ d === 1 ? 'день' : 'дней' }}</span>
        </div>
      </div>
    </div>

    <button class="confirm-btn" @click="startCycle">
      Начать выращивание
    </button>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../composables/useAuth'

const router = useRouter()
const user = authStore.user

// ===== 1. СОСТОЯНИЯ =====
const goalDays = ref(30)
const goals = reactive({
  water: { active: false, val: 8, unit: 'стаканов' },
  gym: { active: false, val: 15, inc: true },
  books: { active: false, val: 20, inc: true },
  meditation: { active: false, val: 10 }
})

// ===== 2. УВЕДОМЛЕНИЯ =====
const notification = ref({ show: false, message: '', type: '' })

function showNotification(message, type = 'error') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 2000)
}

// ===== 3. СОХРАНЕНИЕ ПОЛЬЗОВАТЕЛЯ =====
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

// ===== 4. НАЧАЛО НОВОГО ЦИКЛА =====
const startCycle = () => {
  // Проверка авторизации
  if (!user.value) {
    showNotification('Ошибка: пользователь не авторизован')
    return
  }
  
  // Сбор выбранных привычек
  const habits = []

  if (goals.water.active) {
    habits.push({ 
      name: 'Водный баланс', 
      type: 'other',
      targetValue: Number(goals.water.val), 
      unit: goals.water.unit, 
      completed: false 
    })
  }
  if (goals.gym.active) {
    habits.push({ 
      name: 'Зарядка', 
      type: 'exercise',
      minutes: Number(goals.gym.val), 
      unit: 'мин', 
      autoIncrease: goals.gym.inc, 
      completed: false, 
      daysPassed: 0 
    })
  }
  if (goals.books.active) {
    habits.push({ 
      name: 'Чтение', 
      type: 'reading',
      pages: Number(goals.books.val), 
      unit: 'стр', 
      autoIncrease: goals.books.inc, 
      completed: false, 
      daysInWeek: 0 
    })
  }
  if (goals.meditation.active) {
    habits.push({ 
      name: 'Медитация', 
      type: 'other',
      targetValue: Number(goals.meditation.val), 
      unit: 'мин', 
      completed: false 
    })
  }

  // Проверка: выбрана хотя бы одна привычка
  if (habits.length === 0) {
    showNotification('Нужно выбрать хотя бы одну цель!')
    return
  }

  // Запуск нового цикла
  user.value.habits = habits
  user.value.isDead = false
  user.value.isWilted = false
  user.value.score = 0
  user.value.treeStage = 1
  user.value.goalDays = goalDays.value
  user.value.goalStartDate = new Date().toISOString()
  user.value.isCycleCompleted = false
  user.value.alreadyClaimed = false
  user.value.lastLogin = new Date().toISOString()
  
  saveUser()
  router.push('/home')
}
</script>

<style scoped>
/* ... твои стили ... */
.selection-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: var(--bg-color, #000);
  min-height: 100vh;
}

.title {
  color: var(--text-main, #fff);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.subtitle {
  color: var(--text-secondary, #555);
  margin-bottom: 40px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.goal-card-item {
  padding: 30px;
  background-color: var(--card-bg, #0a0a0a);
  border: 1px solid var(--border-color, #1a1a1a);
  border-radius: 32px;
  cursor: pointer;
  transition: 0.3s ease;
}

.goal-card-item.active {
  border-color: var(--accent-color, #34c759);
  background-color: rgba(52, 199, 89, 0.05);
}

.card-main-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.emoji {
  font-size: 2.5rem;
}

.info-text strong {
  font-size: 1.3rem;
  color: var(--text-main, #fff);
}

.card-parameters {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px dashed var(--border-color, #222);
}

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.num-input {
  width: 70px;
  padding: 10px;
  background-color: var(--bg-color, #111);
  border: 1px solid var(--border-color, #222);
  border-radius: 12px;
  color: var(--text-main, #fff);
  text-align: center;
}

.select-input {
  background-color: transparent;
  border: none;
  color: var(--accent-color, #34c759);
  font-weight: 700;
  cursor: pointer;
}

.unit-label {
  color: var(--text-secondary, #555);
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 15px;
}

.toggle-switch input {
  display: none;
}

.slider {
  width: 40px;
  height: 20px;
  background-color: var(--border-color, #222);
  border-radius: 20px;
  position: relative;
  transition: 0.3s;
}

.slider:before {
  content: "";
  position: absolute;
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: #fff;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .slider {
  background-color: var(--accent-color, #34c759);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 0.8rem;
  color: var(--text-secondary, #555);
}

.cycle-box {
  margin-top: 40px;
  padding: 40px;
  background-color: var(--card-bg, #0a0a0a);
  border: 1px solid var(--border-color, #1a1a1a);
  border-radius: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cycle-info h3 {
  color: var(--text-main, #fff);
  margin: 0;
}

.cycle-info p {
  color: var(--text-secondary, #555);
  margin: 5px 0 0;
}

.days-selector {
  display: flex;
  gap: 15px;
}

.custom-radio {
  padding: 12px 20px;
  border: 2px solid var(--border-color, #1a1a1a);
  border-radius: 18px;
  cursor: pointer;
  transition: 0.3s;
}

.custom-radio.selected {
  border-color: var(--accent-color, #34c759);
  background-color: rgba(52, 199, 89, 0.1);
}

.radio-circle {
  width: 16px;
  height: 16px;
  border: 2px solid #333;
  border-radius: 50%;
  display: inline-block;
}

.selected .radio-circle {
  background-color: var(--accent-color, #34c759);
  border-color: var(--accent-color, #34c759);
}

.radio-label {
  color: var(--text-main, #fff);
  font-weight: 600;
  margin-left: 8px;
}

.confirm-btn {
  width: 100%;
  margin-top: 40px;
  padding: 25px;
  background-color: var(--accent-color, #34c759);
  border: none;
  border-radius: 28px;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}

.confirm-btn:hover {
  transform: translateY(-3px);
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