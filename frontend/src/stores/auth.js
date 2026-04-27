import { ref, computed } from 'vue'

const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const isLoggedIn = ref(isBrowser ? !!localStorage.getItem('autowant_token') : false)
const adminUser = ref(isBrowser ? JSON.parse(localStorage.getItem('autowant_user') || 'null') : null)

export function useAuth() {
  const isAdmin = computed(() => isLoggedIn.value && adminUser.value)

  function login(id, password) {
    const accounts = [
      { id: 'wnwlgh', pw: 'wnwlgh', name: '관리자', role: '', avatar: '' },
      { id: 'autowant', pw: 'qwer1234!', name: '신선호', role: '대표', avatar: '/images/managers/Shin Seon-ho CEO.png' },
      { id: 'autowant2', pw: 'qwer1234!', name: '강재원', role: '이사', avatar: '/images/managers/Kang Jae-won Director.jpg' },
    ]
    const match = accounts.find(a => a.id === id && a.pw === password)
    if (match) {
      const user = { id: match.id, name: match.name, role: match.role, avatar: match.avatar }
      isLoggedIn.value = true
      adminUser.value = user
      if (isBrowser) {
        localStorage.setItem('autowant_token', 'admin-token')
        localStorage.setItem('autowant_user', JSON.stringify(user))
      }
      return { success: true }
    }
    return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  function logout() {
    isLoggedIn.value = false
    adminUser.value = null
    if (isBrowser) {
      localStorage.removeItem('autowant_token')
      localStorage.removeItem('autowant_user')
    }
  }

  return { isLoggedIn, adminUser, isAdmin, login, logout }
}
