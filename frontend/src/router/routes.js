import AboutView from '../views/AboutView.vue'

const DEFAULT_DESC = '장기렌트, 리스 전문 오토원트. 최저가 견적 비교, 전문 매니저 1:1 맞춤 상담. 국산차·수입차 전 차종 취급.'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: '오토원트 - 장기렌트 리스 전문 플랫폼',
      description: DEFAULT_DESC,
    },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      title: '회사소개 | 오토원트',
      description: '오토원트는 20년 이상의 자동차 금융 경험을 바탕으로 고객 맞춤형 장기렌트·리스 서비스를 제공합니다. 20개 이상 금융사와의 파트너십으로 최적 조건을 안내드립니다.',
    },
  },
  {
    path: '/monthly-special',
    name: 'MonthlySpecial',
    component: () => import('../views/MonthlySpecialView.vue'),
    meta: {
      title: '이달의 특가 | 오토원트 장기렌트 리스',
      description: '이달 가장 저렴하게 이용하실 수 있는 장기렌트·리스 차량을 모았습니다. 한정 재고로 빠르게 출고 가능한 특가 모델을 확인하세요.',
    },
  },
  {
    path: '/immediate-stock',
    name: 'ImmediateStock',
    component: () => import('../views/ImmediateStockView.vue'),
    meta: {
      title: '즉시 출고 가능 차량 | 오토원트',
      description: '대기 없이 바로 출고 가능한 국산·수입 신차 리스트. 현대, 기아, 제네시스, 벤츠, BMW 등 다양한 차종을 즉시 인도 받으실 수 있습니다.',
    },
  },
  {
    path: '/organization',
    name: 'Organization',
    component: () => import('../views/OrganizationView.vue'),
    meta: {
      title: '조직도 | 오토원트',
      description: '오토원트 경영진과 영업팀·지원팀 조직을 소개합니다. 대표, 이사, 매니저진이 고객 한 분 한 분을 책임지고 응대합니다.',
    },
  },
  {
    path: '/managers',
    name: 'Managers',
    component: () => import('../views/ManagersView.vue'),
    meta: {
      title: '매니저 소개 | 오토원트 전문 상담 매니저',
      description: 'SUV, 세단, 전기차, 수입차, 법인 리스 등 분야별 전문 매니저 팀이 1:1 맞춤 상담으로 최적 조건을 찾아드립니다.',
    },
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('../views/GuideView.vue'),
    meta: {
      title: '장기렌트 리스 가이드 | 오토원트',
      description: '장기렌트와 리스의 차이, 비용 계산 방법, 계약 조건, 유의사항까지 꼭 알아야 할 정보를 상세히 안내드립니다.',
    },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../views/PrivacyView.vue'),
    meta: {
      title: '개인정보처리방침 | 오토원트',
      description: '오토원트 개인정보처리방침 및 수집·이용 안내.',
    },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue'),
    meta: {
      title: '견적 상담 문의 | 오토원트',
      description: '무료 견적 상담을 신청하세요. 전문 매니저가 24시간 내 연락드려 맞춤 조건을 안내해 드립니다.',
    },
  },
  {
    path: '/reviews',
    name: 'ReviewList',
    component: () => import('../views/ReviewListView.vue'),
    meta: {
      title: '고객 후기 | 오토원트 실제 출고 후기',
      description: '오토원트에서 실제로 출고하신 고객님들의 생생한 후기 모음. 차종별·매니저별 후기와 출고 사진을 확인하실 수 있습니다.',
    },
  },
  {
    path: '/reviews/write',
    name: 'ReviewWrite',
    component: () => import('../views/ReviewWriteView.vue'),
    meta: {
      title: '후기 작성 | 오토원트',
      description: '오토원트 이용 경험을 공유해주세요.',
    },
  },
  {
    path: '/reviews/:id',
    name: 'ReviewDetail',
    component: () => import('../views/ReviewDetailView.vue'),
    meta: {
      title: '고객 후기 | 오토원트',
      description: '오토원트에서 출고하신 고객님의 생생한 장기렌트·리스 이용 후기입니다.',
    },
  },
  {
    path: '/autowant-admin-access',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { noIndex: true, title: '관리자 로그인' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, noIndex: true, title: '관리자' },
  },
]

export const SITE = 'https://www.autowant.co.kr'
export const DEFAULT_DESCRIPTION = DEFAULT_DESC
