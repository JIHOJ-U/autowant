import { ref, computed } from 'vue'

const managerList = ref([
  {
    id: 1, name: '신선호', role: '대표', experience: '15년',
    tags: ['경영총괄', '전략기획', '파트너십'],
    image: '',
    phone: '0507-1344-7898',
    isMVP: true,
    intro: '오토원트의 대표이사로서 회사의 전반적인 경영과 전략을 총괄하고 있습니다. 자동차 금융 업계에서 15년간 축적한 경험을 바탕으로 고객 중심의 서비스 혁신을 이끌어가고 있습니다.',
    detail: '렌트·리스 업계에서 다년간의 경력을 쌓으며 고객이 진정으로 원하는 서비스가 무엇인지 끊임없이 고민해왔습니다. 복잡한 절차와 불투명한 가격 구조를 개선하기 위해 오토원트를 설립하였으며, 20개 이상 금융사와의 파트너십을 통해 고객에게 최적의 조건을 제시하는 시스템을 구축했습니다.\n\n"고객의 성공이 곧 우리의 성공"이라는 경영 철학 아래, 투명하고 합리적인 자동차 금융 서비스를 제공하는 것을 목표로 하고 있습니다.',
  },
  {
    id: 2, name: '김오토', role: '이사', experience: '10년',
    tags: ['국산차', 'SUV', '법인리스'],
    image: '',
    phone: '010-1234-5678',
    isMVP: true,
    intro: '국산차 장기렌트 및 법인 리스 분야의 전문가로, 10년간 수천 건의 계약을 성사시키며 고객 맞춤형 솔루션을 제공해왔습니다.',
    detail: '현대·기아·제네시스 등 국산 브랜드 전 차종에 대한 깊은 이해를 바탕으로 고객의 예산과 용도에 맞는 최적의 차량과 금융 조건을 설계합니다. 특히 법인 고객의 세무·회계적 이점을 극대화하는 리스 구조 설계에 강점을 가지고 있습니다.\n\n고객 한 분 한 분의 상황을 꼼꼼히 분석하여, 단순한 차량 제공이 아닌 종합적인 모빌리티 컨설팅을 지향합니다.',
  },
  {
    id: 3, name: '이원트', role: '매니저', experience: '7년',
    tags: ['수입차', '세단', '장기렌트'],
    image: '',
    phone: '010-2345-6789',
    isMVP: true,
    intro: '수입차 장기렌트 전문 매니저로, 벤츠·BMW·제네시스 등 프리미엄 브랜드의 최저가 견적을 제공합니다.',
    detail: '수입차 시장의 복잡한 가격 체계와 옵션 구성을 명확하게 안내하여, 고객이 합리적인 선택을 할 수 있도록 돕습니다. 다수의 금융사 견적을 실시간으로 비교 분석하여 월 납입금을 최소화하는 조건을 찾아드립니다.',
  },
  {
    id: 4, name: '박딜러', role: '매니저', experience: '5년',
    tags: ['경차', '화물차', '즉시출고'],
    image: '',
    phone: '010-3456-7890',
    isMVP: true,
    intro: '경차부터 화물차, 승합차까지 폭넓은 차종에 대한 상담이 가능하며, 즉시출고 차량 배정을 전담하고 있습니다.',
    detail: '소형 사업장 및 개인사업자 고객을 위한 맞춤 상담에 특화되어 있습니다. 화물차·승합차 등 상용차량의 리스 조건 설계부터 보험·정비 관리까지 원스톱 서비스를 제공합니다.',
  },
])

const mvpManagers = computed(() => managerList.value.filter(m => m.isMVP))

export function useManagers() {
  function addManager(m) { managerList.value.push({ ...m, id: Date.now() }) }
  function updateManager(m) {
    const idx = managerList.value.findIndex(x => x.id === m.id)
    if (idx !== -1) managerList.value[idx] = { ...m }
  }
  function removeManager(id) { managerList.value = managerList.value.filter(m => m.id !== id) }
  function setMVP(id) {
    managerList.value.forEach(m => { m.isMVP = m.id === id })
  }
  return { managerList, mvpManagers, addManager, updateManager, removeManager, setMVP }
}
