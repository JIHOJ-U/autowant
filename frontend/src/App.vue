<template>
  <v-app>
    <!-- 네비게이션 -->
    <v-app-bar flat :class="['main-navbar', { 'navbar-transparent': isAboutPage && !navScrolled, 'navbar-blur': isAboutPage && navScrolled }]" height="64">
      <v-container class="d-flex align-center" style="max-width: 1200px;">
        <router-link to="/" class="brand-link">
          <span class="brand-text">AUTO</span><span class="brand-accent">WANT</span>
        </router-link>

        <v-spacer />

        <!-- 데스크톱 메뉴 -->
        <nav class="d-none d-md-flex align-center ga-1">
          <router-link to="/" class="nav-link" exact-active-class="nav-active">차량 검색</router-link>
          <router-link to="/monthly-special" class="nav-link" active-class="nav-active">이달의 특가</router-link>
          <router-link to="/immediate-stock" class="nav-link" active-class="nav-active">즉시 출고</router-link>
          <router-link to="/about" class="nav-link" active-class="nav-active">회사소개</router-link>
          <router-link to="/managers" class="nav-link" active-class="nav-active">매니저 소개</router-link>
          <router-link to="/contact" class="nav-link" active-class="nav-active">문의하기</router-link>
        </nav>

        <div class="d-none d-md-flex align-center ml-5 ga-2">
          <v-btn variant="flat" rounded="pill" class="nav-cta" size="small" to="/contact">견적 상담</v-btn>

          <v-btn v-if="!isAdmin" icon variant="text" size="small" to="/login" title="관리자 로그인">
            <v-icon size="20" color="#aaa">mdi-account-circle-outline</v-icon>
          </v-btn>

          <v-menu v-else location="bottom end" offset="4">
            <template #activator="{ props }">
              <v-btn v-bind="props" icon variant="text" size="small">
                <v-icon size="20" color="#111">mdi-account-circle</v-icon>
              </v-btn>
            </template>
            <v-list density="compact" rounded="lg" width="160" class="py-1">
              <v-list-item to="/admin" prepend-icon="mdi-view-dashboard-outline" title="대시보드" density="compact" />
              <v-list-item prepend-icon="mdi-logout" title="로그아웃" @click="handleLogout" density="compact" />
            </v-list>
          </v-menu>
        </div>

        <v-app-bar-nav-icon class="d-md-none" @click="mobileMenu = !mobileMenu" />
      </v-container>
    </v-app-bar>

    <!-- 모바일 메뉴 -->
    <v-navigation-drawer v-model="mobileMenu" location="right" temporary width="260">
      <v-list nav>
        <v-list-item class="mb-1 mt-2">
          <span class="brand-text">AUTO</span><span class="brand-accent">WANT</span>
        </v-list-item>
        <v-divider class="mb-1" />
        <v-list-item to="/" title="차량 검색" @click="mobileMenu = false" />
        <v-list-item to="/monthly-special" title="이달의 특가" @click="mobileMenu = false" />
        <v-list-item to="/immediate-stock" title="즉시 출고" @click="mobileMenu = false" />
        <v-list-item to="/about" title="회사소개" @click="mobileMenu = false" />
        <v-list-item to="/managers" title="매니저 소개" @click="mobileMenu = false" />
        <v-list-item to="/contact" title="문의하기" @click="mobileMenu = false" />
        <v-divider class="my-1" />
        <v-list-item v-if="!isAdmin" to="/login" title="관리자 로그인" @click="mobileMenu = false" />
        <template v-else>
          <v-list-item to="/admin" title="대시보드" @click="mobileMenu = false" />
          <v-list-item title="로그아웃" @click="handleLogout" />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main :style="{ paddingTop: isAboutPage ? '0' : '64px' }">
      <router-view />
    </v-main>

    <!-- 플로팅 사이드바 (데스크톱) -->
    <aside class="floating-sidebar" :class="{ visible: showSidebar && !isAboutPage }">
      <a href="tel:010-0000-0000" class="sb-item sb-phone">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        <span>전화상담</span>
      </a>
      <a href="https://pf.kakao.com/_example" target="_blank" class="sb-item sb-kakao">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.84.56.08 1.14.13 1.72.13 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/></svg>
        <span>카카오톡</span>
      </a>
      <a href="https://instagram.com/autowant" target="_blank" class="sb-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
        <span>인스타</span>
      </a>
      <a href="https://facebook.com/autowant" target="_blank" class="sb-item">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        <span>페이스북</span>
      </a>
      <a href="https://blog.naver.com/autowant" target="_blank" class="sb-item sb-naver">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
        <span>네이버</span>
      </a>
    </aside>

    <!-- 차량 문의 모달 -->
    <v-dialog v-model="inquiryModal" max-width="480" class="inquiry-dialog">
      <v-card rounded="xl" class="pa-0" style="overflow: hidden;">
        <div class="modal-header">
          <div>
            <h3>차량 문의</h3>
            <p v-if="inquiryVehicle">{{ inquiryVehicle.brand }} {{ inquiryVehicle.name }}</p>
          </div>
          <button class="modal-close" @click="inquiryModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <v-form ref="inquiryForm" @submit.prevent="submitInquiry">
            <v-text-field v-model="inquiry.name" label="이름" variant="outlined" density="compact" rounded="lg" :rules="[v => !!v || '필수']" class="mb-1" />
            <v-text-field v-model="inquiry.phone" label="연락처" placeholder="010-0000-0000" variant="outlined" density="compact" rounded="lg" :rules="[v => !!v || '필수']" class="mb-1" />
            <v-textarea v-model="inquiry.message" label="문의 내용 (선택)" variant="outlined" density="compact" rounded="lg" rows="3" class="mb-1" />
            <v-checkbox v-model="inquiry.agree" label="[필수] 개인정보 수집 및 이용 동의" :rules="[v => !!v || '동의 필요']" density="compact" class="mb-2" />
            <button type="submit" class="modal-submit">문의하기</button>
          </v-form>
        </div>
      </v-card>
    </v-dialog>

    <!-- 월납입금 계산기 모달 -->
    <div v-if="calcModal" class="g-overlay" @click.self="calcModal = false">
      <div class="g-modal calc-modal">
        <div class="g-modal-top">
          <h3>월 납입금 계산기</h3>
          <button class="g-modal-x" @click="calcModal = false">&times;</button>
        </div>
        <div class="calc-body">
          <div class="calc-car">
            <img v-if="calcVehicle?.image" :src="calcVehicle.image" class="calc-car-img" />
            <div class="calc-car-info">
              <p class="calc-car-sub">{{ calcVehicle?.brand }}</p>
              <h4>{{ calcVehicle?.name }}</h4>
              <p class="calc-car-price">차량가 {{ fmt(calcVehicle?.price || 0) }}원</p>
            </div>
          </div>
          <div class="calc-sliders">
            <div class="slider-group">
              <div class="slider-label"><span>계약 기간</span><strong>{{ calcMonths }}개월</strong></div>
              <input type="range" v-model.number="calcMonths" min="12" max="60" step="12" class="slider" />
              <div class="slider-ticks"><span>12</span><span>24</span><span>36</span><span>48</span><span>60</span></div>
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>보증금</span><strong>{{ fmt(calcDeposit) }}원</strong></div>
              <input type="range" v-model.number="calcDeposit" min="0" :max="Math.round((calcVehicle?.price || 0) * 0.3)" :step="1000000" class="slider" />
              <div class="slider-ticks"><span>0원</span><span>{{ fmt(Math.round((calcVehicle?.price || 0) * 0.3)) }}원</span></div>
            </div>
            <div class="slider-group">
              <div class="slider-label"><span>선납금</span><strong>{{ fmt(calcAdvance) }}원</strong></div>
              <input type="range" v-model.number="calcAdvance" min="0" :max="Math.round((calcVehicle?.price || 0) * 0.3)" :step="1000000" class="slider" />
              <div class="slider-ticks"><span>0원</span><span>{{ fmt(Math.round((calcVehicle?.price || 0) * 0.3)) }}원</span></div>
            </div>
          </div>
          <div class="calc-result">
            <p class="calc-result-label">예상 월 납입금</p>
            <p class="calc-result-price">{{ fmt(calcMonthlyResult) }}<span>원</span></p>
            <p class="calc-result-note">실제 금액은 상담 시 변동될 수 있습니다</p>
          </div>
          <div class="calc-actions">
            <button class="calc-inquiry-btn" @click="calcModal = false; openInquiryModal(calcVehicle)">이 조건으로 상담하기</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 비교함 하단 바 -->
    <div class="compare-bar" :class="{ show: compareCount > 0 }">
      <div class="compare-bar-inner">
        <div class="compare-items">
          <div v-for="v in compareList" :key="v.id" class="compare-thumb">
            <img :src="v.image" />
            <button class="compare-thumb-x" @click="removeCompare(v.id)">&times;</button>
            <p>{{ v.name }}</p>
          </div>
          <div v-for="n in (3 - compareCount)" :key="'e'+n" class="compare-thumb empty-thumb">
            <div class="empty-plus">+</div>
            <p>차량 선택</p>
          </div>
        </div>
        <div class="compare-bar-actions">
          <button class="compare-btn" :disabled="compareCount < 2" @click="compareModal = true">비교하기</button>
          <button class="compare-clear" @click="clearCompare">초기화</button>
        </div>
      </div>
    </div>

    <!-- 비교 모달 -->
    <div v-if="compareModal" class="g-overlay" @click.self="compareModal = false">
      <div class="g-modal compare-modal-box">
        <div class="g-modal-top">
          <h3>차량 비교</h3>
          <button class="g-modal-x" @click="compareModal = false">&times;</button>
        </div>
        <div class="compare-grid">
          <div v-for="v in compareList" :key="v.id" class="compare-col">
            <img :src="v.image" class="compare-col-img" />
            <h4>{{ v.brand }} {{ v.name }}</h4>
            <table class="compare-specs">
              <tr><td>차량가</td><td class="spec-val">{{ fmt(v.price) }}원</td></tr>
              <tr><td>월 렌트료</td><td class="spec-val bold">{{ fmt(v.monthlyRent) }}원</td></tr>
              <tr><td>계약기간</td><td class="spec-val">{{ v.rentMonths }}개월</td></tr>
              <tr><td>보증금</td><td class="spec-val">{{ v.deposit ? fmt(v.deposit) + '원' : '없음' }}</td></tr>
              <tr><td>연식</td><td class="spec-val">{{ v.year }}년</td></tr>
              <tr><td>차종</td><td class="spec-val">{{ v.type }}</td></tr>
              <tr><td>연료</td><td class="spec-val">{{ v.fuel }}</td></tr>
            </table>
            <button class="compare-col-btn" @click="compareModal = false; openInquiryModal(v)">상담 신청</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 푸터 -->
    <footer :class="['app-footer', { 'app-footer-grey': isAboutPage }]">
      <div class="footer-inner">
        <!-- 상단: 로고 + 네비 + SNS -->
        <div class="ft-top">
          <div class="ft-brand">
            <span class="ft-logo">AUTO<span>WANT</span></span>
          </div>
          <nav class="ft-nav">
            <router-link to="/">홈</router-link>
            <router-link to="/monthly-special">이달의 특가</router-link>
            <router-link to="/immediate-stock">즉시 출고</router-link>
            <router-link to="/managers">매니저 소개</router-link>
            <router-link to="/contact">문의하기</router-link>
          </nav>
          <div class="ft-social">
            <a href="https://instagram.com/autowant" target="_blank" title="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>
            </a>
            <a href="https://facebook.com/autowant" target="_blank" title="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://blog.naver.com/autowant" target="_blank" title="Naver" class="ft-soc-naver">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/></svg>
            </a>
            <a href="https://pf.kakao.com/_example" target="_blank" title="KakaoTalk">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.63 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.42 4.28-2.84.56.08 1.14.13 1.72.13 5.52 0 10-3.58 10-7.94S17.52 3 12 3z"/></svg>
            </a>
          </div>
        </div>

        <div class="ft-divider"></div>

        <!-- 하단: 사업자 정보 -->
        <div class="ft-bottom">
          <div class="ft-info">
            <p>상호명 : 오토원트&emsp;대표 : 신선호&emsp;TEL : 0507-1344-7898&emsp;EMAIL : autowant@naver.com</p>
            <p>주소 : 경기도 광명시 일직로 72 에이동 14층 1420호&emsp;사업자등록번호 : 609-88-02424</p>
          </div>
          <p class="ft-copy">Copyright &copy; AUTOWANT. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </v-app>
