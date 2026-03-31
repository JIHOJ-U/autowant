<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <h1>매니저 소개</h1>
        <p>경험 풍부한 전문 매니저가 최적의 조건을 찾아드립니다</p>
      </div>

      <div class="grid">
        <div v-for="m in managers" :key="m.id" class="manager-card">
          <div class="avatar">
            <span>{{ m.name.charAt(0) }}</span>
          </div>
          <h3>{{ m.name }}</h3>
          <p class="role">{{ m.role }} · {{ m.experience }}</p>
          <div class="tags">
            <span v-for="t in m.tags" :key="t" class="tag">{{ t }}</span>
          </div>
          <p class="intro">{{ m.intro }}</p>
          <div class="actions">
            <button class="btn-primary">전화 상담</button>
            <button class="btn-secondary">카톡 상담</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const managers = ref([
  { id: 1, name: '김오토', role: '수석 매니저', experience: '10년', tags: ['국산차', 'SUV', '리스'], intro: '예산과 상황에 맞는 최적의 조건을 찾아드립니다.' },
  { id: 2, name: '이원트', role: '매니저', experience: '7년', tags: ['수입차', '세단', '렌트'], intro: '수입차 전문으로 다양한 브랜드의 최저가를 확인해드립니다.' },
  { id: 3, name: '박딜러', role: '매니저', experience: '5년', tags: ['경차', '화물차', '법인'], intro: '경차부터 화물차까지 폭넓은 상담이 가능합니다.' },
  { id: 4, name: '최상담', role: '매니저', experience: '3년', tags: ['전기차', '하이브리드'], intro: '전기차와 하이브리드 차량 전문 상담사입니다.' },
])
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.page { padding: 36px 0 48px; }
.page-head { margin-bottom: 28px; }
.page-head h1 { font-size: 1.4rem; font-weight: 800; color: #111; }
.page-head p { font-size: 13px; color: #999; margin-top: 2px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
.manager-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; padding: 28px 20px; text-align: center; }
.avatar {
  width: 64px; height: 64px; border-radius: 50%; background: #111; color: white;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;
  font-size: 20px; font-weight: 700;
}
.manager-card h3 { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 4px; }
.role { font-size: 12px; color: #999; margin: 0 0 12px; }
.tags { display: flex; gap: 4px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
.tag { font-size: 11px; padding: 3px 10px; background: #f5f5f5; border-radius: 100px; color: #666; font-weight: 500; }
.intro { font-size: 13px; color: #888; line-height: 1.5; margin: 0 0 16px; }
.actions { display: flex; gap: 8px; justify-content: center; }
.btn-primary {
  padding: 7px 16px; background: #111; color: white; border: none; border-radius: 6px;
  font-size: 12px; font-weight: 600; cursor: pointer;
}
.btn-secondary {
  padding: 7px 16px; background: white; color: #111; border: 1px solid #e5e5e5; border-radius: 6px;
  font-size: 12px; font-weight: 600; cursor: pointer;
}
</style>
