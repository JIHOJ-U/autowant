<template>
  <div class="page">
    <!-- 히어로 -->
    <div class="sp-hero">
      <div class="sp-hero-bg"></div>
      <div class="container sp-hero-inner">
        <p class="sp-brand"><span class="sp-brand-b">AUTO</span><span class="sp-brand-a">WANT</span></p>
        <span class="sp-eyebrow">MONTHLY SPECIAL</span>
        <h1>{{ currentMonth }}월 특가 이벤트</h1>
        <p class="sp-hero-sub">매월 엄선된 최저가 특가차량, 지금이 기회!</p>
        <div class="sp-badges">
          <span>한정 수량</span>
          <span>최대 {{ maxDiscount }}% 할인</span>
          <span>특가 {{ specialList.length }}대</span>
        </div>
      </div>
    </div>

    <div class="container sp-content">
      <div class="grid">
        <div v-for="(v, i) in specialList" :key="v.id" v-reveal="{ delay: i * 60 }" class="card" @click="openInquiryModal(v)">
          <div class="card-img">
            <img :src="v.image" :alt="v.name" />
            <span class="badge">{{ v.discount }}% OFF</span>
          </div>
          <div class="card-body">
            <p class="sub">{{ v.brand }} · {{ v.year }}</p>
            <h3>{{ v.name }}</h3>
            <p class="original">{{ fmt(v.originalPrice) }}원</p>
            <p class="price">{{ fmt(v.price) }}<span>원</span></p>
            <p class="monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
            <p v-if="v.deposit" class="deposit">보증금 {{ fmt(v.deposit) }}원</p>
            <p v-else class="deposit">보증금 없음</p>
          </div>
          <div class="card-cta">지금 상담받기</div>
        </div>
      </div>
      <p v-if="!specialList.length" v-reveal class="empty">현재 특가 차량이 없습니다</p>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useVehicles } from '../stores/vehicles'
const openInquiryModal = inject('openInquiryModal')
const { specialList } = useVehicles()
const currentMonth = computed(() => new Date().getMonth() + 1)
const maxDiscount = computed(() => Math.max(...specialList.value.map(v => v.discount), 0))
function fmt(p) { return p.toLocaleString('ko-KR') }
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.page { padding: 0 0 48px; }

/* 히어로 - 이미지는 나중에 추가 */
.sp-hero {
  position: relative; overflow: hidden;
  padding: 100px 0 80px;
  background: url('/images/cars/car2.jpg') center/cover no-repeat;
  min-height: 340px;
}
.sp-hero-bg {
  position: absolute; inset: 0;
  background: rgba(15, 23, 42, 0.25);
}
.sp-hero-inner { position: relative; z-index: 1; text-align: left; }
.sp-brand { font-size: 1.1rem; font-weight: 900; margin: 0 0 16px; letter-spacing: -0.5px; }
.sp-brand-b { color: white; }
.sp-brand-a { color: rgba(255,255,255,0.5); }
.sp-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 3px; color: #ff6b6b; margin: 0 0 10px; display: block; }
.sp-hero h1 { font-size: 2.2rem; font-weight: 900; color: white; margin: 0 0 8px; letter-spacing: -0.5px; }
.sp-hero-sub { font-size: 15px; color: rgba(255,255,255,0.5); margin: 0 0 20px; }
.sp-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.sp-badges span {
  padding: 5px 14px; border-radius: 100px;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600;
}

/* 콘텐츠 */
.sp-content { padding-top: 32px; }
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
  background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white;
  font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 4px;
}
.card-body { padding: 14px; }
.sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.card-body h3 { font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0 0 8px; }
.original { font-size: 11px; color: #ccc; text-decoration: line-through; margin: 0; }
.price { font-size: 16px; font-weight: 800; color: #1a1a1a; margin: 0; }
.price span { font-size: 11px; font-weight: 500; color: #888; }
.monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.monthly strong { color: #e53935; }
.deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.card-cta {
  padding: 10px; text-align: center;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white; font-size: 13px; font-weight: 700;
  opacity: 0; max-height: 0; overflow: hidden;
  transition: all 0.25s;
}
.card:hover .card-cta { opacity: 1; max-height: 40px; }
.empty { text-align: center; color: #ccc; padding: 60px 0; font-size: 14px; }
</style>
