import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import { useAuth } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
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
    path: '/organization',
    name: 'Organization',
    component: () => import('../views/OrganizationView.vue'),
  },
  {
    path: '/managers',
    name: 'Managers',
    component: () => import('../views/ManagersView.vue'),
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('../views/GuideView.vue'),
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../views/PrivacyView.vue'),
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
    path: '/autowant-admin-access',
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
