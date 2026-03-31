import { ref, computed } from 'vue'

const isLoggedIn = ref(!!localStorage.getItem('autowant_token'))
const adminUser = ref(JSON.parse(localStorage.getItem('autowant_user') || 'null'))

export function useAuth() {
  const isAdmin = computed(() => isLoggedIn.value && adminUser.value)

  function login(id, password) {
    // 간단한 하드코딩 인증 (추후 백엔드 연동)
    if (id === 'wnwlgh' && password === 'wnwlgh') {
      const user = { id: 'admin', name: '관리자' }
      isLoggedIn.value = true
      adminUser.value = user
      localStorage.setItem('autowant_token', 'admin-token')
      localStorage.setItem('autowant_user', JSON.stringify(user))
      return { success: true }
    }
    return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  function logout() {
    isLoggedIn.value = false
    adminUser.value = null
    localStorage.removeItem('autowant_token')
    localStorage.removeItem('autowant_user')
  }

  return { isLoggedIn, adminUser, isAdmin, login, logout }
}
