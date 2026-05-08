<template>
  <div class="home-wrapper">
    <div class="habit-card-base tree-card">
      <div class="header">
        <span class="habit-tag">{{ currentHabit?.name || 'Привычка' }}</span>
        <button @click="logout" class="text-btn">Выйти</button>
      </div>

      <div class="tree-display">
        <div class="tree-stage">
          <!-- Здесь позже будет твоя анимация растения -->
          <span class="emoji-tree">{{ treeEmoji }}</span>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-val">{{ score }}</span>
          <span class="stat-label">Очков</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">{{ level }}</span>
          <span class="stat-label">Уровень</span>
        </div>
      </div>

      <button class="main-button large" @click="doHabit">
        Я сделал это!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const score = ref(parseInt(localStorage.getItem('score')) || 0)
const currentHabit = ref(JSON.parse(localStorage.getItem('userHabit')))

const level = computed(() => Math.floor(score.value / 10) + 1)
const treeEmoji = computed(() => {
  if (level.value < 2) return '🌱'
  if (level.value < 5) return '🌿'
  return '🌳'
})

const doHabit = () => {
  score.value += 1
  localStorage.setItem('score', score.value)
}

const logout = () => {
  localStorage.removeItem('userToken')
  router.push('/login')
}
</script>

<style scoped>
.home-wrapper {
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}
.tree-card {
  max-width: 450px;
  width: 100%;
  text-align: center;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}
.habit-tag {
  background: var(--accent-color);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}
.tree-display {
  background: linear-gradient(180deg, var(--bg-color) 0%, var(--card-bg) 100%);
  border-radius: 30px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}
.emoji-tree {
  font-size: 5rem;
}
.stats-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}
.stat-val {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
}
.stat-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
}
.large {
  width: 100%;
  padding: 20px;
  font-size: 1.2rem;
}
.text-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}
</style>