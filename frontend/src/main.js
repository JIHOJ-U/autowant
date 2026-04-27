import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { routes, SITE, DEFAULT_DESCRIPTION } from './router/routes'
import { vReveal } from './directives/scrollReveal'
import { useAuth } from './stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (to.meta?.requiresAuth) {
    const { isAdmin } = useAuth()
    if (!isAdmin.value) return { name: 'Login' }
  }
})

router.afterEach((to) => {
  if (typeof document === 'undefined') return
  const title = to.meta?.title || '오토원트'
  const description = to.meta?.description || DEFAULT_DESCRIPTION
  const url = SITE + to.fullPath.split('?')[0]
  const robots = to.meta?.noIndex ? 'noindex, nofollow' : 'index, follow'

  document.title = title
  setMeta('description', description)
  setMeta('og:title', title, 'property')
  setMeta('og:description', description, 'property')
  setMeta('og:url', url, 'property')
  setMeta('robots', robots)
  setLink('canonical', url)
})

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.directive('reveal', vReveal)
app.mount('#app')
