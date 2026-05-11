import { authStore } from '../composables/useAuth'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: function() {
      return import('../components/WelcomePage.vue')
    }
  },
  {
    path: '/home',
    name: 'home',
    component: function() {
      return import('../components/HomePage.vue')
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: function() {
      return import('../components/LoginPage.vue')
    }
  },
  {
    path: '/register',
    name: 'register',
    component: function() {
      return import('../components/RegisterPage.vue')
    }
  },
  {
    path: '/select-habit',
    name: 'select-habit',
    component: function() {
      return import('../components/HabitSelection.vue')
    },
    meta: { requiresAuth: true }
  },
  {
    path: '/shop',
    name: 'shop',
    component: function() {
      return import('../components/ShopPage.vue')
    },
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),  // <-- ЭТО ДЛЯ GITHUB PAGES
  routes
})

router.beforeEach(function(to, from, next) {
  const isAuth = authStore.isLoggedIn.value
  
  // 1. Если идем на защищенную страницу без авторизации -> на логин
  if (to.meta.requiresAuth === true && isAuth === false) {
    return next({ name: 'login' })
  } 
  
  // 2. Если залогинены и пытаемся зайти на логин/регистрацию -> на главную
  if ((to.name === 'login' || to.name === 'register') && isAuth === true) {
    return next({ name: 'home' })
  } 

  next()
})

export default router