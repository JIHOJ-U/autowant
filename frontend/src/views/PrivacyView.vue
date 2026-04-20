<template>
  <div class="privacy-page">
    <div class="privacy-hero">
      <div class="privacy-hero-bg"></div>
      <div class="container privacy-hero-inner">
        <p class="privacy-eyebrow" data-aos="fade-down">PRIVACY POLICY</p>
        <h1 class="privacy-title" data-aos="fade-up">개인정보처리방침</h1>
        <p class="privacy-sub" data-aos="fade-up" data-aos-delay="100">오토원트는 고객님의 개인정보를 소중히 보호합니다</p>
      </div>
    </div>

    <div class="container privacy-content">
      <section class="pp-section" v-for="(sec, si) in sections" :key="si" data-aos="fade-up" :data-aos-delay="si * 80">
        <div class="pp-section-head">
          <span class="pp-num">{{ String(si + 1).padStart(2, '0') }}</span>
          <h2>{{ sec.title }}</h2>
        </div>

        <div v-if="sec.table" class="pp-table-wrap">
          <table class="pp-table">
            <thead><tr><th v-for="h in sec.table.head" :key="h">{{ h }}</th></tr></thead>
            <tbody>
              <tr v-for="(row, ri) in sec.table.rows" :key="ri">
                <td v-for="(cell, ci) in row" :key="ci" :class="{ 'pp-label-cell': ci === 0 }">
                  <span v-if="ci === 0 && sec.table.badges" class="pp-badge" :class="sec.table.badges[ri]">{{ cell }}</span>
                  <template v-else>{{ cell }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="sec.notes" class="pp-note">
          <p v-for="(n, ni) in sec.notes" :key="ni">{{ n }}</p>
        </div>

        <div v-if="sec.contact" class="pp-info-card">
          <p>고객은 개인정보 <strong>열람, 정정, 삭제, 처리정지</strong>를 요구할 수 있으며, 아래 연락처로 요청 가능합니다.</p>
          <div class="pp-contact-row">
            <div class="pp-contact">
              <span class="pp-contact-label">이메일</span>
              <span class="pp-contact-value">autowant@naver.com</span>
            </div>
            <div class="pp-contact">
              <span class="pp-contact-label">전화</span>
              <span class="pp-contact-value">0507-1344-7898</span>
            </div>
          </div>
        </div>
      </section>

      <div class="pp-footer-note" data-aos="fade-up">
        <p>본 방침은 오토원트(사업자등록번호: 609-88-02424)의 서비스 이용을 위한 것입니다.</p>
        <p>시행일자: 2025년 1월 1일</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const sections = [
  {
    title: '개인정보 수집 및 이용 동의',
    table: {
      head: ['구분', '목적', '항목', '보유기간'],
      badges: ['required', 'optional'],
      rows: [
        ['필수', '서비스 이용에 따른 본인 식별, 실명확인, 가입의사 확인, 연령제한 서비스 이용', '이름, 휴대전화번호, 이메일, 상담유형', '회원탈퇴 후 1년 또는 이용목적 달성 시'],
        ['선택', '서비스 관련 정보 안내, 이벤트 참여', '차량 종류/색상, 상담 가능 시간, 문의 내용', '동의 철회 시 또는 수집 목적 달성 시'],
      ]
    },
    notes: [
      '동의를 거부할 수 있으며, 거부 시에도 서비스 이용이 가능합니다. 다만 필수 항목 미동의 시 상담 서비스 이용이 제한될 수 있습니다.',
      '수집된 개인정보는 상담 목적 외에 사용되지 않으며, 개인정보 보호법에 따라 안전하게 관리됩니다.'
    ]
  },
  {
    title: '개인정보의 제3자 제공',
    table: {
      head: ['제공받는 자', '제공 항목', '제공 목적', '보유기간'],
      rows: [
        ['제휴 렌터사/금융사 (현대캐피탈, KB캐피탈, 롯데렌탈 등)', '이름, 연락처, 차량 정보, 문의 내용', '렌트/리스 견적 비교 및 계약 진행', '제공 목적 달성 시'],
      ]
    }
  },
  {
    title: '개인정보 처리 위탁',
    table: {
      head: ['수탁업체', '위탁 업무 내용'],
      rows: [
        ['오토원트', '고객 상담, 서비스 안내, 계약 관련 업무'],
      ]
    }
  },
  {
    title: '고객(이용자)의 권리 및 행사',
    contact: true,
    notes: ['본 동의는 오토원트(사업자등록번호: 609-88-02424)의 서비스 이용을 위한 것입니다.']
  },
]

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
  els.forEach(el => observer.observe(el))
}
onMounted(initAos)
</script>

