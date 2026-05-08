<template>
  <div class="register-page">
    <div class="register-card">
      <div class="logo-section">
        <div class="tree-icon">🌱</div>
        <h1>Habit Tree</h1>
        <p>Вырасти своё дерево продуктивности</p>
      </div>

      <div class="form-group">
        <label>Имя</label>
        <input v-model="username" type="text" placeholder="Как вас зовут?" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="example@mail.ru" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="password" type="password" placeholder="••••••••" />
      </div>

      <div class="form-group">
        <label>Ваши привычки (выберите 1-3)</label>
        <div class="habits-grid">
          <label v-for="h in habitOptions" :key="h" class="habit-checkbox">
            <input type="checkbox" :value="h" v-model="selectedHabits" />
            <span>{{ h }}</span>
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Цель (дней)</label>
        <select v-model="goalDays" class="goal-select">
          <option v-for="d in [7,30,60,90,365]" :value="d">{{ d }} дней</option>
        </select>
      </div>

      <button class="register-btn" @click="signup">🌱 Создать аккаунт</button>

      <p class="login-link">
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHabitTracker } from '../composables/useHabitTracker'

const { register } = useHabitTracker()
const router = useRouter()

const email = ref('')
const password = ref('')
const username = ref('')
const selectedHabits = ref([])
const goalDays = ref(30)
const habitOptions = ['💧 Пить воду', '🤸 Зарядка', '📖 Чтение 15 мин', '🧘 Медитация', '🚶 Прогулка']

const signup = () => {
  if (selectedHabits.value.length === 0) return alert('Выберите хотя бы одну привычку')
  const ok = register(username.value, email.value, password.value, selectedHabits.value, goalDays.value)
  if (ok) router.push('/login')
  else alert('Пользователь уже существует')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.tree-icon {
  font-size: 48px;
  margin-bottom: 0.5rem;
}

.logo-section h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.logo-section p {
  color: #888;
  font-size: 14px;
  margin-top: 0.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
  font-size: 14px;
}

.form-group input,
.goal-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
}

.form-group input:focus,
.goal-select:focus {
  outline: none;
  border-color: #667eea;
}

.habits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.habit-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.habit-checkbox:hover {
  background: #e9ecef;
}

.habit-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.habit-checkbox span {
  font-size: 14px;
  color: #555;
}

.register-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.register-btn:hover {
  transform: translateY(-2px);
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #888;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>