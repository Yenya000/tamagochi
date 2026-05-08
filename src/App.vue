<template>
  <header class="main-header glass-card">
    <div class="header-content">
      <!-- Логотип виден всегда -->
      <div class="logo" @click="goHome">
        <span class="logo-icon">🌳</span>
        <span class="logo-text">Tamagochi</span>
      </div>

      <!-- Навигация видна только если пользователь авторизован -->
      <nav v-if="isAuthenticated" class="header-nav">
        <router-link to="/home" class="nav-link">Дерево</router-link>
        <router-link to="/select-habit" class="nav-link">Привычка</router-link>
        <div class="user-profile">
          <span class="user-name">{{ userName }}</span>
          <button @click="logout" class="logout-btn">Выйти</button>
        </div>
      </nav>
    </div>
  </header>

  <!-- Сюда подставляются страницы: Welcome, Login, Home и т.д. -->
  <main class="page-container">
    <router-view />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Проверка авторизации в реальном времени
const isAuthenticated = computed(() => !!localStorage.getItem('userToken'))
const userName = computed(() => {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  return user ? user.email.split('@')[0] : 'Профиль'
})

const goHome = () => {
  if (isAuthenticated.value) {
    router.push('/home')
  } else {
    router.push('/')
  }
}

const logout = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('currentUser')
  router.push('/')
}
</script>

<style scoped>
.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 1000;
  border-radius: 0 0 24px 24px; /* Округлость только снизу */
  margin: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon { font-size: 1.8rem; }
.logo-text { font-weight: 800; font-size: 1.2rem; color: var(--accent-color); }

.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-main);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover, .router-link-active {
  color: var(--accent-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  padding-left: 20px;
  border-left: 1px solid var(--border-color);
}

.user-name { font-size: 0.9rem; font-weight: 600; }

.logout-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 6px 12px;
  border-radius: 12px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}

.page-container {
  margin-top: 90px; /* Отступ, чтобы контент не залезал под шапку */
  padding: 20px;
}
</style>