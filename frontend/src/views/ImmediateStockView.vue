<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <h1>즉시 출고</h1>
        <p>기다림 없이 바로 출고 가능한 차량</p>
      </div>
      <div class="grid">
        <div v-for="v in immediateList" :key="v.id" class="card" @click="openInquiryModal(v)">
          <div class="card-img">
            <img :src="v.image" :alt="v.name" />
            <span class="badge">즉시출고</span>
          </div>
          <div class="card-body">
            <p class="sub">{{ v.brand }} · {{ v.year }} · {{ v.fuel }}</p>
            <h3>{{ v.name }}</h3>
            <p class="price">{{ fmt(v.price) }}<span>원</span></p>
            <p class="monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
            <p v-if="v.deposit" class="deposit">보증금 {{ fmt(v.deposit) }}원</p>
            <p v-else class="deposit">보증금 없음</p>
          </div>
        </div>
      </div>
      <p v-if="!immediateList.length" class="empty">현재 즉시출고 차량이 없습니다</p>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { useVehicles } from '../stores/vehicles'
const openInquiryModal = inject('openInquiryModal')
const { immediateList } = useVehicles()
function fmt(p) { return p.toLocaleString('ko-KR') }
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.page { padding: 36px 0 48px; }
.page-head { margin-bottom: 28px; }
.page-head h1 { font-size: 1.4rem; font-weight: 800; color: #111; }
.page-head p { font-size: 13px; color: #999; margin-top: 2px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .grid { grid-template-columns: repeat(2, 1fr); } }
.card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
.card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
.card-img { position: relative; background: #fafafa; aspect-ratio: 16/10; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.badge { position: absolute; top: 8px; left: 8px; background: #111; color: white; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
.card-body { padding: 12px; }
.sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.card-body h3 { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; }
.price { font-size: 16px; font-weight: 800; color: #111; margin: 0; }
.price span { font-size: 11px; font-weight: 500; color: #888; }
.monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.monthly strong { color: #111; }
.deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.empty { text-align: center; color: #ccc; padding: 60px 0; font-size: 14px; }
</style>
