<template>
  <div id="app">
    <TheHeader />

    <main class="content-wrapper">
      <router-view />
    </main>

    <div class="debug-overlay" v-if="debugVisible">
      <div class="debug-content">
        <div class="debug-header">
          <h3>🛠 Tamagochi Debug</h3>
          <button class="close-btn" @click="debugVisible = false">×</button>
        </div>
        
        <div class="debug-body">
          <div class="debug-section">
            <span class="label">Текущий:</span>
            <span :class="authStore.user.value ? 'text-green' : 'text-red'">
              {{ authStore.user.value ? authStore.user.value.username : 'НИКОГО' }}
            </span>
          </div>
          
          <div class="debug-section">
            <span class="label">База юзеров:</span>
            <div class="user-list">
              <div v-for="u in allUsers" :key="u.email" class="user-row">
                <span>{{ u.username }}</span>
                <button @click="removeUser(u.email)" class="btn-del">Удалить</button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="debug-footer">
          <button @click="nukeAll" class="btn-nuke">СБРОСИТЬ ВСЁ</button>
        </div>
      </div>
    </div>

    <button class="debug-trigger" @click="debugVisible = !debugVisible">🛠</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import { authStore } from './composables/useAuth'

const debugVisible = ref(false)
const allUsers = ref([])

// Загружаем список всех юзеров для админки
function refreshUserList() {
  const data = JSON.parse(localStorage.getItem('habit_users') || '[]')
  allUsers.value = data
}

onMounted(function() {
  refreshUserList()
})

function removeUser(email) {
  if (confirm(`Удалить пользователя с почтой ${email}?`)) {
    const data = JSON.parse(localStorage.getItem('habit_users') || '[]')
    const filtered = data.filter(function(u) {
      return u.email !== email
    })
    
    localStorage.setItem('habit_users', JSON.stringify(filtered))
    refreshUserList()
    
    // Если удалили сами себя — выходим
    if (authStore.user.value && authStore.user.value.email === email) {
      localStorage.removeItem('tamagochi_user')
      window.location.reload()
    }
  }
}

function nukeAll() {
  if (confirm('Это удалит ВСЕ данные. Уверена?')) {
    localStorage.clear()
    window.location.reload()
  }
}
</script>

<style>
/* Оставляю ТВОИ стили полностью без изменений */
:root {
  --accent-color: #34c759;
}

body {
  margin: 0;
  background-color: #000;
  color: #fff;
  font-family: sans-serif;
}

.content-wrapper {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.debug-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #222;
  border: 1px solid #444;
  color: white;
  z-index: 9999;
  cursor: pointer;
}

.debug-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.debug-content {
  background-color: #111;
  padding: 25px;
  border-radius: 24px;
  width: 350px;
  border: 1px solid #333;
  color: #0f0;
  font-family: monospace;
}

.debug-header { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 20px; 
}

.close-btn { 
  background: none; 
  border: none; 
  color: #fff; 
  font-size: 24px; 
  cursor: pointer; 
}

.user-row { 
  display: flex; 
  justify-content: space-between; 
  padding: 5px 0; 
  border-bottom: 1px solid #222; 
}

.btn-del { 
  background: #400; 
  color: #f44; 
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 
  padding: 2px 8px;
}

.btn-nuke { 
  background: #600; 
  color: white; 
  width: 100%; 
  padding: 10px; 
  border-radius: 10px; 
  border: none; 
  cursor: pointer; 
  margin-top: 20px; 
  font-weight: 800;
}

.text-green { color: #0f0; }
.text-red { color: #f00; }
.label { color: #888; font-size: 0.8rem; margin-right: 10px; }
</style>