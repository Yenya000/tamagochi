<template>
  <div class="shop-container">
    <div class="shop-header">
      <h2 class="title">Магазин</h2>
      <p class="balance-display">
        Твой баланс: 💎 {{ user?.crystals || 0 }}
      </p>
    </div>

    <div class="shop-section">
      <h3 class="section-tag">Достижения</h3>
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
              Цель в {{ user?.goalDays }} дней достигнута
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { authStore } from '../composables/useAuth'
import { claimCrystalReward, buyItem } from '../composables/useHabitTracker'

const user = authStore.user

// Расчет доступности марафона
const marathonAvailable = computed(() => {
  let isAvailable = false
  
  if (user.value && user.value.goalStartDate) {
    const start = new Date(user.value.goalStartDate)
    const today = new Date()
    const diffTime = Math.abs(today - start)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays >= (user.value.goalDays || 0)) {
      isAvailable = true
    } else {
      isAvailable = false
    }
  }
  
  return isAvailable
})

// Сумма награды за марафон
const marathonRewardAmount = computed(() => {
  const g = user.value?.goalDays
  let amount = 0

  if (g === 7) {
    amount = 50
  } 
  else if (g === 30) {
    amount = 150
  } 
  else if (g === 90) {
    amount = 300
  } 
  else {
    amount = 0
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
    } else {
      alreadyClaimed = false
    }
  }
  
  return alreadyClaimed
})

// Обработка кликов
const handleClaim = (type) => {
  const success = claimCrystalReward(type)
  if (success) {
    alert('Кристаллы получены!')
  }
}

const handleMarathonReward = () => {
  const goalType = 'marathon' + user.value.goalDays
  const success = claimCrystalReward(goalType)
  if (success) {
    alert('Бонус за марафон зачислен!')
  }
}

const handlePurchase = (id, cost) => {
  const isBought = buyItem(id, cost)
  if (isBought) {
    alert('Предмет куплен!')
  } else {
    alert('Недостаточно кристаллов!')
  }
}
</script>

<style scoped>
.shop-container {
  max-width: 800px;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #000;
  min-height: 100vh;
}

.shop-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.balance-display {
  color: #34c759;
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.shop-section {
  margin-bottom: 40px;
}

.section-tag {
  color: #444;
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
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
  background-color: #0a0a0a;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-style: solid;
  border-color: #1a1a1a;
  border-radius: 24px;
}

.bonus-card {
  border-top-color: rgba(52, 199, 89, 0.3);
  border-bottom-color: rgba(52, 199, 89, 0.3);
  border-left-color: rgba(52, 199, 89, 0.3);
  border-right-color: rgba(52, 199, 89, 0.3);
}

.marathon-card {
  background-image: linear-gradient(90deg, #0a0a0a 0%, #0d1a0d 100%);
  border-top-color: #34c759;
  border-bottom-color: #34c759;
  border-left-color: #34c759;
  border-right-color: #34c759;
}

.item-icon {
  font-size: 2.5rem;
}

.item-info {
  flex-grow: 1;
}

.item-name {
  color: #fff;
  font-size: 1.2rem;
  display: block;
}

.item-desc {
  color: #555;
  font-size: 0.9rem;
  margin-top: 5px;
  margin-bottom: 0;
}

.buy-button {
  background-color: #34c759;
  color: #fff;
  border-top-style: none;
  border-bottom-style: none;
  border-left-style: none;
  border-right-style: none;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 24px;
  padding-right: 24px;
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
</style>