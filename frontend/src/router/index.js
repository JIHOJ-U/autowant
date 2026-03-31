import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/monthly-special',
    name: 'MonthlySpecial',
    component: () => import('../views/MonthlySpecialView.vue'),
  },
  {
    path: '/immediate-stock',
    name: 'ImmediateStock',
    component: () => import('../views/ImmediateStockView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/managers',
    name: 'Managers',
    component: () => import('../views/ManagersView.vue'),
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue'),
  },
  {
    path: '/reviews/write',
    name: 'ReviewWrite',
    component: () => import('../views/ReviewWriteView.vue'),
  },
  {
    path: '/reviews/:id',
    name: 'ReviewDetail',
    component: () => import('../views/ReviewDetailView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const { isAdmin } = useAuth()
    if (!isAdmin.value) {
      return { name: 'Login' }
    }
  }
})

export default router
