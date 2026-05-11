<template>
  <div class="shop-container">
    <div class="shop-header">
      <h2 class="title">Магазин</h2>
      <p class="balance-display">
        Твой баланс: 💎 {{ user?.crystals || 0 }}
      </p>
    </div>

    <div class="shop-section">
      <div class="items-grid">
        
        <div 
          v-if="!user?.rewards?.registration" 
          class="item-card bonus-card"
        >
          <div class="item-icon">🎁</div>
          <div class="item-info">
            <strong class="item-name">Приветственный бонус</strong>
            <p class="item-desc">За регистрацию в приложении</p>
          </div>
          <button 
            class="buy-button claim-btn" 
            @click="handleClaim('registration')"
          >
            50 💎
          </button>
        </div>

        <div 
          v-if="marathonAvailable && !hasClaimedCurrentMarathon" 
          class="item-card marathon-card"
        >
          <div class="item-icon">🏆</div>
          <div class="item-info">
            <strong class="item-name">Марафон пройден!</strong>
            <p class="item-desc">
              Цель в {{ user?.goalDays }} {{ user?.goalDays === 1 ? 'день' : 'дней' }} достигнута
            </p>
          </div>
          <button 
            class="buy-button claim-btn" 
            @click="handleMarathonReward"
          >
            {{ marathonRewardAmount }} 💎
          </button>
        </div>
        
      </div>
    </div>

    <div class="shop-section">
      <h3 class="section-tag">Предметы</h3>
      <div class="items-grid">
        <div class="item-card">
          <div class="item-icon">🚿</div>
          <div class="item-info">
            <strong class="item-name">Лейка</strong>
            <p class="item-desc">
              Восстанавливает завядшее дерево, если ты пропустила день
            </p>
          </div>
          <button 
            class="buy-button" 
            @click="handlePurchase('watering_can', 50)"
          >
            50 💎
          </button>
        </div>
      </div>
    </div>

    <!-- Уведомление -->
    <div v-if="notification.show" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { authStore } from '../composables/useAuth'
import { claimCrystalReward, buyItem } from '../composables/useHabitTracker'

const user = authStore.user

// Уведомления
const notification = ref({ show: false, message: '', type: '' })

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 2000)
}

// Расчет доступности марафона
const marathonAvailable = computed(() => {
  let isAvailable = false
  
  if (user.value && user.value.goalStartDate && user.value.isCycleCompleted) {
    isAvailable = true
  }
  
  return isAvailable
})

// Сумма награды за марафон
const marathonRewardAmount = computed(() => {
  const goalDays = user.value?.goalDays
  let amount = 0

  if (goalDays === 1) {
    amount = 10
  } else if (goalDays === 7) {
    amount = 50
  } else if (goalDays === 30) {
    amount = 150
  } else if (goalDays === 90) {
    amount = 300
  }
  
  return amount
})

// Проверка забора награды
const hasClaimedCurrentMarathon = computed(() => {
  let alreadyClaimed = false
  
  if (user.value && user.value.rewards) {
    const goalKey = 'marathon' + user.value.goalDays
    if (user.value.rewards[goalKey] === true) {
      alreadyClaimed = true
    }
  }
  
  return alreadyClaimed
})

// Обработка кликов
const handleClaim = (type) => {
  let claimSuccess = false
  let rewardAmount = 0
  
  if (type === 'registration') {
    rewardAmount = 50
    claimSuccess = claimCrystalReward(rewardAmount)
  }
  
  if (claimSuccess) {
    showNotification('Кристаллы получены!', 'success')
  } else {
    showNotification('Награда уже получена', 'error')
  }
}

const handleMarathonReward = () => {
  let claimSuccess = false
  const goalType = 'marathon' + user.value.goalDays
  const amount = marathonRewardAmount.value
  
  if (amount > 0) {
    claimSuccess = claimCrystalReward(amount)
  }
  
  if (claimSuccess) {
    showNotification('Бонус за марафон зачислен!', 'success')
  } else {
    showNotification('Награда уже получена или недоступна', 'error')
  }
}

const handlePurchase = (id, cost) => {
  const isBought = buyItem(id, cost)
  
  if (isBought) {
    showNotification('Предмет куплен!', 'success')
  } else {
    showNotification('Недостаточно кристаллов!', 'error')
  }
}
</script>

<style scoped>
.shop-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background-color: var(--bg-color, #000);
  min-height: 100vh;
}

.shop-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  color: var(--text-main, #fff);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.balance-display {
  color: var(--accent-color, #34c759);
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.shop-section {
  margin-bottom: 40px;
}

.section-tag {
  color: var(--text-secondary, #444);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 20px;
}

.items-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background-color: var(--card-bg, #0a0a0a);
  border: 1px solid var(--border-color, #1a1a1a);
  border-radius: 24px;
}

.bonus-card {
  border-color: rgba(52, 199, 89, 0.3);
}

.marathon-card {
  background-image: linear-gradient(90deg, #0a0a0a 0%, #0d1a0d 100%);
  border-color: var(--accent-color, #34c759);
}

.item-icon {
  font-size: 2.5rem;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  color: var(--text-main, #fff);
  font-size: 1.2rem;
  display: block;
}

.item-desc {
  color: var(--text-secondary, #555);
  font-size: 0.9rem;
  margin-top: 5px;
  margin-bottom: 0;
}

.buy-button {
  background-color: var(--accent-color, #34c759);
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 800;
  cursor: pointer;
  transition-duration: 0.2s;
  white-space: nowrap;
}

.claim-btn {
  background-color: #ffffff;
  color: #000000;
}

.buy-button:hover {
  transform: scale(1.05);
}

.notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 30px;
  background-color: var(--card-bg, #1a1a1a);
  color: var(--text-main, #fff);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

.notification.success {
  background-color: #34c759;
  color: white;
}

.notification.error {
  background-color: #ff3b30;
  color: white;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>