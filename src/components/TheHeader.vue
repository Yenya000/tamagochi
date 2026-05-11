<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="header-left" @click="handleLogoClick" style="cursor: pointer">
        <span class="logo-emoji">🌳</span>
        <span class="logo-title">TAMAGOCHI</span>
      </div>

      <nav v-if="authStore.isLoggedIn.value" class="header-right">
        <router-link to="/home" class="nav-link">Дерево</router-link>
        <router-link to="/select-habit" class="nav-link">Цели</router-link>
        <router-link to="/shop" class="nav-link">Магазин</router-link>
        
        <div class="nav-separator"></div>
        
        <div class="user-control">
          <span class="user-display">{{ authStore.user.value?.username }}</span>
          <button @click="handleExit" class="exit-button">Выйти</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { authStore, logout } from '../composables/useAuth'

const router = useRouter()

const handleLogoClick = () => {
  const user = authStore.user.value
  let hasHabits = false

  // Проверяем, выбраны ли привычки (есть ли они в массиве)
  if (user && user.habits && user.habits.length > 0) {
    hasHabits = true
  }

  if (authStore.isLoggedIn.value && hasHabits) {
    router.push('/home')
  } 
  else {
    router.push('/')
  }
}

const handleExit = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
.site-header {
  background-color: #000;
  border-bottom: 1px solid #1a1a1a;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-title {
  font-weight: 900;
  letter-spacing: 2px;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
}

.nav-link:hover, 
.router-link-active {
  color: #fff;
}

.nav-separator {
  width: 1px;
  height: 20px;
  background-color: #222;
}

.user-display {
  color: #34c759;
  font-size: 14px;
  margin-right: 15px;
  font-weight: 700;
}

.exit-button {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: color 0.2s;
}

.exit-button:hover {
  color: #ff4545;
}
</style>
