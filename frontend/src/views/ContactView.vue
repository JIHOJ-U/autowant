<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <h1>문의하기</h1>
        <p>전문 매니저가 빠르게 연락드리겠습니다</p>
      </div>

      <!-- 연락처 -->
      <div class="contact-row">
        <div class="contact-item">
          <p class="contact-label">전화 상담</p>
          <a href="tel:1800-0000" class="contact-value">1800-0000</a>
          <p class="contact-sub">평일 09:00 ~ 18:00</p>
        </div>
        <div class="contact-item">
          <p class="contact-label">카카오톡</p>
          <p class="contact-value">24시간 상담</p>
          <p class="contact-sub">카카오톡 채널 추가</p>
        </div>
        <div class="contact-item">
          <p class="contact-label">이메일</p>
          <p class="contact-value">info@autowant.co.kr</p>
          <p class="contact-sub">24시간 내 답변</p>
        </div>
      </div>

      <!-- 폼 -->
      <div class="form-card">
        <h3>견적 상담 신청</h3>
        <p class="form-sub">정보를 입력해주시면 매니저가 연락드립니다</p>

        <v-form ref="form" @submit.prevent="submitForm">
          <div class="form-grid">
            <v-text-field v-model="formData.name" label="이름" variant="outlined" density="compact" rounded="lg" :rules="[v => !!v || '필수']" />
            <v-text-field v-model="formData.phone" label="연락처" placeholder="010-0000-0000" variant="outlined" density="compact" rounded="lg" :rules="[v => !!v || '필수']" />
            <v-select v-model="formData.interest" :items="['장기렌트', '리스', '즉시출고', '이달의 특가', '기타']" label="관심 분야" variant="outlined" density="compact" rounded="lg" />
            <v-text-field v-model="formData.vehicle" label="관심 차량 (선택)" variant="outlined" density="compact" rounded="lg" />
          </div>
          <v-textarea v-model="formData.message" label="문의 내용" variant="outlined" density="compact" rounded="lg" rows="3" class="mb-3" />
          <v-checkbox v-model="formData.agree" label="[필수] 개인정보 수집 및 이용 동의" :rules="[v => !!v || '동의 필요']" density="compact" class="mb-3" />
          <button type="submit" class="submit-btn">견적 문의하기</button>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const form = ref(null)
const formData = ref({ name: '', phone: '', interest: '', vehicle: '', message: '', agree: false })

onMounted(() => {
  if (route.query.vehicle) {
    formData.value.vehicle = `${route.query.brand || ''} ${route.query.vehicle}`.trim()
    formData.value.interest = '장기렌트'
  }
})

async function submitForm() {
  const { valid } = await form.value.validate()
  if (valid) alert('견적 문의가 접수되었습니다. 전문 매니저가 곧 연락드리겠습니다.')
}
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
.page { padding: 36px 0 48px; }
.page-head { margin-bottom: 28px; }
.page-head h1 { font-size: 1.4rem; font-weight: 800; color: #111; }
.page-head p { font-size: 13px; color: #999; margin-top: 2px; }

.contact-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
@media (max-width: 600px) { .contact-row { grid-template-columns: 1fr; } }
.contact-item { border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px; text-align: center; }
.contact-label { font-size: 11px; color: #999; margin: 0 0 4px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.contact-value { font-size: 16px; font-weight: 700; color: #111; text-decoration: none; display: block; margin: 0 0 2px; }
.contact-sub { font-size: 11px; color: #bbb; margin: 0; }

.form-card { border: 1px solid #f0f0f0; border-radius: 12px; padding: 28px; }
.form-card h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 4px; }
.form-sub { font-size: 13px; color: #999; margin: 0 0 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; margin-bottom: 8px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

.submit-btn {
  width: 100%; padding: 12px; background: #111; color: white; border: none; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s;
}
.submit-btn:hover { background: #333; }
</style>
