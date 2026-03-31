import { ref } from 'vue'

export const inquiries = ref([
  { id: 1, name: '김철수', phone: '010-1234-5678', vehicle: '싼타페 하이브리드', carColor: '', email: '', availableTime: '', message: '리스 조건 알고 싶습니다', date: '2026-03-28', status: '대기', source: '문의하기' },
  { id: 2, name: '이영희', phone: '010-9876-5432', vehicle: 'GV70', carColor: '', email: '', availableTime: '', message: '48개월 렌트 견적 부탁드립니다', date: '2026-03-27', status: '대기', source: '문의하기' },
  { id: 3, name: '박민수', phone: '010-5555-1234', vehicle: '카니발 하이브리드', carColor: '', email: '', availableTime: '', message: '', date: '2026-03-26', status: '완료', source: '문의하기' },
  { id: 4, name: '정소영', phone: '010-3333-7777', vehicle: '캐스퍼', carColor: '', email: '', availableTime: '', message: '즉시출고 가능한가요?', date: '2026-03-25', status: '대기', source: '문의하기' },
  { id: 5, name: '홍길동', phone: '010-1111-2222', vehicle: '팰리세이드', carColor: '', email: '', availableTime: '', message: '법인 리스 문의합니다', date: '2026-03-24', status: '완료', source: '문의하기' },
])

export function addInquiry({ carType, carColor, name, phone, email, availableTime, message }) {
  const today = new Date().toISOString().slice(0, 10)
  const newId = inquiries.value.length ? Math.max(...inquiries.value.map(i => i.id)) + 1 : 1
  inquiries.value.unshift({
    id: newId,
    name,
    phone,
    vehicle: carType,
    carColor,
    email,
    availableTime,
    message,
    date: today,
    status: '대기',
    source: '회사소개',
  })
}
