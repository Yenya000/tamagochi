import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../components/RegisterView.vue'
import LoginView from '../components/LoginView.vue'
import HomeView from '../components/HomeView.vue'
import TasksView from '../components/TasksView.vue'
import ShopView from '../components/ShopView.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/register', name: 'Register', component: RegisterView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/tasks', name: 'Tasks', component: TasksView, meta: { requiresAuth: true } },
  { path: '/shop', name: 'Shop', component: ShopView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const loggedIn = !!localStorage.getItem('currentUser')
  if(to.meta.requiresAuth && !loggedIn) next('/login')
  else next()
})

export default router