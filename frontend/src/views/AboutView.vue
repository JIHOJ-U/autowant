<template>
  <div class="about-page">

    <!-- ① 히어로 -->
    <section class="hero-section">
      <div class="hero-bg">
        <!-- TODO: src="" 에 이미지 경로 입력 (예: src="/images/hero-car.jpg") -->
        <div class="hero-img-wrap">
          <img class="hero-img" src="/images/white.jpg" alt="AUTOWANT" />
          <div class="hero-img-fade"></div>
        </div>
        <div class="hero-noise"></div>
        <div class="hero-gradient"></div>
      </div>

      <div class="hero-inner">
        <div class="hero-top">
          <span class="hero-year hero-anim hero-anim-1">설립 2020</span>
        </div>

        <div class="hero-center">
          <div class="hero-num hero-anim hero-anim-2">NO.1</div>
          <h1 class="hero-title hero-anim hero-anim-3">
            고객에게 제공되는<br>
            <em>다양한</em> 렌트카<br>
            서비스
          </h1>
        </div>

        <div class="hero-bottom">
          <p class="hero-sub hero-anim hero-anim-4">합리적인 가격 · 투명한 견적 · 전문 상담</p>
        </div>
      </div>
    </section>

    <!-- ③ About 본문 -->
    <section class="about-section">
      <div class="ab-container">
        <div v-reveal="{ dir: 'left' }" class="ab-left">
          <p class="section-tag">오토원트 소개</p>
          <h2 class="ab-headline">
            단순한 렌트를<br>넘어서
          </h2>
        </div>
        <div v-reveal="{ delay: 200, dir: 'right' }" class="ab-right">
          <p class="ab-body">
            저희 오토원트는 고객님의 부담을 덜어드리기 위해 상황에 맞는 (카카오톡, 문자, 전화) 상담이 가능합니다.
          </p>
          <p class="ab-body">
            국내 전체 렌터사의 제휴 체결을 통해 장기렌트 / 리스사별 비교견적이 가능하며
            자동차 종합 플랫폼 구축으로 합리적인 견적과
            빠르게 변화하는 자동차 금융 시장에서 다년간의 상담 노하우로 고객님께 다가가고자 합니다.
          </p>
          <div class="ab-contact">
            <div v-reveal="{ delay: 300 }" class="ab-contact-item">
              <div>
                <p class="ab-contact-label">전화 상담</p>
                <p class="ab-contact-main">0507-1344-7898</p>
                <p class="ab-contact-sub">평일 09:00 ~ 18:00</p>
              </div>
            </div>
            <div v-reveal="{ delay: 400 }" class="ab-contact-item">
              <div>
                <p class="ab-contact-label">카카오톡</p>
                <p class="ab-contact-main">카카오톡id</p>
                <p class="ab-contact-sub">24시간 상담</p>
              </div>
            </div>
            <div v-reveal="{ delay: 500 }" class="ab-contact-item">
              <div>
                <p class="ab-contact-label">이메일</p>
                <p class="ab-contact-main">autowant@naver.com</p>
                <p class="ab-contact-sub">24시간 내 답변</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ④ 상담 신청 폼 -->
    <section class="search-banner">
      <div class="sb-container">
        <div v-reveal="{ dir: 'left' }" class="sb-left">
          <p class="section-tag light">차량 찾기</p>
          <h2 class="sb-headline">원하는 차량을<br>찾아드립니다</h2>
          <p class="sb-desc">차량 정보와 연락처를 남겨주시면<br>전문 매니저가 빠르게 연락드립니다.</p>
        </div>
        <div v-reveal="{ delay: 200, dir: 'right' }" class="sb-right">
          <form class="sb-form" @submit.prevent="submitForm">
            <div class="sb-form-group">
              <p class="sb-form-label">차량 정보</p>
              <div class="sb-row">
                <div class="sb-field">
                  <label>차량 종류 <span class="sb-optional">(선택)</span></label>
                  <input type="text" v-model="form.carType" placeholder="예) GV80, 아반떼, 카니발" />
                </div>
                <div class="sb-field">
                  <label>차량 색상 <span class="sb-optional">(선택)</span></label>
                  <input type="text" v-model="form.carColor" placeholder="예) 흰색, 검정, 실버" />
                </div>
              </div>
            </div>
            <div class="sb-form-group">
              <p class="sb-form-label">고객 정보</p>
              <div class="sb-row">
                <div class="sb-field">
                  <label>성함 <span class="sb-required">(필수)</span></label>
                  <input type="text" v-model="form.name" placeholder="이름을 입력하세요" @input="form.name = form.name.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')" />
                </div>
                <div class="sb-field">
                  <label>연락처 <span class="sb-required">(필수)</span></label>
                  <input type="tel" v-model="form.phone" placeholder="010-0000-0000" @input="formatAboutPhone" maxlength="13" />
                </div>
              </div>
              <div class="sb-row">
                <div class="sb-field">
                  <label>이메일 <span class="sb-required">(필수)</span></label>
                  <input type="email" v-model="form.email" placeholder="example@email.com" />
                </div>
                <div class="sb-field">
                  <label>상담 가능 시간 <span class="sb-optional">(선택)</span></label>
                  <input type="text" v-model="form.availableTime" placeholder="예) 평일 오후 2~6시" />
                </div>
              </div>
              <div class="sb-field sb-field-full">
                <label>내용 <span class="sb-optional">(선택)</span></label>
                <textarea v-model="form.message" placeholder="문의하실 내용을 자유롭게 적어주세요." rows="4"></textarea>
              </div>
            </div>
            <label class="sb-agree">
              <input type="checkbox" v-model="form.agree" />
              <span class="sb-agree-box">
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span class="sb-agree-text">개인정보 수집·이용에 동의합니다 <span class="sb-agree-required">(필수)</span> <button type="button" class="sb-privacy-link" @click.prevent="openPrivacy">[보기]</button></span>
            </label>
            <button type="submit" class="sb-submit">상담 신청하기 →</button>
          </form>
        </div>
      </div>
    </section>

    <!-- ⑤ 핵심 가치 -->
    <section class="values-section">
      <div class="vl-container">
        <div v-reveal class="vl-head">
          <p class="section-tag">핵심 가치</p>
          <h2 class="vl-headline">오토원트의 약속</h2>
        </div>
        <div class="vl-list">
          <div class="vl-row" v-for="(v, i) in values" :key="v.title" v-reveal="{ delay: i * 150 }">
            <span class="vl-num">0{{ i + 1 }}</span>
            <div class="vl-content">
              <h3 class="vl-title">{{ v.title }}</h3>
              <p class="vl-desc">{{ v.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ 서비스 -->
    <section class="service-section">
      <div class="sv-container">
        <p v-reveal class="section-tag">서비스</p>
        <h2 v-reveal="{ delay: 100 }" class="sv-headline">오토원트의 서비스</h2>
        <div class="sv-grid">
          <router-link v-for="(s, i) in services" :key="s.title" :to="s.link" class="sv-card" v-reveal="{ delay: i * 120, dir: 'scale' }">
            <div class="sv-card-num">0{{ i + 1 }}</div>
            <h3 class="sv-card-title">{{ s.title }}</h3>
            <p class="sv-card-desc">{{ s.desc }}</p>
            <div class="sv-card-footer">
              <span class="sv-card-tag">{{ s.tag }}</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M11 4.5L9.95 5.55L14.15 9.75H2V11.25H14.15L9.95 15.45L11 16.5L17 10.5L11 4.5Z" fill="currentColor"/></svg>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ⑦ 매니저 CTA -->
    <section class="manager-section">
      <div class="mg-container">
        <p v-reveal class="section-tag light">팀 소개</p>
        <h2 v-reveal="{ delay: 100, dir: 'scale' }" class="mg-headline">전문 매니저가<br>함께합니다.</h2>
        <p v-reveal="{ delay: 200 }" class="mg-sub">차량·금융·보험까지 아는 진짜 전문가가 처음부터 끝까지 동행합니다.</p>
        <router-link v-reveal="{ delay: 300, dir: 'scale' }" to="/managers" class="mg-btn">매니저 만나보기 →</router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, inject } from 'vue'
import { addInquiry } from '../stores/inquiries'

const openPrivacy = inject('openPrivacy')

let isSnapping = false
let targetScrollY = 0
let currentScrollY = 0
let rafId = null

function lerp(a, b, t) {
  return a + (b - a) * t
}

function startMomentumLoop() {
  if (rafId) return
  function loop() {
    currentScrollY = lerp(currentScrollY, targetScrollY, 0.25)
    const diff = Math.abs(currentScrollY - targetScrollY)
    if (diff > 0.5) {
      window.scrollTo(0, currentScrollY)
      rafId = requestAnimationFrame(loop)
    } else {
      window.scrollTo(0, targetScrollY)
      rafId = null
    }
  }
  rafId = requestAnimationFrame(loop)
}

function snapScrollTo(target) {
  isSnapping = true
  const start = window.scrollY
  const distance = target - start
  const duration = 900
  let startTime = null

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime
    const progress = Math.min(elapsed / duration, 1)
    const y = start + distance * easeOutCubic(progress)
    window.scrollTo(0, y)
    currentScrollY = y
    targetScrollY = y
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      window.scrollTo(0, target)
      currentScrollY = target
      targetScrollY = target
      isSnapping = false
    }
  }
  requestAnimationFrame(step)
}

