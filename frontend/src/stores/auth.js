import { ref, computed } from 'vue'

const isLoggedIn = ref(!!localStorage.getItem('autowant_token'))
const adminUser = ref(JSON.parse(localStorage.getItem('autowant_user') || 'null'))

export function useAuth() {
  const isAdmin = computed(() => isLoggedIn.value && adminUser.value)

  function login(id, password) {
    // 간단한 하드코딩 인증 (추후 백엔드 연동)
    const accounts = [
      { id: 'wnwlgh', pw: 'wnwlgh', name: '관리자', role: '' },
      { id: 'autowant', pw: 'qwer1234!', name: '신선호', role: '대표' },
      { id: 'autowant2', pw: 'qwer1234!', name: '강재원', role: '이사' },
    ]
    const match = accounts.find(a => a.id === id && a.pw === password)
    if (match) {
      const user = { id: match.id, name: match.name, role: match.role }
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
