import { ref, computed } from 'vue'

export const inquiries = ref([])

// 알림 리스트
export const notifications = ref([])

// 읽지 않은 문의 수
export const unreadCount = computed(() => inquiries.value.filter(i => !i.read).length)

export function addInquiry({ carType, carColor, name, phone, email, availableTime, message, manager, source }) {
  const today = new Date().toISOString().slice(0, 10)
  const now = new Date()
  const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  const newId = inquiries.value.length ? Math.max(...inquiries.value.map(i => i.id)) + 1 : 1
  inquiries.value.unshift({
    id: newId,
    name,
    phone,
    vehicle: carType || '',
    carColor,
    email,
    availableTime,
    message,
    manager: manager || '',
    date: today,
    status: '대기',
    source: source || '문의하기',
    read: false,
    time: timeStr,
  })

  // 알림 추가
  const notiId = Date.now()
  notifications.value.push({
    id: notiId,
    title: '새 문의가 접수되었습니다',
    desc: `${name}님 - ${carType || '차량 미정'}`,
    time: timeStr,
  })

  // 5초 후 자동 제거
  setTimeout(() => {
    notifications.value = notifications.value.filter(n => n.id !== notiId)
  }, 5000)
}

export function markAsRead(id) {
  const item = inquiries.value.find(i => i.id === id)
  if (item) item.read = true
}

export function markAllAsRead() {
  inquiries.value.forEach(i => { i.read = true })
}

export function removeInquiry(id) {
  inquiries.value = inquiries.value.filter(i => i.id !== id)
}
