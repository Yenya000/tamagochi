import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router' // Импортируем логику переключения страниц

const app = createApp(App)

app.use(router) // Подключаем роутер к Vue
app.mount('#app')