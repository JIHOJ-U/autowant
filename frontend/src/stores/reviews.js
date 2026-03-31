import { ref } from 'vue'

const reviewList = ref([
  {
    id: 1, name: '김민준', vehicle: '싼타페 하이브리드', date: '2026.03', rating: 5,
    title: '비교 끝에 선택한 오토원트, 확실히 달랐습니다',
    thumbnail: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80',
    tags: ['친절한 상담', '빠른 출고'],
    blocks: [
      { type: 'text', content: '차를 바꿔야겠다 싶어서 여러 곳에 견적을 넣어봤습니다. 다른 곳은 상담부터 복잡하고 숨겨진 비용이 많았는데, 오토원트는 처음부터 투명하게 안내해주셔서 신뢰가 갔습니다.' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80', caption: '출고 당일 차량 사진' },
      { type: 'text', content: '매니저님이 제 예산에 맞는 조건을 3가지나 비교해서 정리해주셨고, 최종적으로 48개월 장기렌트로 계약했습니다. 월 납입금도 다른 곳보다 확실히 저렴했어요.' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', caption: '계약서 서명 후' },
      { type: 'text', content: '출고까지 2주밖에 안 걸렸고, 인수 과정도 깔끔했습니다. 다음에도 무조건 오토원트 이용할 예정입니다!' },
    ],
  },
  {
    id: 2, name: '이서연', vehicle: 'GV70', date: '2026.02', rating: 5,
    title: '제네시스 GV70 리스, 매니저님 덕분에 만족',
    thumbnail: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80',
    tags: ['꼼꼼한 비교', '합리적 가격'],
    blocks: [
      { type: 'text', content: '수입차를 알아보다가 제네시스 GV70으로 방향을 틀었는데, 오토원트 매니저님이 조건 비교를 정말 꼼꼼하게 해주셨습니다.' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80', caption: 'GV70 실물' },
      { type: 'text', content: '견적서도 PDF로 깔끔하게 보내주시고, 궁금한 건 카톡으로 바로바로 답변해주셔서 편했습니다. 만족도 200%입니다!' },
    ],
  },
  {
    id: 3, name: '박준혁', vehicle: '카니발 하이브리드', date: '2026.01', rating: 4,
    title: '법인 리스 서류부터 출고까지 원스톱!',
    thumbnail: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&q=80',
    tags: ['법인 리스', '간편한 절차'],
    blocks: [
      { type: 'text', content: '법인 리스라 서류가 복잡할 줄 알았는데, 필요한 서류 목록을 미리 정리해주시고 하나하나 안내해주셔서 한 번에 끝났습니다.' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80', caption: '카니발 하이브리드' },
      { type: 'text', content: '바쁜 사업자에게 이런 원스톱 서비스는 정말 시간을 아껴줍니다. 추천합니다.' },
    ],
  },
])

export function useReviews() {
  function addReview(r) {
    reviewList.value.unshift({ ...r, id: Date.now() })
  }

  function updateReview(r) {
    const idx = reviewList.value.findIndex(x => x.id === r.id)
    if (idx !== -1) reviewList.value[idx] = { ...r }
  }

  function removeReview(id) {
    reviewList.value = reviewList.value.filter(r => r.id !== id)
  }

  return { reviewList, addReview, updateReview, removeReview }
}
