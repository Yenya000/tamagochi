import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Обязательно: слэш в начале, название репозитория, слэш в конце
  base: '/tamagochi/' 
})