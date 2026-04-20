<template>
  <div class="guide-page">
    <div class="guide-hero">
      <div class="guide-hero-bg"></div>
      <div class="container guide-hero-inner">
        <p class="guide-eyebrow" data-aos="fade-down">GUIDE</p>
        <h1 class="guide-title" data-aos="fade-up">렌트 · 리스 가이드</h1>
        <p class="guide-sub" data-aos="fade-up" data-aos-delay="100">처음이신 분도 쉽게 이해할 수 있도록 안내해드립니다</p>
        <div class="guide-hero-chips" data-aos="fade-up" data-aos-delay="200">
          <span>초보자 가이드</span><span>비교 분석</span><span>맞춤 추천</span>
        </div>
      </div>
    </div>

    <div class="container guide-content">
      <!-- 탭 -->
      <div class="guide-tabs" data-aos="fade-up">
        <button v-for="tab in tabs" :key="tab.key" class="guide-tab" :class="{ active: current === tab.key }" @click="current = tab.key">
          {{ tab.label }}
        </button>
      </div>

      <transition :name="'slide-' + slideDir" mode="out-in">
        <!-- 렌트란 -->
        <div v-if="current === 'rent'" key="rent" class="guide-section">
          <div class="guide-card" data-aos="zoom-in">
            <div class="guide-card-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h2m10 0h2M3 11l1.5-5A2 2 0 0 1 6.4 4.5h11.2a2 2 0 0 1 1.9 1.5L21 11"/><path d="M3 11h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg></div>
            <h2>장기렌트란</h2>
            <p>장기렌트는 <strong>렌터카 회사 명의</strong>로 차량을 등록하고, 고객이 매월 일정 금액을 납부하며 장기간(12~60개월) 이용하는 방식입니다.</p>
          </div>

          <!-- 프로세스 스텝 -->
          <div class="guide-steps">
            <div class="guide-step" v-for="(step, i) in rentSteps" :key="i" data-aos="fade-up" :data-aos-delay="i * 100">
              <div class="guide-step-icon" v-html="step.svg"></div>
              <div class="guide-step-num">{{ i + 1 }}</div>
              <div class="guide-step-content">
                <h4>{{ step.title }}</h4>
                <p>{{ step.desc }}</p>
              </div>
            </div>
          </div>

          <div class="guide-features" data-aos="fade-up">
            <div class="guide-feat" v-for="(f, i) in rentFeats" :key="i" data-aos="fade-up" :data-aos-delay="i * 80">
              <div class="guide-feat-icon" v-html="f.svg"></div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>

          <div class="guide-who" data-aos="fade-up">
            <div class="guide-who-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg></div>
            <div>
              <h3>이런 분께 추천합니다</h3>
              <ul>
                <li>초기 비용 부담 없이 새 차를 타고 싶은 분</li>
                <li>보험·세금·정비를 한 번에 해결하고 싶은 분</li>
                <li>2~3년 주기로 새 차로 교체하고 싶은 분</li>
                <li>사업용 차량 비용 처리가 필요한 개인사업자</li>
              </ul>
            </div>
          </div>

          <div class="guide-cta" data-aos="zoom-in">
            <p>장기렌트가 궁금하시다면?</p>
            <router-link to="/contact" class="guide-cta-btn">무료 상담 받기 →</router-link>
          </div>
        </div>

        <!-- 리스란 -->
        <div v-else-if="current === 'lease'" key="lease" class="guide-section">
          <div class="guide-card" data-aos="zoom-in">
            <div class="guide-card-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
            <h2>리스란</h2>
            <p>리스는 <strong>금융사(리스사)</strong>가 차량을 구매하고, 고객이 매월 리스료를 납부하며 이용하는 금융 상품입니다.</p>
          </div>

          <!-- 운용 vs 금융 비주얼 -->
          <div class="guide-vs" data-aos="fade-up">
            <div class="guide-vs-card">
              <div class="guide-vs-badge op">운용리스</div>
              <p class="guide-vs-desc">리스사 명의로 이용, 만기 시 반납/재리스/인수 선택</p>
              <ul>
                <li>일반 번호판</li>
                <li>리스료 전액 비용 처리</li>
                <li>법인·사업자 추천</li>
              </ul>
            </div>
            <div class="guide-vs-divider">
              <span>VS</span>
            </div>
            <div class="guide-vs-card">
              <div class="guide-vs-badge fin">금융리스</div>
              <p class="guide-vs-desc">만기 시 잔존가치 납부 후 소유권 이전 가능</p>
              <ul>
                <li>일반 번호판</li>
                <li>이자 부분만 비용 처리</li>
                <li>차량 소유 목적 추천</li>
              </ul>
            </div>
          </div>

          <div class="guide-compare-table" data-aos="fade-up">
            <table>
              <thead>
                <tr><th></th><th>운용리스</th><th>금융리스</th></tr>
              </thead>
              <tbody>
                <tr><td class="label">차량 소유</td><td>리스사 명의</td><td>리스사 → 만기 시 이전</td></tr>
                <tr><td class="label">번호판</td><td>일반 번호판</td><td>일반 번호판</td></tr>
                <tr><td class="label">만기 후</td><td>반납 / 재리스 / 인수</td><td>인수 (잔존가치 납부)</td></tr>
                <tr><td class="label">세금 혜택</td><td>리스료 전액 비용 처리</td><td>이자 부분만 비용 처리</td></tr>
                <tr><td class="label">추천 대상</td><td>법인 / 사업자</td><td>차량 소유 목적</td></tr>
              </tbody>
            </table>
          </div>

          <div class="guide-features" data-aos="fade-up">
            <div class="guide-feat" v-for="(f, i) in leaseFeats" :key="i" data-aos="fade-up" :data-aos-delay="i * 80">
              <div class="guide-feat-icon" v-html="f.svg"></div>
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>

          <div class="guide-cta" data-aos="zoom-in">
            <p>리스 조건이 궁금하시다면?</p>
            <router-link to="/contact" class="guide-cta-btn">무료 상담 받기 →</router-link>
          </div>
        </div>

        <!-- 렌트 vs 리스 -->
        <div v-else key="compare" class="guide-section">
          <div class="guide-card" data-aos="zoom-in">
            <div class="guide-card-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><polyline points="8 8 4 12 8 16"/><polyline points="16 8 20 12 16 16"/></svg></div>
            <h2>렌트 vs 리스, 뭐가 다른가요?</h2>
            <p>상황에 따라 유리한 상품이 다릅니다. 아래 비교표를 참고하세요.</p>
          </div>

          <div class="guide-compare-table" data-aos="fade-up">
            <table>
              <thead>
                <tr><th></th><th>장기렌트</th><th>운용리스</th><th>금융리스</th></tr>
              </thead>
              <tbody>
                <tr><td class="label">소유 명의</td><td>렌터카 회사</td><td>리스사</td><td>리스사 → 고객</td></tr>
                <tr><td class="label">번호판</td><td>하/허 번호판</td><td>일반 번호판</td><td>일반 번호판</td></tr>
                <tr><td class="label">보험</td><td>포함</td><td>별도 가입</td><td>별도 가입</td></tr>
                <tr><td class="label">정비</td><td>포함</td><td>별도</td><td>별도</td></tr>
                <tr><td class="label">자동차세</td><td>포함</td><td>별도</td><td>별도</td></tr>
                <tr><td class="label">세금 혜택</td><td>비용 처리 가능</td><td>전액 비용 처리</td><td>이자만 비용 처리</td></tr>
                <tr><td class="label">초기 비용</td><td>없음~낮음</td><td>보증금 필요</td><td>보증금 필요</td></tr>
                <tr><td class="label">추천</td><td>개인 / 첫 차</td><td>법인 / 사업자</td><td>소유 목적</td></tr>
              </tbody>
            </table>
          </div>

          <!-- 간단 추천 -->
          <div class="guide-recommend" data-aos="fade-up">
            <h3>나에게 맞는 상품은?</h3>
            <div class="guide-rec-grid">
              <div class="guide-rec-card" data-aos="fade-up" data-aos-delay="0">
                <div class="guide-rec-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <h4>개인 고객</h4>
                <p>초기 비용 부담 없이 편하게 타고 싶다면</p>
                <span class="guide-rec-tag rent">장기렌트 추천</span>
              </div>
              <div class="guide-rec-card" data-aos="fade-up" data-aos-delay="100">
                <div class="guide-rec-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg></div>
                <h4>법인 / 사업자</h4>
                <p>세금 혜택을 극대화하고 싶다면</p>
                <span class="guide-rec-tag lease">운용리스 추천</span>
              </div>
              <div class="guide-rec-card" data-aos="fade-up" data-aos-delay="200">
                <div class="guide-rec-svg"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg></div>
                <h4>차량 소유 목적</h4>
                <p>만기 후 내 차로 만들고 싶다면</p>
                <span class="guide-rec-tag finance">금융리스 추천</span>
              </div>
            </div>
          </div>

          <div class="guide-cta" data-aos="zoom-in">
            <p>어떤 상품이 나에게 맞는지 잘 모르시겠다면?</p>
            <router-link to="/contact" class="guide-cta-btn">무료 상담 받기 →</router-link>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'

