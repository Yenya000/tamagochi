<script setup>
import { useAuth } from '../composables/useAuth'
const { isAuthenticated, currentUser } = useAuth()
</script>

<template>
  <div class="home-page">
    <!-- Для тех, кто еще не зашел[cite: 27] -->
    <section v-if="!isAuthenticated" class="intro-hero">
      <h1 class="playfair-title">Поливай свои привычки</h1>
      <p>Твое дерево растет, когда ты читаешь, тренируешься или учишься.</p>
      <div class="slang-box">
        <p>Стань <strong>Хранителем</strong>, чтобы не дать саду засохнуть!</p>
      </div>
      <RouterLink :to="{ name: 'register' }" class="btn-primary">Создать Сад</RouterLink>
    </section>

    <!-- Для авторизованных пользователей -->
    <section v-else class="garden-view">
      <h2>Привет, Хранитель {{ currentUser?.name }}!</h2>
      <div class="tree-placeholder">
        <img src="https://placehold.co/400x500/edcba5/186623?text=🌳+ТВОЁ+ДЕРЕВО" alt="Модель дерева" />
      </div>
      <div class="daily-task">
        <p>Сегодня нужно полить ростки (выполнить привычки)</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page { padding: 60px 20px; text-align: center; }
.playfair-title { font-family: 'Playfair Display', serif; font-size: 3rem; color: #0d3612; }
.slang-box { margin: 20px 0; font-style: italic; color: #616161; }
.tree-placeholder img { border-radius: 32px; margin-top: 30px; border: 4px solid #F5F0E1; }
</style>