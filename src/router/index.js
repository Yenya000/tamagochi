import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '../components/WelcomePage.vue' // Наша новая страница
import LoginPage from '../components/LoginPage.vue'
import RegisterPage from '../components/RegisterPage.vue'
import HabitSelection from '../components/HabitSelection.vue'
import HomePage from '../components/HomePage.vue'

const routes = [
  { path: '/', name: 'welcome', component: WelcomePage }, // Главный вход
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/register', name: 'register', component: RegisterPage },
  { 
    path: '/select-habit', 
    name: 'select-habit', 
    component: HabitSelection,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/home', 
    name: 'home', 
    component: HomePage,
    meta: { requiresAuth: true } 
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('userToken')
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})