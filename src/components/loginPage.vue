<template>
  <div class="auth-container">
    <div class="auth-card">
      <button class="back-button" @click="router.push('/')">
        ← Назад
      </button>

      <h2 class="auth-title">Вход</h2>

      <div v-if="authStore.notificationMessage.value" class="notification" :class="authStore.notificationType.value">
        {{ authStore.notificationMessage.value }}
      </div>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="text" placeholder="Введите ваш email" />
        </div>

        <div class="input-group">
          <label>Пароль</label>
          <input v-model="password" type="password" placeholder="Введите пароль" />
        </div>

        <button type="submit" class="auth-submit">Войти</button>
      </form>

      <p class="auth-footer">
        Нет аккаунта?
        <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authStore, login } from '../composables/useAuth'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  const success = login(email.value, password.value)

  if (success) {
    router.push('/home')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
  padding: 20px;
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  background-color: #0a0a0a;
  padding: 50px 40px;
  border: 1px solid #1a1a1a;
  border-radius: 32px;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: transparent;
  border: none;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
}

.back-button:hover {
  color: #34c759;
}

.auth-title {
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.input-group label {
  color: #555;
  font-size: 0.9rem;
  margin-left: 10px;
}

.input-group input {
  background-color: #111;
  border: 1px solid #222;
  border-radius: 16px;
  padding: 15px 20px;
  color: #fff;
  font-size: 1rem;
  transition: 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #34c759;
}

.auth-submit {
  margin-top: 10px;
  background-color: #34c759;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
  width: 100%;
}

.auth-submit:hover {
  transform: translateY(-2px);
  background-color: #30b350;
}

.auth-footer {
  text-align: center;
  margin-top: 25px;
  color: #555;
}

.auth-footer a {
  color: #34c759;
  text-decoration: none;
}

.notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 30px;
  background-color: #1a1a1a;
  color: #fff;
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