<template>
  <div class="auth-page">
    <div class="auth-container">
      <button 
        class="back-button" 
        @click="router.push('/login')"
      >
        ← Назад
      </button>

      <h2 class="auth-title">Регистрация</h2>

      <!-- Уведомление -->
      <div v-if="notification.show" class="notification" :class="notification.type">
        {{ notification.message }}
      </div>

      <form 
        @submit.prevent="handleRegister" 
        novalidate
      >
        <div class="input-group">
          <input 
            v-model="username" 
            type="text" 
            placeholder="Имя (напр. Анна)" 
          />
        </div>

        <div class="input-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email" 
          />
        </div>

        <div class="input-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Пароль" 
          />
        </div>
        
        <button 
          type="submit" 
          class="submit-btn"
        >
          Создать аккаунт
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../composables/useAuth'

const router = useRouter()

// ===== 1. ПОЛЯ ВВОДА =====
const username = ref('')
const email = ref('')
const password = ref('')

// ===== 2. УВЕДОМЛЕНИЯ =====
const notification = ref({ show: false, message: '', type: '' })

function showNotification(message, type = 'error') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 2000)
}

// ===== 3. ОБРАБОТКА РЕГИСТРАЦИИ =====
const handleRegister = () => {
  // Валидация имени (русские буквы, с большой буквы)
  if (!/^[А-ЯЁ][а-яё]+$/.test(username.value)) {
    showNotification('Имя должно быть на русском, с большой буквы')
    return
  }

  // Базовая проверка почты
  if (email.value.length < 5 || !email.value.includes('@')) {
    showNotification('Введите корректный Email')
    return
  }

  // Минимальная длина пароля
  if (password.value.length < 4) {
    showNotification('Пароль слишком короткий (минимум 4 символа)')
    return
  }
  
  const success = register(email.value, password.value, username.value)

  if (success) {
    router.push('/select-habit')
  } else {
    // Ошибка уже показывается внутри register, но на всякий случай:
    if (notification.value.show === false) {
      showNotification('Этот email уже зарегистрирован')
    }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
}

.auth-container {
  position: relative;
  padding: 50px 40px;
  width: 100%;
  max-width: 450px;
  text-align: center;
  background-color: #0a0a0a;
  border: 1px solid #1a1a1a;
  border-radius: 40px;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 25px;
  background-color: transparent;
  border: none;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.2s;
}

.back-button:hover {
  color: #34c759;
}

.auth-title {
  color: #fff;
  margin-bottom: 35px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 800;
}

.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 18px 20px;
  border: 1px solid #1a1a1a;
  background-color: rgba(255, 255, 255, 0.03);
  color: white;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: 0.3s;
}

input:focus {
  outline: none;
  border-color: #34c759;
  background-color: rgba(52, 199, 89, 0.05);
}

input::placeholder {
  color: #444;
}

.submit-btn {
  width: 100%;
  padding: 20px;
  background-color: #34c759;
  color: white;
  border: none;
  border-radius: 22px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 15px;
  transition: 0.2s;
}

.submit-btn:hover {
  background-color: #2eb34f;
  transform: translateY(-2px);
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