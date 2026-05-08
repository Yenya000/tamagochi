<template>
  <div class="shop-page">
    <div class="header">
      <h1>🛒 Магазин</h1>
      <p>Трать монеты на полезные предметы</p>
    </div>

    <div class="balance-card">
      <div class="balance-icon">💰</div>
      <div class="balance-info">
        <div class="balance-label">Твои монеты</div>
        <div class="balance-value">{{ user?.coins || 0 }}</div>
      </div>
    </div>

    <div class="items-list">
      <div class="item-card" :class="{ owned: user?.inventory?.wateringCan }">
        <div class="item-icon">💧</div>
        <div class="item-info">
          <div class="item-name">Волшебная лейка</div>
          <div class="item-desc">Восстанавливает увядшее дерево</div>
          <div class="item-price">50 🪙</div>
        </div>
        <button 
          class="buy-btn" 
          :disabled="user?.inventory?.wateringCan"
          @click="buy('wateringCan')"
        >
          {{ user?.inventory?.wateringCan ? '✅ Куплено' : 'Купить' }}
        </button>
      </div>
    </div>

    <div class="info-text">
      💡 Выполняй задачи — получай монеты. За 50 монет можно купить лейку!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHabitTracker, buyItem } from '../composables/useHabitTracker'

const { currentUser } = useHabitTracker()
const user = ref(null)

onMounted(() => {
  user.value = currentUser.value
})

const buy = (id) => {
  buyItem(id)
  user.value = currentUser.value
}
</script>

<style scoped>
.shop-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 20px 16px 80px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  color: #92400e;
  margin-bottom: 4px;
}

.header p {
  color: #b45309;
  font-size: 14px;
}

.balance-card {
  background: white;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.balance-icon {
  font-size: 48px;
}

.balance-info {
  flex: 1;
}

.balance-label {
  font-size: 14px;
  color: #6b7280;
}

.balance-value {
  font-size: 36px;
  font-weight: 800;
  color: #f59e0b;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.item-card.owned {
  opacity: 0.7;
  background: #f3f4f6;
}

.item-icon {
  font-size: 48px;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 18px;
  font-weight: 700;
  color: #374151;
}

.item-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #f59e0b;
  margin-top: 8px;
}

.buy-btn {
  padding: 10px 20px;
  background: #f59e0b;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.buy-btn:hover:not(:disabled) {
  background: #d97706;
  transform: scale(1.05);
}

.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-text {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255,255,255,0.7);
  border-radius: 16px;
  text-align: center;
  font-size: 13px;
  color: #92400e;
}
</style>