<template>
  <div class="page">
    <!-- 히어로 -->
    <div class="imm-hero">
      <div class="imm-hero-bg"></div>
      <div class="container imm-hero-inner">
        <p class="imm-brand"><span class="imm-brand-b">AUTO</span><span class="imm-brand-a">WANT</span></p>
        <span class="imm-eyebrow">IMMEDIATE DELIVERY</span>
        <h1>즉시 출고</h1>
        <p class="imm-hero-sub">기다림 없이 바로 출고 가능한 차량 <strong>{{ immediateList.length }}대</strong> 보유 중</p>
        <div class="imm-badges">
          <span>당일 상담 가능</span>
          <span>빠른 출고</span>
          <span>재고 한정</span>
        </div>
      </div>
    </div>

    <div class="container imm-content">
      <!-- 필터 -->
      <div v-reveal class="imm-filter">
        <button v-for="b in brands" :key="b" class="imm-filter-btn" :class="{ active: selectedBrand === b }" @click="selectedBrand = b">{{ b }}</button>
      </div>

      <div class="grid">
        <div v-for="(v, i) in filtered" :key="v.id" v-reveal="{ delay: i * 60 }" class="card" @click="openInquiryModal(v)">
          <div class="card-img">
            <img :src="v.image" :alt="v.name" />
            <span class="badge">즉시출고</span>
            <span class="badge-stock">바로 출고</span>
          </div>
          <div class="card-body">
            <p class="sub">{{ v.brand }} · {{ v.year }} · {{ v.fuel }}</p>
            <h3>{{ v.name }}</h3>
            <p class="price">{{ fmt(v.price) }}<span>원</span></p>
            <p class="monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
            <p v-if="v.deposit" class="deposit">보증금 {{ fmt(v.deposit) }}원</p>
            <p v-else class="deposit">보증금 없음</p>
          </div>
          <div class="card-cta">상담 신청하기</div>
        </div>
      </div>
      <p v-if="!filtered.length" v-reveal class="empty">해당 브랜드의 즉시출고 차량이 없습니다</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useVehicles } from '../stores/vehicles'
const openInquiryModal = inject('openInquiryModal')
const { immediateList } = useVehicles()

const selectedBrand = ref('전체')
const brands = computed(() => {
  const list = [...new Set(immediateList.value.map(v => v.brand))]
  return ['전체', ...list]
})
const filtered = computed(() => {
  if (selectedBrand.value === '전체') return immediateList.value
  return immediateList.value.filter(v => v.brand === selectedBrand.value)
})

function fmt(p) { return p.toLocaleString('ko-KR') }
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.page { padding: 0 0 48px; }

/* 히어로 */
.imm-hero {
  position: relative; overflow: hidden;
  padding: 100px 0 80px;
  background: url('/images/cars/car1.jpg') center/cover no-repeat;
  min-height: 340px;
}
.imm-hero-bg {
  position: absolute; inset: 0;
  background: rgba(15, 23, 42, 0.25);
}
.imm-hero-inner { position: relative; z-index: 1; text-align: left; }
.imm-brand { font-size: 1.1rem; font-weight: 900; margin: 0 0 16px; letter-spacing: -0.5px; }
.imm-brand-b { color: white; }
.imm-brand-a { color: rgba(255,255,255,0.5); }
.imm-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #10b981; margin: 0 0 10px; display: block; }
.imm-hero h1 { font-size: 2.2rem; font-weight: 900; color: white; margin: 0 0 8px; letter-spacing: -0.5px; }
.imm-hero-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin: 0 0 20px; }
.imm-hero-sub strong { color: #10b981; }
.imm-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.imm-badges span {
  padding: 5px 14px; border-radius: 100px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600;
}

/* 필터 */
.imm-content { padding-top: 32px; }
.imm-filter { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 24px; }
.imm-filter-btn {
  padding: 7px 18px; border: 1px solid #e5e5e5; border-radius: 100px;
  background: white; font-size: 13px; font-weight: 600; color: #888;
  cursor: pointer; transition: all 0.15s;
}
.imm-filter-btn:hover { border-color: #10b981; color: #10b981; }
.imm-filter-btn.active { background: #10b981; color: white; border-color: #10b981; }

/* 그리드 */
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }

.card {
  background: white; border: 1px solid #f0f0f0; border-radius: 14px;
  overflow: hidden; cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.card-img {
  position: relative; background: #f8f8f8; aspect-ratio: 16/10;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.card-img img { width: 90%; height: auto; object-fit: contain; mix-blend-mode: multiply; transition: transform 0.3s; }
.card:hover .card-img img { transform: scale(1.05); }
.badge {
  position: absolute; top: 8px; left: 8px;
  background: linear-gradient(135deg, #10b981, #059669); color: white;
  font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 4px;
}
.badge-stock {
  position: absolute; top: 8px; right: 8px;
  background: rgba(255,255,255,0.9); color: #10b981; backdrop-filter: blur(4px);
  font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 4px;
  border: 1px solid rgba(16,185,129,0.2);
}
.card-body { padding: 14px; }
.sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.card-body h3 { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px; }
.price { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0; }
.price span { font-size: 11px; font-weight: 500; color: #888; }
.monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.monthly strong { color: #10b981; }
.deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.card-cta {
  padding: 10px; text-align: center;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white; font-size: 13px; font-weight: 700;
  opacity: 0; max-height: 0; overflow: hidden;
  transition: all 0.25s;
}
.card:hover .card-cta { opacity: 1; max-height: 40px; }
.empty { text-align: center; color: #ccc; padding: 60px 0; font-size: 14px; }
</style>