const current = ref('rent')
const slideDir = ref('right')
const tabOrder = ['rent', 'lease', 'compare']

watch(current, (nv, ov) => {
  slideDir.value = tabOrder.indexOf(nv) > tabOrder.indexOf(ov) ? 'right' : 'left'
  nextTick(() => setTimeout(initAos, 350))
})

const tabs = [
  { key: 'rent', label: '렌트란', icon: '🚗' },
  { key: 'lease', label: '리스란', icon: '📄' },
  { key: 'compare', label: '렌트 vs 리스', icon: '⚖️' },
]

const rentSteps = [
  { title: '차량 선택', desc: '원하는 차종, 옵션, 색상을 선택합니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' },
  { title: '견적 비교', desc: '20개 이상 금융사의 조건을 비교해드립니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
  { title: '계약 체결', desc: '최적 조건으로 계약을 진행합니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' },
  { title: '차량 인도', desc: '빠르면 3일 내 차량을 받으실 수 있습니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17h2m10 0h2M3 11l1.5-5A2 2 0 0 1 6.4 4.5h11.2a2 2 0 0 1 1.9 1.5L21 11"/><path d="M3 11h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>' },
]

const rentFeats = [
  { title: '초기 비용 부담 없음', desc: '보증금 없이도 가능하며, 취등록세·보험료 등 초기 비용이 월 납입금에 포함됩니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { title: '보험·정비 포함', desc: '자동차 보험, 자동차세, 정기 정비 등이 렌트료에 포함되어 추가 비용 걱정이 없습니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' },
  { title: '하(허) 번호판', desc: '렌터카 명의이므로 하/허 번호판이 부여됩니다. 최근에는 일반 번호판 형태도 가능합니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="7" y1="12" x2="7" y2="12.01"/><line x1="12" y1="12" x2="12" y2="12.01"/><line x1="17" y1="12" x2="17" y2="12.01"/></svg>' },
  { title: '개인·사업자 모두 가능', desc: '개인은 물론 사업자, 법인 모두 이용 가능하며 비용 처리가 가능합니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
]

const leaseFeats = [
  { title: '법인 세금 혜택', desc: '운용리스의 경우 리스료 전액을 비용으로 처리할 수 있어 절세 효과가 큽니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="10" y1="3" x2="10" y2="21"/></svg>' },
  { title: '일반 번호판', desc: '렌트와 달리 일반 번호판이 부여되어 외관상 자가용과 동일합니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="20 6 9 17 4 12"/></svg>' },
  { title: '다양한 만기 옵션', desc: '계약 만기 시 반납, 재리스, 인수(소유권 이전) 중 선택할 수 있습니다.', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>' },
]

// 간단한 스크롤 애니메이션 (AOS 라이브러리 대신)
function initAos() {
  const els = document.querySelectorAll('[data-aos]')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.aosDelay || 0)
        setTimeout(() => e.target.classList.add('aos-in'), delay)
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })
  els.forEach(el => { el.classList.remove('aos-in'); observer.observe(el) })
}
onMounted(initAos)
</script>

<style scoped>
.guide-page { padding: 0; }

/* 히어로 */
.guide-hero {
  position: relative; overflow: hidden;
  padding: 100px 0 70px; text-align: center;
}
.guide-hero-bg {
  position: absolute; inset: 0;
  background: url('/images/rent.jpg') center/cover no-repeat;
}
.guide-hero-bg::after {
  content: ''; position: absolute; inset: 0;
  background: rgba(15, 23, 42, 0.25);
}
.guide-hero-inner { position: relative; z-index: 1; }
.guide-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 5px; color: #3182f6; margin: 0 0 14px; text-transform: uppercase; }
.guide-title { font-size: 2.2rem; font-weight: 900; color: #fff; margin: 0 0 12px; letter-spacing: -0.5px; }
.guide-sub { font-size: 15px; color: rgba(255,255,255,0.6); margin: 0 0 24px; }
.guide-hero-chips { display: flex; gap: 8px; justify-content: center; }
.guide-hero-chips span {
  padding: 6px 16px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 100px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7);
}
.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
.guide-content { padding: 40px 20px 80px; }

/* 탭 */
.guide-tabs {
  display: flex; gap: 6px; margin-bottom: 36px;
  background: #f5f7fa; border-radius: 12px; padding: 4px;
}
.guide-tab {
  flex: 1; padding: 12px 20px; background: none; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600; color: #8b95a1; cursor: pointer;
  transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 6px;
}
.guide-tab:hover { color: #333; }
.guide-tab.active { background: #fff; color: #191f28; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.guide-tab-icon { font-size: 16px; }

/* 탭 전환 트랜지션 */
.slide-right-enter-active, .slide-right-leave-active,
.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from { opacity: 0; transform: translateX(30px); }
.slide-right-leave-to { opacity: 0; transform: translateX(-30px); }
.slide-left-enter-from { opacity: 0; transform: translateX(-30px); }
.slide-left-leave-to { opacity: 0; transform: translateX(30px); }

/* AOS 애니메이션 */
[data-aos] { opacity: 0; transition: opacity 0.6s ease, transform 0.6s ease; }
[data-aos="fade-up"] { transform: translateY(24px); }
[data-aos="fade-down"] { transform: translateY(-24px); }
[data-aos="zoom-in"] { transform: scale(0.95); }
[data-aos].aos-in { opacity: 1; transform: none; }

/* 메인 카드 */
.guide-card {
  background: linear-gradient(135deg, #f0f6ff, #f8f9fb);
  border-radius: 20px; padding: 44px; margin-bottom: 36px; text-align: center;
  border: 1px solid #e5edff;
}
.guide-card-icon { font-size: 52px; margin-bottom: 18px; }
.guide-card-svg { width: 56px; height: 56px; margin: 0 auto 18px; color: #3182f6; }
.guide-card-svg svg { width: 100%; height: 100%; }
.guide-card h2 { font-size: 1.6rem; font-weight: 900; color: #191f28; margin: 0 0 14px; }
.guide-card p { font-size: 15px; color: #4e5968; line-height: 1.8; margin: 0 auto; max-width: 560px; }
.guide-card p strong { color: #3182f6; }

/* 프로세스 스텝 */
.guide-steps { display: flex; gap: 16px; margin-bottom: 36px; }
.guide-step {
  flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 24px 16px; background: #fff; border: 1px solid #eef0f3; border-radius: 14px;
  position: relative; transition: all 0.25s;
}
.guide-step:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-2px); }
.guide-step-icon {
  width: 36px; height: 36px; color: #3182f6;
  background: #f0f6ff; border-radius: 10px; padding: 7px;
  margin-bottom: 10px;
}
.guide-step-icon svg { width: 100%; height: 100%; }
.guide-step-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: #3182f6; color: #fff;
  font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}
.guide-step h4 { font-size: 14px; font-weight: 800; color: #191f28; margin: 0 0 6px; }
.guide-step p { font-size: 12px; color: #8b95a1; margin: 0; line-height: 1.5; }

/* 특징 카드 */
.guide-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 36px; }
.guide-feat {
  background: #fff; border: 1px solid #eef0f3; border-radius: 14px;
  padding: 28px; transition: all 0.25s;
}
.guide-feat:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.06); transform: translateY(-3px); border-color: #d0e0ff; }
.guide-feat-icon {
  width: 40px; height: 40px; margin-bottom: 14px;
  color: #3182f6; background: #f0f6ff; border-radius: 10px;
  padding: 8px; display: flex; align-items: center; justify-content: center;
}
.guide-feat-icon svg { width: 100%; height: 100%; }
.guide-feat h3 { font-size: 15px; font-weight: 800; color: #191f28; margin: 0 0 8px; }
.guide-feat p { font-size: 13px; color: #6b7684; line-height: 1.7; margin: 0; }

/* 추천 박스 */
.guide-who {
  display: flex; gap: 20px; align-items: flex-start;
  background: #f0f6ff; border-radius: 14px; padding: 28px 32px;
  margin-bottom: 36px; border: 1px solid #d0e0ff;
}
.guide-who-svg { width: 40px; height: 40px; flex-shrink: 0; color: #3182f6; }
.guide-who-svg svg { width: 100%; height: 100%; }
.guide-who h3 { font-size: 15px; font-weight: 800; color: #191f28; margin: 0 0 12px; }
.guide-who ul { margin: 0; padding: 0 0 0 18px; }
.guide-who li { font-size: 14px; color: #4e5968; line-height: 2.2; }

/* VS 비교 카드 */
.guide-vs { display: flex; align-items: stretch; gap: 0; margin-bottom: 36px; }
.guide-vs-card {
  flex: 1; background: #fff; border: 1px solid #eef0f3; border-radius: 14px;
  padding: 28px; text-align: center;
}
.guide-vs-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
.guide-vs-badge {
  display: inline-block; padding: 5px 16px; border-radius: 100px;
  font-size: 13px; font-weight: 800; margin-bottom: 14px;
}
.guide-vs-badge.op { background: #f0f6ff; color: #3182f6; }
.guide-vs-badge.fin { background: #fef3c7; color: #d97706; }
.guide-vs-desc { font-size: 13px; color: #6b7684; margin: 0 0 16px; line-height: 1.6; }
.guide-vs-card ul { text-align: left; margin: 0; padding: 0 0 0 18px; }
.guide-vs-card li { font-size: 13px; color: #4e5968; line-height: 2; }
.guide-vs-divider {
  display: flex; align-items: center; padding: 0 16px; flex-shrink: 0;
}
.guide-vs-divider span {
  font-size: 16px; font-weight: 900; color: #c1c8d1;
  background: #f5f7fa; padding: 8px 12px; border-radius: 8px;
}

/* 비교 테이블 */
.guide-compare-table { overflow-x: auto; margin-bottom: 36px; border-radius: 14px; border: 1px solid #eef0f3; }
.guide-compare-table table { width: 100%; border-collapse: collapse; min-width: 500px; }
.guide-compare-table th {
  padding: 14px 16px; background: #191f28; color: #fff;
  font-size: 13px; font-weight: 700; text-align: center;
}
.guide-compare-table td { padding: 13px 16px; font-size: 13px; color: #333; border-bottom: 1px solid #f0f2f5; text-align: center; }
.guide-compare-table td.label { text-align: left; font-weight: 700; color: #191f28; background: #f8f9fb; }
.guide-compare-table tr:hover td { background: #fafbfc; }
.guide-compare-table tr:hover td.label { background: #f0f2f5; }

/* 추천 그리드 */
.guide-recommend { margin-bottom: 36px; }
.guide-recommend h3 { font-size: 18px; font-weight: 900; color: #191f28; margin: 0 0 20px; text-align: center; }
.guide-rec-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.guide-rec-card {
  background: #fff; border: 1px solid #eef0f3; border-radius: 14px;
  padding: 28px; text-align: center; transition: all 0.25s;
}
.guide-rec-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.06); transform: translateY(-3px); }
.guide-rec-icon { font-size: 36px; margin-bottom: 14px; }
.guide-rec-svg { width: 44px; height: 44px; margin: 0 auto 14px; color: #3182f6; background: #f0f6ff; border-radius: 12px; padding: 9px; }
.guide-rec-svg svg { width: 100%; height: 100%; }
.guide-rec-card h4 { font-size: 15px; font-weight: 800; color: #191f28; margin: 0 0 8px; }
.guide-rec-card p { font-size: 13px; color: #8b95a1; margin: 0 0 16px; line-height: 1.5; }
.guide-rec-tag {
  display: inline-block; padding: 5px 14px; border-radius: 100px;
  font-size: 12px; font-weight: 700;
}
.guide-rec-tag.rent { background: #ecfdf5; color: #059669; }
.guide-rec-tag.lease { background: #f0f6ff; color: #3182f6; }
.guide-rec-tag.finance { background: #fef3c7; color: #d97706; }

/* CTA */
.guide-cta {
  text-align: center; padding: 44px; background: linear-gradient(135deg, #f0f6ff, #f8f9fb);
  border-radius: 20px; border: 1px solid #e5edff;
}
.guide-cta p { font-size: 17px; font-weight: 700; color: #191f28; margin: 0 0 18px; }
.guide-cta-btn {
  display: inline-block; padding: 14px 40px;
  background: linear-gradient(135deg, #3182f6, #2563eb); color: #fff;
  border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none;
  box-shadow: 0 4px 16px rgba(49,130,246,0.3); transition: all 0.2s;
}
.guide-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(49,130,246,0.4); }

@media (max-width: 768px) {
  .guide-hero { padding: 70px 0 50px; }
  .guide-title { font-size: 1.5rem; }
  .guide-features { grid-template-columns: 1fr; }
  .guide-steps { flex-direction: column; }
  .guide-tabs { flex-direction: column; }
  .guide-vs { flex-direction: column; }
  .guide-vs-divider { justify-content: center; padding: 8px 0; }
  .guide-rec-grid { grid-template-columns: 1fr; }
  .guide-card { padding: 28px; }
  .guide-hero-chips { flex-wrap: wrap; justify-content: center; }
}
</style>