<style scoped>
.privacy-page { padding: 0; }

/* AOS */
[data-aos] { opacity: 0; transition: opacity 0.6s ease, transform 0.6s ease; }
[data-aos="fade-up"] { transform: translateY(24px); }
[data-aos="fade-down"] { transform: translateY(-24px); }
[data-aos].aos-in { opacity: 1; transform: none; }

/* 히어로 */
.privacy-hero {
  position: relative; overflow: hidden;
  padding: 100px 0 70px; text-align: center;
}
.privacy-hero-bg {
  position: absolute; inset: 0;
  background: url('/images/j.jpg') center/cover no-repeat;
}
.privacy-hero-bg::after {
  content: ''; position: absolute; inset: 0;
  background: rgba(15, 23, 42, 0.25);
}
.privacy-hero-inner { position: relative; z-index: 1; }
.privacy-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 5px; color: #3182f6; margin: 0 0 14px; text-transform: uppercase; }
.privacy-title { font-size: 2.2rem; font-weight: 900; color: #fff; margin: 0 0 12px; }
.privacy-sub { font-size: 15px; color: rgba(255,255,255,0.6); margin: 0; }

.container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
.privacy-content { padding: 48px 20px 80px; }

/* 섹션 */
.pp-section { margin-bottom: 40px; }
.pp-section-head {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 20px; padding-bottom: 14px;
  border-bottom: 2px solid #191f28;
}
.pp-num {
  font-size: 13px; font-weight: 900; color: #3182f6;
  background: #f0f6ff; padding: 6px 12px; border-radius: 6px;
  letter-spacing: 1px;
}
.pp-section-head h2 { font-size: 18px; font-weight: 800; color: #191f28; margin: 0; }

/* 테이블 */
.pp-table-wrap {
  overflow-x: auto; border-radius: 12px;
  border: 1px solid #eef0f3; margin-bottom: 16px;
}
.pp-table { width: 100%; border-collapse: collapse; min-width: 500px; }
.pp-table thead th {
  padding: 13px 16px; background: #f8f9fb;
  font-size: 13px; font-weight: 700; color: #191f28;
  text-align: left; border-bottom: 1px solid #e5e8eb;
}
.pp-table tbody td {
  padding: 14px 16px; font-size: 13px; color: #4e5968;
  border-bottom: 1px solid #f0f2f5; line-height: 1.65;
  vertical-align: top; text-align: left;
}
.pp-table tbody tr:last-child td { border-bottom: none; }
.pp-table tbody tr:hover td { background: #fafbfc; }
.pp-label-cell { font-weight: 600; }

.pp-badge {
  display: inline-block; padding: 3px 10px; border-radius: 4px;
  font-size: 11px; font-weight: 700;
}
.pp-badge.required { background: #fee2e2; color: #dc2626; }
.pp-badge.optional { background: #f0f6ff; color: #3182f6; }

/* 노트 */
.pp-note {
  padding: 16px 20px; background: #f8f9fb; border-radius: 10px;
  border-left: 3px solid #e5e8eb; margin-top: 16px;
}
.pp-note p { font-size: 13px; color: #6b7684; line-height: 1.7; margin: 0; }
.pp-note p + p { margin-top: 6px; }

/* 연락처 카드 */
.pp-info-card {
  background: #f0f6ff; border-radius: 14px; padding: 28px;
  margin-bottom: 16px; border: 1px solid #d0e0ff;
}
.pp-info-card p { font-size: 14px; color: #333; margin: 0 0 18px; line-height: 1.7; }
.pp-info-card strong { color: #3182f6; }
.pp-contact-row { display: flex; gap: 24px; flex-wrap: wrap; }
.pp-contact { display: flex; align-items: center; gap: 10px; }
.pp-contact-label {
  font-size: 12px; font-weight: 700; color: #8b95a1;
  background: #fff; padding: 5px 12px; border-radius: 6px;
}
.pp-contact-value { font-size: 14px; font-weight: 700; color: #191f28; }

/* 하단 노트 */
.pp-footer-note {
  text-align: center; padding: 32px; background: #f8f9fb; border-radius: 14px;
}
.pp-footer-note p { font-size: 13px; color: #8b95a1; margin: 0; line-height: 1.8; }

@media (max-width: 768px) {
  .privacy-hero { padding: 70px 0 50px; }
  .privacy-title { font-size: 1.5rem; }
  .pp-section-head { flex-direction: column; align-items: flex-start; gap: 8px; }
  .pp-contact-row { flex-direction: column; gap: 12px; }
}
</style>
