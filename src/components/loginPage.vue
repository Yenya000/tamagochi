<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const error = reactive({
  message: ''
})

function handleSubmit() {
  error.message = ''
  
  if (!form.email || !form.password) {
    error.message = 'Заполните все поля'
    return
  }

  const result = login(form.email, form.password)
  
  if (result.success) {
    router.push({ name: 'home' })
  } else {
    error.message = result.error
  }
}
</script>

<template>
  <div class="form-container">
    <div class="auth-card">
      <h3>С возвращением!</h3>
      <p class="auth-subtitle">Твое дерево скучало по тебе 🌳</p>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="example@mail.com" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="form.password" type="password" placeholder="••••••••" />
      </div>

      <p v-if="error.message" class="error-text">{{ error.message }}</p>

      <button @click="handleSubmit" class="btn-primary">Войти в сад</button>
      
      <div class="auth-footer">
        <span>Нет аккаунта?</span>
        <RouterLink :to="{ name: 'register' }">Создать сад</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Используем твои переменные из style.css */
.auth-card {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;
  background: var(--surface-2, #F5F0E1);
  border-radius: var(--radius-lg, 32px);
  text-align: center;
}
.auth-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.error-text { color: #D32F2F; font-size: 0.8rem; margin-bottom: 16px; }
</style>