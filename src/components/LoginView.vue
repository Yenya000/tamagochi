<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-section">
        <div class="tree-icon">🌳</div>
        <h1>Добро пожаловать</h1>
        <p>Войдите в свой аккаунт</p>
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="example@mail.ru" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="password" type="password" placeholder="••••••••" />
      </div>

      <button class="login-btn" @click="signin">🔐 Войти</button>

      <p class="register-link">
        Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHabitTracker } from '../composables/useHabitTracker'

const { login } = useHabitTracker()
const router = useRouter()
const email = ref('')
const password = ref('')

const signin = () => {
  if (login(email.value, password.value)) router.push('/home')
  else alert('Неверные данные')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  max-width: 400px;
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

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
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

.login-btn:hover {
  transform: translateY(-2px);
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #888;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>