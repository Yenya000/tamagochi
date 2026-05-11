<template>
  <div class="auth-container">
    <div class="auth-card">
      <button 
        class="back-button" 
        @click="router.push('/')"
      >
        ← Назад
      </button>

      <h2 class="auth-title">Вход</h2>
      
      <form 
        @submit.prevent="handleLogin" 
        class="auth-form"
      >
        <div class="input-group">
          <label>Email</label>
          <input 
            v-model="emailField" 
            type="email" 
            placeholder="Введите ваш email" 
            required
          />
        </div>

        <div class="input-group">
          <label>Пароль</label>
          <input 
            v-model="passwordField" 
            type="password" 
            placeholder="Введите пароль" 
            required
          />
        </div>

        <button 
          type="submit" 
          class="auth-submit"
        >
          Войти
        </button>
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
// Импортируем функцию входа и стор
import { authStore, login as authLogin } from '../composables/useAuth'

const router = useRouter()

// Переменные для полей ввода
const emailField = ref('')
const passwordField = ref('')

const handleLogin = () => {
  // Передаем значения из рефов в функцию логики
  const success = authLogin(
    emailField.value, 
    passwordField.value
  )

  if (success) {
    // Если всё ок — летим на главную
    router.push('/home')
  } else {
    // Если нет — ругаемся
    alert('Неверный логин или пароль. Проверь данные или зарегистрируйся заново.')
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
  padding-left: 20px;
  padding-right: 20px;
}

.auth-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  background-color: #0a0a0a;
  padding-top: 50px;
  padding-bottom: 40px;
  padding-left: 30px;
  padding-right: 30px;
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
  transition: 0.2s;
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
}

.auth-submit:hover {
  transform: translateY(-2px);
  background-color: #30b350;
}

.auth-footer {
  text-align: center;
  margin-top: 25px;
  color: #555;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #34c759;
  text-decoration: none;
  font-weight: 600;
}
</style>