</template>

<script setup>
import { ref, computed, provide, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './stores/auth'
import { useCompare } from './stores/compare'

const router = useRouter()
const route = useRoute()
const { isAdmin, logout } = useAuth()
const mobileMenu = ref(false)

// 회사소개 페이지 투명 네비게이션
const isAboutPage = computed(() => route.path === '/about')
const navScrolled = ref(false)

// 사이드바 스크롤 표시
const showSidebar = ref(false)
function onScroll() {
  showSidebar.value = window.scrollY > 200
  navScrolled.value = window.scrollY > 60
}
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// 차량 문의 모달
const inquiryModal = ref(false)
const inquiryVehicle = ref(null)
const inquiryForm = ref(null)
const inquiry = ref({ name: '', phone: '', message: '', agree: false })

const { compareList, count: compareCount, toggleCompare, removeCompare, clearCompare, isInCompare } = useCompare()

// 계산기 모달
const calcModal = ref(false)
const calcVehicle = ref(null)
const calcMonths = ref(48)
const calcDeposit = ref(0)
const calcAdvance = ref(0)

const calcMonthlyResult = computed(() => {
  if (!calcVehicle.value) return 0
  const base = calcVehicle.value.price - calcDeposit.value - calcAdvance.value
  const monthly = Math.round(base / calcMonths.value * 1.05)
  return Math.max(monthly, 0)
})

function openCalcModal(vehicle) {
  calcVehicle.value = vehicle
  calcMonths.value = vehicle.rentMonths || 48
  calcDeposit.value = vehicle.deposit || 0
  calcAdvance.value = 0
  calcModal.value = true
}

// 비교 모달
const compareModal = ref(false)

provide('openInquiryModal', openInquiryModal)
provide('openCalcModal', openCalcModal)
provide('toggleCompare', toggleCompare)
provide('isInCompare', isInCompare)

function fmt(p) { return (p || 0).toLocaleString('ko-KR') }

function openInquiryModal(vehicle) {
  inquiryVehicle.value = vehicle
  inquiry.value = { name: '', phone: '', message: '', agree: false }
  inquiryModal.value = true
}

async function submitInquiry() {
  const { valid } = await inquiryForm.value.validate()
  if (valid) {
    inquiryModal.value = false
    alert(`${inquiryVehicle.value?.name} 문의가 접수되었습니다.\n전문 매니저가 곧 연락드리겠습니다.`)
  }
}

function handleLogout() {
  logout()
  mobileMenu.value = false
  router.push('/')
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; }
body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; -webkit-font-smoothing: antialiased; }


