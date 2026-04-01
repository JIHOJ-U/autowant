<template>
  <div class="page">
    <div class="container">
      <div v-reveal class="page-head">
        <h1>문의하기</h1>
        <p>전문 매니저가 빠르게 연락드리겠습니다</p>
      </div>

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
            <h3>견적 상담 신청</h3>
            <p class="form-sub">정보를 입력해주시면 매니저가 연락드립니다</p>

            <v-form ref="form" @submit.prevent="submitForm">
              <div class="form-grid">
                <v-text-field v-model="formData.name" label="이름" variant="outlined" density="compact" rounded="0" :rules="nameRules" @input="filterName" />
                <v-text-field v-model="formData.phone" label="연락처" placeholder="010-0000-0000" variant="outlined" density="compact" rounded="0" :rules="phoneRules" @input="formatPhone" maxlength="13" />
                <v-select v-model="formData.interest" :items="['장기렌트', '리스', '즉시출고', '이달의 특가', '기타']" label="상담 유형" variant="outlined" density="compact" rounded="0" />
                <v-text-field v-model="formData.vehicle" label="관심 차량 (선택)" variant="outlined" density="compact" rounded="0" />
              </div>
              <v-textarea v-model="formData.message" label="문의 내용" variant="outlined" density="compact" rounded="0" rows="3" class="mb-3" />
              <v-checkbox v-model="formData.agree" label="[필수] 개인정보 수집 및 이용 동의" :rules="[v => !!v || '동의 필요']" density="compact" class="mb-3" />
              <button type="submit" class="submit-btn">견적 문의하기</button>
            </v-form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { addInquiry } from '../stores/inquiries'

const route = useRoute()
const form = ref(null)
const formData = ref({ name: '', phone: '', interest: '', vehicle: '', message: '', agree: false })
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
  const { valid } = await form.value.validate()
  if (valid) {
    addInquiry({
      carType: formData.value.vehicle,
      carColor: '',
      name: formData.value.name,
      phone: formData.value.phone,
      email: '',
      availableTime: '',
      message: formData.value.message || formData.value.interest || '',
    })
    submitted.value = true
  }
}

function resetForm() {
  submitted.value = false
  formData.value = { name: '', phone: '', interest: '', vehicle: '', message: '', agree: false }
}
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
.page { padding: 36px 0 48px; }
.page-head { margin-bottom: 28px; }
.page-head h1 { font-size: 1.4rem; font-weight: 800; color: #111; }
.page-head p { font-size: 13px; color: #999; margin-top: 2px; }

.form-card { border: 1px solid #f0f0f0; border-radius: 4px; padding: 28px; position: relative; overflow: hidden; }
.form-card h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 4px; }
.form-sub { font-size: 13px; color: #999; margin: 0 0 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; margin-bottom: 8px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

.submit-btn {
  width: 100%; padding: 12px; background: #111; color: white; border: none; border-radius: 4px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s;
}
.submit-btn:hover { background: #333; }

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
