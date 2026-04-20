import { ref, computed } from 'vue'

const API = import.meta.env.VITE_API_URL || ''

export const inquiries = ref([])
export const notifications = ref([])
export const unreadCount = computed(() => inquiries.value.filter(i => !i.read).length)

// 서버에서 문의 목록 불러오기
export async function fetchInquiries() {
  try {
    const res = await fetch(`${API}/api/inquiries`)
    if (res.ok) inquiries.value = await res.json()
  } catch (e) {
    // 서버 연결 안 되면 localStorage 폴백
    const saved = JSON.parse(localStorage.getItem('autowant_inquiries') || '[]')
    inquiries.value = saved
  }
}

export async function addInquiry({ carType, carColor, name, phone, email, availableTime, message, manager, source }) {
  const data = {
    name,
    phone,
    vehicle: carType || '',
    carColor: carColor || '',
    email: email || '',
    availableTime: availableTime || '',
    message: message || '',
    manager: manager || '',
    source: source || '문의하기',
  }

  try {
    const res = await fetch(`${API}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const inquiry = await res.json()
      inquiries.value.unshift(inquiry)
    }
  } catch (e) {
    // 서버 연결 안 되면 로컬 저장
    const newId = inquiries.value.length ? Math.max(...inquiries.value.map(i => i.id)) + 1 : 1
    const inquiry = {
      id: newId,
      ...data,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      status: '대기',
      read: false,
    }
    inquiries.value.unshift(inquiry)
    localStorage.setItem('autowant_inquiries', JSON.stringify(inquiries.value))
  }

  // 알림
  const notiId = Date.now()
  const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  notifications.value.push({
    id: notiId,
    title: '새 문의가 접수되었습니다',
    desc: `${name}님 - ${carType || '차량 미정'}`,
    time: timeStr,
  })
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== notiId)
  }, 5000)
}

export async function markAsRead(id) {
  const item = inquiries.value.find(i => i.id === id)
  if (item) item.read = true
  try {
    await fetch(`${API}/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true }),
    })
  } catch (e) {}
}

export async function markAllAsRead() {
  inquiries.value.forEach(i => { i.read = true })
  try {
    await fetch(`${API}/api/inquiries-read-all`, { method: 'PATCH' })
  } catch (e) {}
}

export async function removeInquiry(id) {
  inquiries.value = inquiries.value.filter(i => i.id !== id)
  try {
    await fetch(`${API}/api/inquiries/${id}`, { method: 'DELETE' })
  } catch (e) {}
}
