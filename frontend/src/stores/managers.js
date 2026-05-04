import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'autowant_manager_overrides_v1'

const seed = [
  {
    id: 1, name: '신선호', role: '대표', experience: '15년',
    tags: ['경영총괄', '전략기획', '파트너십'],
    image: '/images/managers/Shin Seon-ho CEO.png',
    phone: '0507-1344-7898',
    isMVP: true,
    intro: '오토원트의 대표이사로서 회사의 전반적인 경영과 전략을 총괄하고 있습니다. 자동차 금융 업계에서 15년간 축적한 경험을 바탕으로 고객 중심의 서비스 혁신을 이끌어가고 있습니다.',
    detail: '렌트·리스 업계에서 다년간의 경력을 쌓으며 고객이 진정으로 원하는 서비스가 무엇인지 끊임없이 고민해왔습니다. 복잡한 절차와 불투명한 가격 구조를 개선하기 위해 오토원트를 설립하였으며, 20개 이상 금융사와의 파트너십을 통해 고객에게 최적의 조건을 제시하는 시스템을 구축했습니다.\n\n"고객의 성공이 곧 우리의 성공"이라는 경영 철학 아래, 투명하고 합리적인 자동차 금융 서비스를 제공하는 것을 목표로 하고 있습니다.',
  },
  {
    id: 2, name: '강재원', role: '이사', experience: '12년',
    tags: ['총괄이사', '법인영업', '파트너십'],
    image: '/images/managers/Kang Jae-won Director.jpg',
    phone: '010-1111-1111',
    isMVP: true,
    intro: '오토원트 총괄 이사로서 영업 전반을 책임지고 있으며, 12년간 자동차 금융 업계에서 다양한 경험을 쌓아왔습니다.',
    detail: '법인 및 개인 고객을 아우르는 폭넓은 영업 네트워크를 보유하고 있으며, 금융사·제조사와의 긴밀한 파트너십을 통해 고객에게 최상의 조건을 제시합니다.\n\n고객 한 분 한 분의 니즈를 정확히 파악하여 맞춤형 솔루션을 제공하는 것을 최우선으로 합니다.',
  },
  {
    id: 3, name: '전호형', role: '매니저', experience: '5년',
    tags: ['SUV', '대형차', '패밀리카'],
    image: '/images/managers/Jeon Ho-hyoung Manager.jpg',
    phone: '010-5555-5555',
    isMVP: true,
    intro: '패밀리 SUV 및 대형 차량 전문 매니저로, 가족 단위 고객의 니즈에 맞는 차량을 추천해드립니다.',
    detail: '카니발, 팰리세이드, 쏘렌토 등 인기 패밀리카 전반에 대한 깊은 이해를 바탕으로 안전하고 실용적인 차량을 제안합니다.',
  },
  {
    id: 4, name: '김재원', role: '매니저', experience: '7년',
    tags: ['국산차', '세단', '장기렌트'],
    image: '/images/managers/Kim Jae-won Manager.jpg',
    phone: '010-2222-2222',
    isMVP: true,
    intro: '국산차 장기렌트 전문 매니저로, 현대·기아·제네시스 차종에 대한 깊은 이해를 바탕으로 합리적인 견적을 제공합니다.',
    detail: '복잡한 금융 구조를 누구나 이해할 수 있도록 명확하게 설명드리며, 고객의 예산과 라이프스타일에 맞는 최적의 조건을 찾아드립니다.',
  },
  {
    id: 5, name: '황유찬', role: '매니저', experience: '4년',
    tags: ['상용차', '화물차', '법인'],
    image: '/images/managers/Hwang Yu-chan Manager.png',
    phone: '010-8888-8888',
    isMVP: true,
    intro: '상용차 및 화물차 전문 매니저로, 개인사업자와 법인 고객의 사업용 차량을 전담하고 있습니다.',
    detail: '포터, 봉고 등 소형 화물차부터 대형 트럭까지 사업 규모에 맞는 차량을 추천하며, 보험·정비 관리까지 원스톱 서비스를 제공합니다.',
  },
  {
    id: 6, name: '김태인', role: '매니저', experience: '6년',
    tags: ['수입차', 'SUV', '법인리스'],
    image: '/images/managers/Kim Tae-in Manager.jpg',
    phone: '010-3333-3333',
    isMVP: true,
    intro: '수입차 및 법인 리스 전문가로, 벤츠·BMW·아우디 등 프리미엄 브랜드의 최저가 견적을 제공합니다.',
    detail: '법인 고객의 세무·회계적 이점을 극대화하는 리스 구조 설계에 강점을 가지고 있으며, 다수의 금융사 견적을 실시간으로 비교하여 최적 조건을 안내합니다.',
  },
  {
    id: 7, name: '장효준', role: '매니저', experience: '5년',
    tags: ['전기차', '하이브리드', '신차'],
    image: '/images/managers/Jang Hyo-jun Manager.jpg',
    phone: '010-4444-4444',
    isMVP: true,
    intro: '전기차·하이브리드 차종 전문 매니저로, 친환경 차량의 보조금과 혜택까지 꼼꼼히 안내해드립니다.',
    detail: '아이오닉, EV6, 테슬라 등 전기차 모델 전반에 대한 풍부한 지식을 바탕으로 충전 인프라부터 유지비까지 종합적으로 컨설팅합니다.',
  },
  {
    id: 8, name: '최윤철', role: '매니저', experience: '6년',
    tags: ['경차', '소형차', '즉시출고'],
    image: '/images/managers/Choi Yoon-cheol Manager.jpg',
    phone: '010-6666-6666',
    isMVP: true,
    intro: '경차 및 소형차 전문 매니저로, 합리적인 가격대의 차량과 즉시출고 가능한 모델을 전담하고 있습니다.',
    detail: '모닝, 캐스퍼, 레이 등 경차부터 아반떼, K3 등 준중형까지 첫차 고객에게 가장 적합한 차량을 추천드립니다.',
  },
  {
    id: 9, name: '한영준', role: '매니저', experience: '4년',
    tags: ['수입차', '스포츠카', '프리미엄'],
    image: '/images/managers/Han Young-jun Manager.png',
    phone: '010-7777-7777',
    isMVP: true,
    intro: '프리미엄 수입차 및 스포츠카 전문 매니저로, 럭셔리 브랜드 전 차종에 대한 컨설팅을 제공합니다.',
    detail: '포르쉐, 마세라티, 람보르기니 등 슈퍼카 리스부터 벤츠 S클래스, BMW 7시리즈 등 플래그십 세단까지 폭넓게 다룹니다.',
  },
  {
    id: 10, name: '최원영', role: '매니저', experience: '3년',
    tags: ['국산차', '준중형', '첫차'],
    image: '/images/managers/Won-young Choi, Manager.png',
    phone: '010-9999-1111',
    isMVP: true,
    intro: '첫 차 구매 고객을 위한 맞춤 상담 전문 매니저로, 사회초년생과 신혼부부 고객을 다수 응대해왔습니다.',
    detail: '아반떼, K3, 코나, 셀토스 등 국산 준중형/소형 SUV에 강점을 가지고 있으며, 첫 차를 합리적으로 구매할 수 있도록 금융 조건부터 보험까지 친절하게 안내드립니다.',
  },
  {
    id: 11, name: '장종현', role: '매니저', experience: '5년',
    tags: ['SUV', '아웃도어', '레저'],
    image: '/images/managers/Jong-hyun Jang, Manager.png',
    phone: '010-9999-2222',
    isMVP: true,
    intro: '아웃도어·캠핑 라이프스타일에 최적화된 SUV 전문 매니저로, 고객의 라이프스타일에 맞는 차량을 추천드립니다.',
    detail: '레인지로버, 디스커버리, 랜드크루저 등 정통 SUV부터 쏘렌토, 싼타페 등 패밀리 SUV까지 폭넓게 다루며, 차박·캠핑 옵션까지 상세히 안내드립니다.',
  },
  {
    id: 12, name: '장주헌', role: '매니저', experience: '3년',
    tags: ['국산차', '신차', '리스'],
    image: '/images/managers/Jang Joo-heon Manager.png',
    phone: '010-9999-3333',
    isMVP: false,
    intro: '국산 신차 및 리스 전문 매니저로, 고객의 예산과 용도에 맞는 최적의 차량을 추천해드립니다.',
    detail: '현대·기아·제네시스 전 차종에 대한 폭넓은 지식을 바탕으로, 신차 출고부터 리스 조건 비교까지 원스톱으로 안내드립니다. 합리적인 가격과 빠른 출고를 최우선으로 합니다.',
  },
]

