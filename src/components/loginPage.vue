<template>
  <div class="auth-wrapper">
    <div class="habit-card-base auth-container">
      <button class="back-link" @click="router.push('/')">← Назад</button>
      <h2>Вход</h2>
      
      <div class="auth-form">
        <div class="input-group">
          <input v-model="email" type="text" placeholder="Email" @input="clearError" />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Пароль" @input="clearError" />
        </div>
        
        <!-- Твоя логика вывода ошибок -->
        <div v-if="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>
        
        <button class="main-button full-width" @click="handleLogin">Войти</button>
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

const handleLogin = () => {
  // Твоя логика регистрации/входа
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.email === email.value && u.password === password.value)

  if (user) {
    localStorage.setItem('userToken', 'active')
    localStorage.setItem('currentUser', JSON.stringify(user))
    router.push('/select-habit')
  } else {
    // Выводим твою ошибку в интерфейс
    errorMessage.value = 'Аккаунт не найден или неверный пароль. Проверьте данные или зарегистрируйтесь.'
  }
}
</script>

<style scoped>
/* Стили те же, что были, плюс ошибка: */
.error-box {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 0.85rem;
  border: 1px solid #fecaca;
}
.back-link {
  background: none; border: none; color: var(--text-secondary);
  cursor: pointer; float: left; margin-bottom: 10px;
}
.auth-wrapper { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
.auth-container { max-width: 380px; width: 100%; text-align: center; }
.input-group { margin-bottom: 12px; }
input { width: 100%; padding: 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-main); box-sizing: border-box; }
.full-width { width: 100%; margin-top: 10px; }
</style>