/* 네비게이션 */
.main-navbar {
  background: white !important;
  border-bottom: 1px solid #eee !important;
  position: fixed !important;
  top: 0 !important;
  z-index: 1900 !important;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s !important;
}
.main-navbar.navbar-transparent {
  background: transparent !important;
  border-bottom-color: transparent !important;
  box-shadow: none !important;
}
.main-navbar.navbar-blur {
  background: rgba(13, 13, 13, 0.65) !important;
  backdrop-filter: blur(16px) !important;
  -webkit-backdrop-filter: blur(16px) !important;
  border-bottom-color: rgba(255,255,255,0.07) !important;
  box-shadow: none !important;
}
.main-navbar.navbar-transparent .brand-text,
.main-navbar.navbar-blur .brand-text { color: #fff; }
.main-navbar.navbar-transparent .brand-accent,
.main-navbar.navbar-blur .brand-accent { color: rgba(255,255,255,0.75); }
.main-navbar.navbar-transparent .nav-link,
.main-navbar.navbar-blur .nav-link { color: rgba(255,255,255,0.65); }
.main-navbar.navbar-transparent .nav-link:hover,
.main-navbar.navbar-blur .nav-link:hover { color: #fff; }
.main-navbar.navbar-transparent .nav-active,
.main-navbar.navbar-blur .nav-active { color: #fff !important; }
.main-navbar.navbar-transparent .nav-cta,
.main-navbar.navbar-blur .nav-cta { background: rgba(255,255,255,0.15) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.3) !important; }
.brand-link { text-decoration: none; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.5px; }
.brand-text { color: #111; transition: color 0.3s; }
.brand-accent { color: #4d8ef7; transition: color 0.3s; }
.nav-link {
  text-decoration: none;
  color: #888;
  font-size: 13.5px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: color 0.15s;
}
.nav-link:hover { color: #111; }
.nav-active { color: #111 !important; }
.nav-cta {
  background: #111 !important;
  color: white !important;
  font-weight: 700 !important;
  font-size: 12.5px !important;
  letter-spacing: -0.2px;
  padding: 0 20px !important;
}

/* 푸터 */
.app-footer { background: #fff; color: #888; padding: 0; border-top: 1px solid #f0f0f0; }
.app-footer-grey { background: #1a1a1a !important; border-top-color: #2a2a2a !important; }
.footer-inner { max-width: 1200px; margin: 0 auto; padding: 36px 24px 28px; }

.ft-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.ft-logo { font-size: 1.1rem; font-weight: 800; color: #111; letter-spacing: -0.5px; }
.ft-logo span { color: #4d8ef7; }
.app-footer-grey .ft-logo { color: #fff; }
.app-footer-grey .ft-logo span { color: rgba(255,255,255,0.75); }
.ft-nav { display: flex; gap: 20px; flex-wrap: wrap; }
.ft-nav a { text-decoration: none; color: #888; font-size: 12.5px; font-weight: 500; transition: color 0.15s; }
.ft-nav a:hover { color: #111; }
.ft-social { display: flex; gap: 8px; }
.ft-social a {
  width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e5e5e5;
  display: flex; align-items: center; justify-content: center;
  color: #aaa; text-decoration: none; transition: all 0.15s;
}
.ft-social a:hover { border-color: #111; color: #111; }

.ft-divider { height: 1px; background: #f0f0f0; margin: 24px 0; }

.ft-bottom { }
.ft-info p { font-size: 12px; color: #aaa; margin: 0 0 4px; line-height: 1.7; }
.ft-copy { font-size: 11px; color: #bbb; margin: 12px 0 0; }

@media (max-width: 768px) {
  .ft-top { flex-direction: column; align-items: flex-start; }
  .ft-info p { font-size: 11px; }
  .ft-info p { word-break: keep-all; }
}

/* 플로팅 사이드바 */
.floating-sidebar {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%) translateX(80px);
  z-index: 1800;
  display: flex;
  flex-direction: column;
  gap: 6px;
  opacity: 0;
  transition: all 0.3s ease;
}
.floating-sidebar.visible {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
.sb-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  text-decoration: none;
  color: #666;
  font-size: 9px;
  font-weight: 600;
  gap: 3px;
  transition: all 0.15s;
}
.sb-item:hover {
  border-color: #ddd;
  color: #111;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.sb-item svg { flex-shrink: 0; }
.sb-phone { color: #111; }
.sb-kakao { color: #391b1b; }
.sb-naver { color: #03c75a; }

@media (max-width: 1400px) {
  .floating-sidebar { right: 8px; }
  .sb-item { width: 48px; height: 48px; font-size: 8px; }
  .sb-item svg { width: 16px; height: 16px; }
}
@media (max-width: 768px) {
  .floating-sidebar { display: none; }
}

/* 문의 모달 */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 0;
}
.modal-header h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0; }
.modal-header p { font-size: 13px; color: #999; margin: 2px 0 0; }
.modal-close {
  background: none; border: none; font-size: 24px; color: #ccc; cursor: pointer;
  line-height: 1; padding: 0;
}
.modal-close:hover { color: #111; }
.modal-body { padding: 20px 24px 24px; }
.modal-submit {
  width: 100%; padding: 12px; background: #111; color: white; border: none; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s;
}
.modal-submit:hover { background: #333; }

/* 공통 오버레이/모달 */
.g-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 2100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.g-modal { background: white; border-radius: 14px; width: 100%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
.g-modal-top { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f0f0f0; }
.g-modal-top h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0; }
.g-modal-x { background: none; border: none; font-size: 24px; color: #ccc; cursor: pointer; }
.g-modal-x:hover { color: #111; }

/* ===== 계산기 모달 ===== */
.calc-modal { max-width: 520px; }
.calc-body { padding: 22px; overflow-y: auto; }
.calc-car { display: flex; gap: 14px; align-items: center; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid #f5f5f5; }
.calc-car-img { width: 120px; height: 72px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.calc-car-sub { font-size: 11px; color: #aaa; margin: 0; }
.calc-car-info h4 { font-size: 16px; font-weight: 700; color: #111; margin: 2px 0 4px; }
.calc-car-price { font-size: 13px; color: #666; margin: 0; }

.calc-sliders { margin-bottom: 22px; }
.slider-group { margin-bottom: 18px; }
.slider-label { display: flex; justify-content: space-between; margin-bottom: 8px; }
.slider-label span { font-size: 13px; color: #888; }
.slider-label strong { font-size: 14px; color: #111; }
.slider {
  width: 100%; height: 6px; -webkit-appearance: none; appearance: none;
  background: #eee; border-radius: 3px; outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
  background: #111; cursor: pointer; border: 3px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}
.slider-ticks { display: flex; justify-content: space-between; margin-top: 4px; }
.slider-ticks span { font-size: 10px; color: #ccc; }

.calc-result {
  background: #111; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 14px;
}
.calc-result-label { font-size: 12px; color: #888; margin: 0 0 4px; }
.calc-result-price { font-size: 28px; font-weight: 800; color: white; margin: 0; }
.calc-result-price span { font-size: 14px; font-weight: 500; color: #888; }
.calc-result-note { font-size: 11px; color: #666; margin: 8px 0 0; }

.calc-actions { }
.calc-inquiry-btn {
  width: 100%; padding: 13px; background: white; color: #111; border: 1px solid #111;
  border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s;
}
.calc-inquiry-btn:hover { background: #111; color: white; }

/* ===== 비교함 하단 바 ===== */
.compare-bar {
  position: fixed; bottom: -120px; left: 0; right: 0; z-index: 2000;
  background: white; border-top: 1px solid #eee; box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  transition: bottom 0.3s ease;
}
.compare-bar.show { bottom: 0; }
.compare-bar-inner {
  max-width: 1200px; margin: 0 auto; padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.compare-items { display: flex; gap: 10px; flex: 1; }
.compare-thumb {
  width: 140px; display: flex; align-items: center; gap: 8px;
  padding: 6px 10px; border: 1px solid #f0f0f0; border-radius: 8px; position: relative;
}
.compare-thumb img { width: 48px; height: 32px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
.compare-thumb p { font-size: 11px; font-weight: 600; color: #111; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.compare-thumb-x {
  position: absolute; top: -6px; right: -6px; width: 18px; height: 18px;
  background: #111; color: white; border: none; border-radius: 50%; font-size: 11px;
  cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;
}
.empty-thumb { border-style: dashed; border-color: #ddd; justify-content: center; }
.empty-plus { font-size: 18px; color: #ccc; }
.empty-thumb p { color: #ccc; }
.compare-bar-actions { display: flex; gap: 8px; flex-shrink: 0; }
.compare-btn {
  padding: 10px 28px; background: #111; color: white; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer;
}
.compare-btn:disabled { background: #ccc; cursor: not-allowed; }
.compare-btn:not(:disabled):hover { background: #333; }
.compare-clear {
  padding: 10px 16px; background: white; color: #999; border: 1px solid #eee;
  border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
}

/* ===== 비교 모달 ===== */
.compare-modal-box { max-width: 900px; }
.compare-grid { display: flex; gap: 0; overflow-x: auto; }
.compare-col {
  flex: 1; min-width: 240px; padding: 22px;
  border-right: 1px solid #f0f0f0; text-align: center;
}
.compare-col:last-child { border-right: none; }
.compare-col-img { width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; }
.compare-col h4 { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 14px; }
.compare-specs { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
.compare-specs td { padding: 7px 0; font-size: 12px; border-bottom: 1px solid #fafafa; }
.compare-specs td:first-child { color: #999; text-align: left; }
.spec-val { color: #111; text-align: right; font-weight: 500; }
.spec-val.bold { font-weight: 800; font-size: 13px; }
.compare-col-btn {
  width: 100%; padding: 10px; background: #111; color: white; border: none;
  border-radius: 6px; font-size: 13px; font-weight: 700; cursor: pointer;
}
.compare-col-btn:hover { background: #333; }

@media (max-width: 768px) {
  .compare-bar-inner { flex-direction: column; padding: 10px 16px; }
  .compare-items { width: 100%; }
  .compare-thumb { flex: 1; width: auto; min-width: 0; }
  .compare-bar-actions { width: 100%; justify-content: stretch; }
  .compare-btn, .compare-clear { flex: 1; }
  .compare-grid { flex-direction: column; }
  .compare-col { border-right: none; border-bottom: 1px solid #f0f0f0; }
}
</style>
