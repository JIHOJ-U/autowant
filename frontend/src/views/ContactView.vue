<template>
  <div class="page">
    <!-- 히어로 -->
    <div class="ct-hero">
      <div class="ct-hero-bg"></div>
      <div class="container ct-hero-inner">
        <p class="ct-brand"><span class="ct-brand-b">AUTO</span><span class="ct-brand-a">WANT</span></p>
        <span class="ct-eyebrow">CONTACT US</span>
        <h1>문의하기</h1>
        <p class="ct-hero-sub">전문 매니저가 빠르게 연락드리겠습니다</p>
      </div>
    </div>

    <div class="container">

      <!-- 폼 -->
      <div v-reveal="{ delay: 100 }" class="form-card">
        <!-- 접수 완료 화면 -->
        <transition name="success-fade">
          <div v-if="submitted" class="success-screen">
            <div class="success-check">
              <svg class="check-svg" viewBox="0 0 52 52">
                <circle class="check-circle" cx="26" cy="26" r="24" fill="none" stroke="#111" stroke-width="2"/>
                <path class="check-path" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16"/>
              </svg>
            </div>
            <h3 class="success-title">문의가 접수되었습니다!</h3>
            <p class="success-sub">전문 매니저가 빠르게 연락드리겠습니다</p>
            <button class="submit-btn" style="margin-top: 24px;" @click="resetForm">새로운 문의하기</button>
          </div>
        </transition>

        <!-- 폼 화면 -->
        <transition name="form-fade">
          <div v-if="!submitted">
            <v-form ref="form" @submit.prevent="submitForm">
              <div class="form-group">
                <p class="form-group-label">차량 정보</p>
                <div class="form-grid">
                  <div class="form-field">
                    <label>차량 종류 <span class="optional">(선택)</span></label>
                    <input v-model="formData.vehicle" placeholder="예) GV80, 아반떼, 카니발" />
                  </div>
                  <div class="form-field">
                    <label>차량 색상 <span class="optional">(선택)</span></label>
                    <input v-model="formData.carColor" placeholder="예) 흰색, 검정, 실버" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <p class="form-group-label">고객 정보</p>
                <div class="form-grid">
                  <div class="form-field">
                    <label>성함 <span class="required">(필수)</span></label>
                    <input v-model="formData.name" placeholder="이름을 입력하세요" @input="filterName" />
                  </div>
                  <div class="form-field">
                    <label>연락처 <span class="required">(필수)</span></label>
                    <input v-model="formData.phone" placeholder="010-0000-0000" @input="formatPhone" maxlength="13" />
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-field">
                    <label>이메일 <span class="required">(필수)</span></label>
                    <input v-model="formData.email" type="email" placeholder="example@email.com" />
                  </div>
                  <div class="form-field">
                    <label>상담 유형 <span class="required">(필수)</span></label>
                    <select v-model="formData.interest">
                      <option value="" disabled>선택해주세요</option>
                      <option>장기렌트</option>
                      <option>리스</option>
                      <option>즉시출고</option>
                      <option>이달의 특가</option>
                      <option>기타</option>
                    </select>
                  </div>
                </div>
                <div class="form-field form-field-full">
                  <label>내용 <span class="optional">(선택)</span></label>
                  <textarea v-model="formData.message" placeholder="문의하실 내용을 자유롭게 적어주세요." rows="4"></textarea>
                </div>
              </div>

              <label class="form-agree">
                <input type="checkbox" v-model="formData.agree" />
                <span class="agree-box">
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7.5L10 1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <span>개인정보 수집·이용에 동의합니다 <span class="required">(필수)</span> <button type="button" class="privacy-link" @click.prevent="openPrivacy">[보기]</button></span>
              </label>
              <button type="submit" class="submit-btn">상담 신청하기 →</button>
            </v-form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { addInquiry } from '../stores/inquiries'

const openPrivacy = inject('openPrivacy')

const route = useRoute()
const form = ref(null)
const formData = ref({ name: '', phone: '', interest: '', vehicle: '', carColor: '', email: '', message: '', agree: false })
const submitted = ref(false)

const nameRules = [
  v => !!v || '필수',
  v => /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]*$/.test(v) || '한글 또는 영어만 입력 가능합니다',
]
const phoneRules = [
  v => !!v || '필수',
  v => /^\d{3}-\d{4}-\d{4}$/.test(v) || '010-0000-0000 형식으로 입력해주세요',
]

function filterName() {
  formData.value.name = formData.value.name.replace(/[^a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '')
}

function formatPhone() {
  const nums = formData.value.phone.replace(/\D/g, '').slice(0, 11)
  if (nums.length <= 3) formData.value.phone = nums
  else if (nums.length <= 7) formData.value.phone = `${nums.slice(0, 3)}-${nums.slice(3)}`
  else formData.value.phone = `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`
}

onMounted(() => {
  if (route.query.vehicle) {
    formData.value.vehicle = `${route.query.brand || ''} ${route.query.vehicle}`.trim()
    formData.value.interest = '장기렌트'
  }
})

async function submitForm() {
  if (!formData.value.name) return alert('이름을 입력해주세요')
  if (!/^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣\s]+$/.test(formData.value.name)) return alert('이름은 한글 또는 영어만 입력 가능합니다')
  if (!/^\d{3}-\d{4}-\d{4}$/.test(formData.value.phone)) return alert('연락처를 010-0000-0000 형식으로 입력해주세요')
  if (!formData.value.email) return alert('이메일을 입력해주세요')
  if (!formData.value.interest) return alert('상담 유형을 선택해주세요')
  if (!formData.value.agree) return alert('개인정보 수집·이용에 동의해주세요')

  addInquiry({
    carType: formData.value.vehicle,
    carColor: formData.value.carColor,
    name: formData.value.name,
    phone: formData.value.phone,
    email: formData.value.email,
    availableTime: '',
    message: formData.value.message || formData.value.interest || '',
  })
  submitted.value = true
}

