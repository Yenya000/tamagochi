import { authStore } from '../composables/useAuth'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: () => import('../components/WelcomePage.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/HomePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../components/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../components/RegisterPage.vue')
  },
  {
    path: '/select-habit',
    name: 'select-habit',
    component: () => import('../components/HabitSelection.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('../components/ShopPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = authStore.isLoggedIn.value
  
  // Если пользователь авторизован и пытается зайти на welcome, login или register - кидаем на home
  if (isAuth && (to.name === 'welcome' || to.name === 'login' || to.name === 'register')) {
    return next({ name: 'home' })
  }
  
  // Если не авторизован и пытается зайти на защищенную страницу - кидаем на login
  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: 'login' })
  }
  
  next()
})

export default router