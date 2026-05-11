<template>
  <div class="selection-container">
    <div class="header-area">
      <h2 class="title">Настройка привычек</h2>
      <p class="subtitle">Нажми на карточку, чтобы активировать цель</p>
    </div>

    <div class="goals-grid">
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

    <div class="cycle-box">
      <div class="cycle-info">
        <h3>Длительность цикла</h3>
        <p>На сколько дней ставим цель?</p>
      </div>
      <div class="days-selector">
        <div 
          v-for="d in [7, 30, 90]" 
          :key="d" 
          class="custom-radio" 
          :class="{ 'selected': goalDays === d }" 
          @click="goalDays = d"
        >
          <div class="radio-circle"></div>
          <span class="radio-label">{{ d }} дней</span>
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
import { startNewCycle } from '../composables/useHabitTracker'

const router = useRouter()
const user = authStore.user

const goalDays = ref(30)
const goals = reactive({
  water: { active: false, val: 8, unit: 'стаканов' },
  gym: { active: false, val: 15, inc: true },
  books: { active: false, val: 20, inc: true },
  meditation: { active: false, val: 10 }
})

const startCycle = () => {
  if (!user.value) {
    alert('Ошибка: пользователь не авторизован')
    return
  }
  
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

  if (habits.length === 0) {
    alert('Нужно выбрать хотя бы одну цель!')
    return
  }

  user.value.habits = habits
  startNewCycle(goalDays.value)
  router.push('/home')
}
</script>

<style scoped>
.selection-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: #000;
  min-height: 100vh;
}

.title {
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.subtitle {
  color: #555;
  margin-bottom: 40px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.goal-card-item {
  padding: 30px;
  background-color: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 32px;
  cursor: pointer;
  transition: 0.3s ease;
}

.goal-card-item.active {
  border-color: #34c759;
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
  color: #fff;
}

.card-parameters {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px dashed #222;
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
  background-color: #111;
  border: 1px solid #222;
  border-radius: 12px;
  color: #fff;
  text-align: center;
}

.select-input {
  background-color: transparent;
  border: none;
  color: #34c759;
  font-weight: 700;
  cursor: pointer;
}

.unit-label {
  color: #555;
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
  background-color: #222;
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
  background-color: #34c759;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 0.8rem;
  color: #555;
}

.cycle-box {
  margin-top: 40px;
  padding: 40px;
  background-color: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cycle-info h3 {
  color: #fff;
  margin: 0;
}

.cycle-info p {
  color: #555;
  margin: 5px 0 0;
}

.days-selector {
  display: flex;
  gap: 15px;
}

.custom-radio {
  padding: 12px 20px;
  border: 2px solid #1a1a1a;
  border-radius: 18px;
  cursor: pointer;
  transition: 0.3s;
}

.custom-radio.selected {
  border-color: #34c759;
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
  background-color: #34c759;
  border-color: #34c759;
}

.radio-label {
  color: #fff;
  font-weight: 600;
  margin-left: 8px;
}

.confirm-btn {
  width: 100%;
  margin-top: 40px;
  padding: 25px;
  background-color: #34c759;
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
</style>