function resetForm() {
  submitted.value = false
  formData.value = { name: '', phone: '', interest: '', vehicle: '', carColor: '', email: '', message: '', agree: false }
}
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
.page { padding: 0 0 48px; background: linear-gradient(180deg, #eef4ff 0%, #f8faff 40%, #fff 100%); }

/* 히어로 */
.ct-hero {
  position: relative; overflow: hidden;
  padding: 100px 0 80px;
  background: url('/images/cars/car9.jpg') center/cover no-repeat;
  min-height: 340px;
}
.ct-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(26,26,46,0.2), rgba(22,33,62,0.25), rgba(15,52,96,0.2));
}
.ct-hero-inner { position: relative; z-index: 1; text-align: left; }
.ct-brand { font-size: 1.1rem; font-weight: 900; margin: 0 0 16px; letter-spacing: -0.5px; }
.ct-brand-b { color: white; }
.ct-brand-a { color: rgba(255,255,255,0.5); }
.ct-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #f59e0b; margin: 0 0 10px; display: block; }
.ct-hero h1 { font-size: 2.2rem; font-weight: 900; color: white; margin: 0 0 8px; letter-spacing: -0.5px; }
.ct-hero-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin: 0; }

.form-card {
  border: none; border-radius: 16px; padding: 40px 36px; position: relative; overflow: hidden; margin-top: 36px;
  background: white; box-shadow: 0 8px 40px rgba(77,142,247,0.08), 0 2px 8px rgba(0,0,0,0.03);
}

.form-group { margin-bottom: 24px; }
.form-group-label {
  font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  color: #999; margin: 0 0 14px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0;
}
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; margin-bottom: 12px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

.form-field { display: flex; flex-direction: column; }
.form-field label { font-size: 12px; font-weight: 600; color: #555; margin-bottom: 6px; }
.form-field .required { font-size: 10px; color: #ccc; font-weight: 500; }
.form-field .optional { font-size: 10px; color: #ddd; font-weight: 400; }
.form-field input, .form-field select, .form-field textarea {
  padding: 10px 14px; border: 1px solid #e5e5e5; border-radius: 6px;
  font-size: 14px; color: #333; outline: none; font-family: inherit;
  transition: border-color 0.15s; background: #fafafa;
}
.form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: #4d8ef7; background: white; }
.form-field input::placeholder, .form-field textarea::placeholder { color: #bbb; }
.form-field select { appearance: none; background: #fafafa url("data:image/svg+xml,%3Csvg viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 12px center / 10px; }
.form-field textarea { resize: vertical; }
.form-field-full { grid-column: 1 / -1; }

.form-agree {
  display: flex; align-items: center; gap: 10px; margin: 20px 0;
  cursor: pointer; font-size: 13px; color: #666;
}
.form-agree input[type="checkbox"] { display: none; }
.agree-box {
  width: 20px; height: 20px; border: 1.5px solid #ddd; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: transparent; transition: all 0.15s; flex-shrink: 0;
}
.form-agree input:checked + .agree-box { background: #10b981; border-color: #10b981; color: white; }
.form-agree .required { font-size: 10px; color: #ccc; }
.privacy-link {
  background: none; border: none; color: #4d8ef7; font-size: 12px; font-weight: 600;
  cursor: pointer; padding: 0; margin-left: 4px;
}
.privacy-link:hover { text-decoration: underline; }

.submit-btn {
  width: 100%; padding: 14px; background: linear-gradient(135deg, #3182f6, #2563eb); color: white; border: none; border-radius: 10px;
  font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(49,130,246,0.25);
}
.submit-btn:hover { box-shadow: 0 6px 20px rgba(49,130,246,0.35); transform: translateY(-1px); }

/* 접수 완료 화면 */
.success-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  text-align: center;
}
.success-check { width: 72px; height: 72px; margin-bottom: 24px; }
.check-svg { width: 72px; height: 72px; }
.check-circle {
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  animation: circleIn 0.5s ease 0.1s forwards;
}
.check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  animation: checkIn 0.35s ease 0.5s forwards;
}
@keyframes circleIn { to { stroke-dashoffset: 0; } }
@keyframes checkIn { to { stroke-dashoffset: 0; } }
.success-title { font-size: 20px; font-weight: 800; color: #111; margin: 0 0 6px; }
.success-sub { font-size: 13px; color: #999; margin: 0; }

/* 트랜지션 */
.form-fade-enter-active, .form-fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.form-fade-enter-from { opacity: 0; transform: translateY(10px); }
.form-fade-leave-to { opacity: 0; transform: translateY(-10px); }
.success-fade-enter-active { transition: opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s; }
.success-fade-enter-from { opacity: 0; transform: scale(0.95); }
</style>
