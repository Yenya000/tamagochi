<template>
  <div class="welcome-wrapper">
    <div class="habit-card-base welcome-container">
      <div class="logo-area">
        <span class="logo-emoji">🌳</span>
        <h1 class="brand-name">Tamagochi Habit</h1>
      </div>
      
      <p class="motto">Расти над собой. <br> Вырасти дерево вместе со своей привычкой.</p>
      
      <div class="action-buttons">
        <button class="main-button primary" @click="router.push('/login')">Войти</button>
        <button class="main-button secondary" @click="router.push('/register')">Регистрация</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.welcome-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
}
.welcome-container {
  max-width: 400px;
  width: 100%;
  text-align: center;
  padding: 40px;
}
.logo-emoji {
  font-size: 5rem;
  display: block;
  margin-bottom: 10px;
}
.brand-name {
  font-size: 2rem;
  margin: 0;
  color: var(--accent-color);
}
.motto {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 30px 0;
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.primary { width: 100%; font-size: 1.1rem; }
.secondary { 
  width: 100%; 
  background: transparent; 
  border: 2px solid var(--accent-color); 
  color: var(--accent-color); 
}
.secondary:hover { background: var(--accent-color); color: white; }
</style>