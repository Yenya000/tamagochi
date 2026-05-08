<template>
  <div class="auth-wrapper">
    <div class="habit-card-base auth-container">
      <button class="back-link" @click="router.push('/')">← Назад</button>
      <h2>Регистрация</h2>
      
      <div class="auth-form">
        <input v-model="email" type="text" placeholder="Email" @input="clearError" />
        <input v-model="password" type="password" placeholder="Пароль" @input="clearError" />
        
        <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>
        
        <button class="main-button full-width" @click="handleRegister">Создать аккаунт</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const clearError = () => errorMessage.value = ''

const handleRegister = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Заполните все поля!'
    return
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.find(u => u.email === email.value)) {
    errorMessage.value = 'Такой пользователь уже есть!'
    return
  }

  users.push({ email: email.value, password: password.value })
  localStorage.setItem('users', JSON.stringify(users))
  router.push('/login')
}
</script>

<style scoped>
/* Дублируем стили из LoginPage для единообразия */
.auth-wrapper { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
.auth-container { max-width: 380px; width: 100%; text-align: center; }
input { width: 100%; padding: 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); box-sizing: border-box; margin-bottom: 12px; }
.error-box { background: #fee2e2; color: #dc2626; padding: 12px; border-radius: 12px; margin-bottom: 16px; font-size: 0.85rem; }
.full-width { width: 100%; }
.back-link { background: none; border: none; color: var(--text-secondary); cursor: pointer; float: left; margin-bottom: 10px; }
</style>