function onWheel(e) {
  e.preventDefault()

  if (isSnapping) return

  const heroSection = document.querySelector('.hero-section')
  const nextSection = document.querySelector('.about-section')
  if (!heroSection || !nextSection) return

  const heroHeight = heroSection.offsetHeight
  const nextTop = nextSection.offsetTop
  const atHero = window.scrollY < heroHeight * 0.5

  if (atHero && e.deltaY > 0) {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    snapScrollTo(nextTop - 60)
    return
  }

  const maxScroll = document.body.scrollHeight - window.innerHeight
  targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY + e.deltaY * 0.85))
  currentScrollY = window.scrollY
  startMomentumLoop()
}

onMounted(() => {
  currentScrollY = window.scrollY
  targetScrollY = window.scrollY
  window.addEventListener('wheel', onWheel, { passive: false })
})
onUnmounted(() => {
  window.removeEventListener('wheel', onWheel)
  if (rafId) cancelAnimationFrame(rafId)
  isSnapping = false
})

const form = reactive({ carType: '', carColor: '', name: '', phone: '', email: '', availableTime: '', message: '', agree: false })

function formatAboutPhone() {
  const nums = form.phone.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) form.phone = nums
  else if (nums.length <= 7) form.phone = `${nums.slice(0, 3)}-${nums.slice(3)}`
  else form.phone = `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
}

function submitForm() {
  if (!form.name) return alert('이름을 입력해주세요')
  if (!/^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]+$/.test(form.name)) return alert('이름은 한글 또는 영어만 입력 가능합니다')
  if (!/^\d{3}-\d{4}-\d{4}$/.test(form.phone)) return alert('연락처를 010-0000-0000 형식으로 입력해주세요')
  if (!form.email) return alert('이메일을 입력해주세요')
  if (!form.agree) return alert('개인정보 수집·이용에 동의해주세요')
  addInquiry({ ...form, availableTime: '' })
  Object.keys(form).forEach(k => form[k] = '')
  form.agree = false
  alert('상담 신청이 완료되었습니다. 빠르게 연락드리겠습니다.')
}



const values = [
  { title: '합리적인 가격', desc: '20개 이상 파트너 업체를 실시간 비교하여 항상 최저가를 제공합니다. 숨겨진 비용은 없습니다.' },
  { title: '투명한 견적', desc: '계약 전 모든 비용을 한눈에 확인. 불필요한 옵션 강요 없는 정직한 견적을 드립니다.' },
  { title: '전문 1:1 상담', desc: '전문 매니저가 상담부터 출고까지 고객의 곁에서 최적의 선택을 도와드립니다.' },
  { title: '빠른 출고', desc: '즉시출고 차량을 상시 보유. 계약 후 평균 3일 이내 원하는 차량을 받아보세요.' },
]

const services = [
  { title: '장기 렌트', desc: '월 고정 비용으로 보험·세금·정비까지 포함. 유지비 걱정 없는 합리적인 이동 솔루션.', tag: '장기 렌트', link: '/' },
  { title: '금융 리스', desc: '세금 혜택과 함께 내 차처럼 이용하는 리스. 법인·개인사업자에게 최적화.', tag: '금융 리스', link: '/' },
  { title: '즉시 출고', desc: '재고 보유 차량으로 계약 후 3일 이내 출고. 급하게 차량이 필요한 분을 위한 빠른 서비스.', tag: '즉시 출고', link: '/immediate-stock' },
  { title: '이달의 특가', desc: '매달 엄선된 최저가 특가 차량. 한정 수량이니 빠르게 확인하세요.', tag: '이달의 특가', link: '/monthly-special' },
]
</script>

<style scoped>
/* ── 기본 ── */
.about-page { background: #0d0d0d; color: #fff; }

.section-tag { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin: 0 0 16px; display: block; }
.section-tag.light { color: rgba(255,255,255,0.35); }

/* 히어로 등장 애니메이션 */
.hero-anim {
  opacity: 0; transform: translateY(30px);
  animation: heroFadeUp 0.8s ease forwards;
}
.hero-anim-1 { animation-delay: 0.2s; }
.hero-anim-2 { animation-delay: 0.5s; }
.hero-anim-3 { animation-delay: 0.8s; }
.hero-anim-4 { animation-delay: 1.2s; }
@keyframes heroFadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* ── ① 히어로 ── */
.hero-section {
  position: relative; height: 100vh; min-height: 640px;
  display: flex; align-items: stretch; overflow: hidden;
}
.hero-bg { position: absolute; inset: 0; background: #0d0d0d; }
/* AUTOWANT 텍스트 끝 지점(약 170px)부터 오른쪽으로 이미지 노출 */
.hero-img-wrap {
  position: absolute;
  top: 0; bottom: 0; right: 0;
  left: max(0px, calc((100% - 1200px) / 2 + 170px));
}
.hero-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: left center;
  display: block;
  opacity: 0; transform: scale(1.1) translateY(30px);
  animation: heroImgReveal 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
}
@keyframes heroImgReveal {
  to { opacity: 0.6; transform: scale(1) translateY(0); }
}
.hero-img[src=""] { display: none; }
.hero-img-fade {
  position: absolute; inset: 0;
  background: linear-gradient(to right, #0d0d0d 0%, transparent 30%);
  opacity: 0; animation: heroFadeIn 1s ease 0.8s forwards;
}
@keyframes heroFadeIn { to { opacity: 1; } }
.hero-noise {
  position: absolute; inset: 0; z-index: 1; opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
}
.hero-gradient {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%);
}
.hero-inner {
  position: relative; z-index: 3; width: 100%;
  max-width: 1200px; margin: 0 auto; padding: 0 32px;
  display: flex; flex-direction: column; justify-content: space-between;
  padding-top: 100px; padding-bottom: 60px;
}
.hero-top { display: flex; align-items: center; justify-content: space-between; }
.hero-badge {
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18);
  color: #fff; padding: 5px 14px; border-radius: 100px;
}
.hero-year { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 3px; }
.hero-center { padding: 20px 0; }
.hero-num {
  font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; color: rgba(255,255,255,0.06);
  line-height: 1; letter-spacing: -2px; margin-bottom: -16px; user-select: none;
}
.hero-title {
  font-size: clamp(1.8rem, 4.5vw, 3.6rem); font-weight: 800;
  color: #fff; line-height: 1.18; letter-spacing: -1px; margin: 0;
}
.hero-title em { font-style: italic; color: rgba(255,255,255,0.5); }
.hero-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.hero-sub { font-size: 13px; color: rgba(255,255,255,0.4); letter-spacing: 1px; margin: 0; }
.hero-cta {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 28px;
  background: transparent; color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-decoration: none; text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.3); border-radius: 100px;
  transition: background 0.25s, border-color 0.25s, gap 0.25s;
}
.hero-cta:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.7); gap: 16px; }

/* ── ② Quick Menu ── */
.quick-section { background: #141414; border-top: 1px solid rgba(255,255,255,0.06); }
.qk-container { max-width: 1200px; margin: 0 auto; padding: 48px 32px; display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: center; }
@media (max-width: 768px) { .qk-container { grid-template-columns: 1fr; gap: 24px; } }
.qk-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; color: rgba(255,255,255,0.3); display: block; margin-bottom: 8px; }
.qk-sub { font-size: 13px; color: rgba(255,255,255,0.4); margin: 0; line-height: 1.6; }
.qk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.06); }
@media (max-width: 768px) { .qk-grid { grid-template-columns: repeat(2, 1fr); } }
.qk-item {
  background: #141414; padding: 24px 20px;
  display: flex; flex-direction: column; gap: 0;
  text-decoration: none; transition: background 0.2s; position: relative;
  justify-content: space-between;
}
.qk-item:hover { background: #1e1e1e; }
.qk-item-inner { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.qk-icon { width: 22px; height: 22px; color: rgba(255,255,255,0.4); flex-shrink: 0; }
.qk-title { font-size: 13.5px; font-weight: 700; color: #fff; }
.qk-en { font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.5px; }
.qk-arrow { color: rgba(255,255,255,0.2); transition: color 0.2s, transform 0.2s; }
.qk-item:hover .qk-arrow { color: #fff; transform: translateX(3px); }

/* ── ③ About 본문 ── */
.about-section { background: #0d0d0d; padding: 100px 0 140px; clip-path: polygon(0 0, 100% 0, 100% 100%, 44% 100%, 39% calc(100% - 70px), 0 calc(100% - 70px)); margin-bottom: -70px; position: relative; z-index: 5; transition: transform 0.6s ease, opacity 0.6s ease; }
.ab-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 80px; align-items: start; }
@media (max-width: 768px) { .ab-container { grid-template-columns: 1fr; gap: 40px; } }
.ab-headline { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: #fff; line-height: 1.2; letter-spacing: -1px; margin: 0; }
.ab-body { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.85; margin: 0 0 18px; }
.ab-contact { display: flex; gap: 0; margin-top: 48px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); }
@media (max-width: 768px) { .ab-contact { flex-direction: column; } }
.ab-contact-item { flex: 1; padding: 0 28px 0 0; }
.ab-contact-item + .ab-contact-item { padding-left: 28px; border-left: 1px solid rgba(255,255,255,0.08); }
@media (max-width: 768px) { .ab-contact-item { padding: 20px 0; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.08); } }
.ab-contact-label { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; color: rgba(255,255,255,0.25); margin: 0 0 10px; text-transform: uppercase; }
.ab-contact-main { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 6px; letter-spacing: -0.3px; }
.ab-contact-sub { font-size: 11px; color: rgba(255,255,255,0.3); margin: 0; }
.ab-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 32px; }
.ab-stat { }
.ab-stat-num { display: block; font-size: 1.6rem; font-weight: 900; color: #fff; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
.ab-stat-label { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1px; }

/* ── ④ 상담 폼 ── */
.search-banner { background: #141414; padding: 100px 0 140px; clip-path: polygon(0 0, 100% 0, 100% 100%, 44% 100%, 39% calc(100% - 70px), 0 calc(100% - 70px)); margin-bottom: -70px; position: relative; z-index: 4; transition: transform 0.6s ease, opacity 0.6s ease; }
.sb-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start; }
@media (max-width: 900px) { .sb-container { grid-template-columns: 1fr; gap: 40px; } }
.sb-headline { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: #fff; line-height: 1.2; letter-spacing: -1px; margin: 0 0 16px; }
.sb-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.8; margin: 0; }
.sb-form { display: flex; flex-direction: column; gap: 32px; }
.sb-form-group { display: flex; flex-direction: column; gap: 16px; }
.sb-form-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.3); margin: 0 0 4px; text-transform: uppercase; }
.sb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 560px) { .sb-row { grid-template-columns: 1fr; } }
.sb-field { display: flex; flex-direction: column; gap: 6px; }
.sb-field-full { grid-column: 1 / -1; }
.sb-field label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.5px; }
.sb-field input,
.sb-field textarea {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: #fff;
  font-size: 13px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  resize: vertical;
}
.sb-field input::placeholder,
.sb-field textarea::placeholder { color: rgba(255,255,255,0.2); }
.sb-field input:focus,
.sb-field textarea:focus { border-color: rgba(255,255,255,0.35); background: rgba(255,255,255,0.08); }
.sb-agree {
  display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none;
}
.sb-agree input[type="checkbox"] { display: none; }
.sb-agree-box {
  width: 18px; height: 18px; flex-shrink: 0;
  border: 1.5px solid rgba(255,255,255,0.2); border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: transparent; transition: all 0.2s;
}
.sb-agree input:checked + .sb-agree-box {
  background: #fff; border-color: #fff; color: #111;
}
.sb-agree-text { font-size: 12px; color: rgba(255,255,255,0.45); }
.sb-agree-required { color: rgba(255,255,255,0.25); }
.sb-privacy-link {
  background: none; border: none; color: rgba(255,255,255,0.4); font-size: 12px; font-weight: 600;
  cursor: pointer; padding: 0; margin-left: 4px;
}
.sb-privacy-link:hover { color: #4d8ef7; }
.sb-required { font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 400; }
.sb-optional { font-size: 10px; color: rgba(255,255,255,0.2); font-weight: 400; }
.sb-submit {
  align-self: flex-start;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 28px;
  background: transparent; color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.3); border-radius: 100px; cursor: pointer;
  font-family: inherit;
  transition: background 0.25s, border-color 0.25s, gap 0.25s;
}
.sb-submit:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.7); gap: 16px; }

/* ── ⑤ 핵심 가치 ── */
.values-section { background: #0d0d0d; padding: 100px 0 140px; clip-path: polygon(0 0, 100% 0, 100% 100%, 44% 100%, 39% calc(100% - 70px), 0 calc(100% - 70px)); margin-bottom: -70px; position: relative; z-index: 3; }
.vl-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.vl-head { margin-bottom: 56px; }
.vl-headline { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: #fff; margin: 0; letter-spacing: -1px; }
.vl-list { display: flex; flex-direction: column; }
.vl-row {
  display: grid; grid-template-columns: 72px 1fr;
  padding: 28px 0; border-top: 1px solid rgba(255,255,255,0.07); gap: 24px;
  transition: background 0.15s;
}
.vl-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.07); }
.vl-num { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.2); letter-spacing: 2px; padding-top: 3px; }
.vl-title { font-size: 15px; font-weight: 800; color: #fff; margin: 0 0 8px; }
.vl-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.7; margin: 0; }

/* ── ⑥ 서비스 ── */
.service-section { background: #141414; padding: 100px 0 140px; clip-path: polygon(0 0, 100% 0, 100% 100%, 44% 100%, 39% calc(100% - 70px), 0 calc(100% - 70px)); margin-bottom: -70px; position: relative; z-index: 2; }
.sv-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.sv-headline { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: #fff; margin: 0 0 56px; letter-spacing: -1px; }
.sv-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: rgba(255,255,255,0.06); }
@media (max-width: 1024px) { .sv-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .sv-grid { grid-template-columns: 1fr; } }
.sv-card {
  background: #141414; padding: 32px 24px;
  display: flex; flex-direction: column;
  text-decoration: none; transition: background 0.2s;
}
.sv-card:hover { background: #1a1a1a; }
.sv-card-num { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.2); letter-spacing: 2px; margin-bottom: 28px; }
.sv-card-title { font-size: 15px; font-weight: 800; color: #fff; margin: 0 0 12px; }
.sv-card-desc { font-size: 12.5px; color: rgba(255,255,255,0.4); line-height: 1.7; margin: 0; flex: 1; }
.sv-card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); }
.sv-card-tag { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.2); }
.sv-card-footer svg { color: rgba(255,255,255,0.2); transition: color 0.2s, transform 0.2s; }
.sv-card:hover .sv-card-footer svg { color: #fff; transform: translateX(3px); }

/* ── ⑦ 매니저 CTA ── */
.manager-section { background: #0d0d0d; padding: 100px 0; position: relative; z-index: 1; }
.mg-container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.mg-headline { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: #fff; line-height: 1.2; letter-spacing: -1px; margin: 0 0 20px; }
.mg-sub { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.8; margin: 0 0 40px; }
.mg-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 28px;
  background: transparent; color: #fff;
  font-size: 11px; font-weight: 700; letter-spacing: 2px; text-decoration: none; text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.3); border-radius: 100px;
  transition: background 0.25s, border-color 0.25s, gap 0.25s;
}
.mg-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.7); gap: 16px; }
</style>