function loadOverrides() {
  if (typeof localStorage === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveOverrides(map) {
  if (typeof localStorage === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)) } catch {}
}

const overrides = ref(loadOverrides())

watch(overrides, (v) => saveOverrides(v), { deep: true })

function applyOverrides(list, overrideMap) {
  return list.map(m => overrideMap[m.id] ? { ...m, ...overrideMap[m.id] } : m)
}

const managerList = ref(applyOverrides(seed, overrides.value))

// overrides가 바뀔 때 managerList에 반영
watch(overrides, (v) => {
  managerList.value = applyOverrides(seed, v)
}, { deep: true })

const mvpManagers = computed(() => managerList.value.filter(m => m.isMVP))

export function useManagers() {
  function addManager(m) { managerList.value.push({ ...m, id: Date.now() }) }
  function updateManager(m) {
    const idx = managerList.value.findIndex(x => x.id === m.id)
    if (idx !== -1) managerList.value[idx] = { ...m }
  }
  function removeManager(id) { managerList.value = managerList.value.filter(m => m.id !== id) }
  function setMVP(id) {
    const prev = overrides.value[id] || {}
    const seedItem = seed.find(s => s.id === id)
    const currentMVP = prev.isMVP !== undefined ? prev.isMVP : (seedItem?.isMVP ?? false)
    overrides.value = {
      ...overrides.value,
      [id]: {
        ...prev,
        isMVP: !currentMVP,
      },
    }
  }
  // 조직도 아바타 전용: 이미지·위치 오버라이드 저장
  function setManagerAvatar(id, { image, imageX, imageY }) {
    const prev = overrides.value[id] || {}
    overrides.value = {
      ...overrides.value,
      [id]: {
        ...prev,
        ...(image !== undefined ? { image } : {}),
        ...(imageX !== undefined ? { imageX } : {}),
        ...(imageY !== undefined ? { imageY } : {}),
      },
    }
  }
  function resetManagerAvatar(id) {
    const { [id]: _, ...rest } = overrides.value
    overrides.value = rest
  }
  return { managerList, mvpManagers, addManager, updateManager, removeManager, setMVP, setManagerAvatar, resetManagerAvatar }
}
