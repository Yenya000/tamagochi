<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { currentUser, isAuthenticated, logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="app-wrapper">
    <header class="header">
      <div class="header-container">
        <RouterLink :to="{ name: 'home' }" class="logo-center">
          <span class="logo-text">🍀 HABIT GARDEN</span>
        </RouterLink>

        <div class="header-right">
          <template v-if="isAuthenticated">
            <div class="rewards">🏆 12</div>
            <span class="user-name">{{ currentUser?.name }}</span>
            <button @click="handleLogout" class="logout-btn">Выйти</button>
          </template>
          <template v-else>
            <RouterLink :to="{ name: 'login' }">Вход</RouterLink>
            <RouterLink :to="{ name: 'register' }" class="btn-primary">Начать</RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Стили из твоего Tiara Beauty[cite: 27, 29] */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 70px;
  background: #F5F0E1;
}
.logo-text {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: 1.5rem;
  color: #0d3612;
}
.user-name {
  font-weight: 600;
  margin: 0 15px;
}
</style>