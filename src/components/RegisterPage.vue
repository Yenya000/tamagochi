<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

function handleSubmit() {
  // Простая валидация по твоей логике из AdminAdd.vue
  if (form.email && form.password && form.name) {
    const result = register(form.email, form.password, form.name)
    if (result.success) {
      router.push({ name: 'home' })
    }
  }
}
</script>

<template>
  <div class="form-container">
    <div class="auth-card">
      <h3>Регистрация</h3>
      <p class="auth-subtitle">Начни выращивать полезные привычки сегодня</p>

      <div class="form-group">
        <label>Как тебя зовут?</label>
        <input v-model="form.name" type="text" placeholder="Имя" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="example@mail.com" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="form.password" type="password" placeholder="Придумайте пароль" />
      </div>

      <button @click="handleSubmit" class="btn-primary">Создать профиль</button>
      
      <div class="auth-footer">
        <span>Уже есть аккаунт?</span>
        <RouterLink :to="{ name: 'login' }">Войти</RouterLink>
      </div>
    </div>
  </div>
</template>