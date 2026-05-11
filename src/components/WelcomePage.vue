<template>
  <div class="welcome-wrapper">
    <div class="logic-block welcome-container">
      <div class="logo-area">
        <span class="logo-emoji">🌳</span>
        <h1 class="brand-name">TAMAGOCHI HABIT</h1>
      </div>
      
      <p class="motto">Расти над собой. <br> Вырасти дерево вместе со своей привычкой.</p>
      
      <div class="action-buttons">
        <button class="main-button primary" @click="router.push('/login')">ВОЙТИ</button>
        <button class="main-button secondary" @click="router.push('/register')">РЕГИСТРАЦИЯ</button>
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
  min-height: 85vh; /* Чуть уменьшила, чтобы не прилипало к краям */
}

/* Логическое окно по твоему стилю */
.logic-block {
  background-color: #0a0a0a;
  border-top: 1px solid #1a1a1a;
  border-bottom: 1px solid #1a1a1a;
  border-left: 1px solid #1a1a1a;
  border-right: 1px solid #1a1a1a;
  border-radius: 16px;
}

.welcome-container {
  max-width: 400px;
  width: 100%;
  text-align: center;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.logo-emoji {
  font-size: 5rem;
  display: block;
  margin-bottom: 10px;
}

.brand-name {
  font-size: 1.8rem;
  margin: 0;
  letter-spacing: 4px;
  font-weight: 900;
  color: #ffffff;
}

.motto {
  color: #666666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 30px 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* Основные кнопки в твоем стиле */
.main-button {
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: 0.2s;
}

.primary {
  background-color: #ffffff;
  color: #000000;
  border: none;
}

.primary:hover {
  background-color: #34c759;
  color: #ffffff;
}

.secondary {
  background: transparent;
  border: 1px solid #222222;
  color: #ffffff;
}

.secondary:hover {
  border-color: #34c759;
  color: #34c759;
}
</style>