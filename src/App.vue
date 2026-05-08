<template>
  <div id="app">
    <nav v-if="$route.meta.requiresAuth" class="bottom-nav">
      <router-link to="/home" class="nav-link">
        <span class="nav-icon">🌳</span>
        <span>Главная</span>
      </router-link>
      <router-link to="/tasks" class="nav-link">
        <span class="nav-icon">✅</span>
        <span>Задачи</span>
      </router-link>
      <router-link to="/shop" class="nav-link">
        <span class="nav-icon">🛒</span>
        <span>Магазин</span>
      </router-link>
      <button @click="logout" class="nav-link logout-btn">
        <span class="nav-icon">🚪</span>
        <span>Выйти</span>
      </button>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useHabitTracker } from './composables/useHabitTracker'

const router = useRouter()
const { logout: userLogout } = useHabitTracker()

const logout = () => {
  userLogout()
  router.push('/login')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: system-ui, 'Segoe UI', sans-serif;
}

body {
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 12px 16px 20px;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: #888;
  font-size: 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-icon {
  font-size: 24px;
}

.nav-link:hover {
  color: #3b82f6;
}

.router-link-active {
  color: #3b82f6;
}

.logout-btn:hover {
  color: #ef4444;
}
</style>