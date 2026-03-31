<template>
  <div class="home">
    <!-- 차량 검색 -->
    <section class="vehicle-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">차량 검색</h2>
          <p class="section-sub">{{ filteredVehicles.length }}대의 차량</p>
        </div>

        <div class="brand-row">
          <button v-for="brand in brands" :key="brand" class="brand-chip" :class="{ active: selectedBrand === brand }" @click="selectedBrand = brand">{{ brand }}</button>
        </div>

        <div class="filter-bar">
          <v-text-field v-model="searchQuery" placeholder="차량명 검색" prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" rounded="lg" hide-details class="filter-input" />
          <v-select v-model="selectedType" :items="vehicleTypes" placeholder="차종" variant="outlined" density="compact" rounded="lg" hide-details clearable class="filter-select" />
          <v-select v-model="selectedFuel" :items="fuelTypes" placeholder="연료" variant="outlined" density="compact" rounded="lg" hide-details clearable class="filter-select" />
          <v-select v-model="sortBy" :items="sortOptions" variant="outlined" density="compact" rounded="lg" hide-details class="filter-select" />
        </div>

        <div class="vehicle-grid">
          <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card" @click="openVehicle(vehicle)">
            <div class="card-img">
              <img :src="vehicle.image" :alt="vehicle.name" />
              <span v-if="vehicle.isSpecial" class="badge badge-special">특가</span>
              <span v-if="vehicle.isImmediate" class="badge badge-immediate">즉시출고</span>
            </div>
            <div class="card-body">
              <p class="card-sub">{{ vehicle.brand }} · {{ vehicle.year }} · {{ vehicle.fuel }}</p>
              <h3 class="card-name">{{ vehicle.name }}</h3>
              <div class="card-price-area">
                <p class="card-price">{{ fmt(vehicle.price) }}<span class="won">원</span></p>
                <p class="card-monthly">
                  월 <strong>{{ fmt(vehicle.monthlyRent) }}원</strong>
                  <span class="card-months">/ {{ vehicle.rentMonths }}개월</span>
                </p>
                <p v-if="vehicle.deposit" class="card-deposit">보증금 {{ fmt(vehicle.deposit) }}원</p>
                <p v-else class="card-deposit">보증금 없음</p>
              </div>
              <div class="card-btns">
                <button class="card-btn calc" @click.stop="openCalcModal(vehicle)">계산기</button>
                <button class="card-btn compare" :class="{ active: isInCompare(vehicle.id) }" @click.stop="toggleCompare(vehicle)">
                  {{ isInCompare(vehicle.id) ? '비교 중' : '비교' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 이달의 특가 -->
    <section class="special-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">이달의 특가</h2>
          <p class="section-sub">엄선된 최저가 차량</p>
        </div>
        <div class="special-scroll">
          <div v-for="v in specialVehicles" :key="v.id" class="special-card" @click="openVehicle(v)">
            <div class="card-img">
              <img :src="v.image" :alt="v.name" />
              <span class="badge badge-special">{{ v.discount }}% OFF</span>
            </div>
            <div class="card-body">
              <p class="card-sub">{{ v.brand }}</p>
              <h3 class="card-name">{{ v.name }}</h3>
              <p class="price-original">{{ fmt(v.originalPrice) }}원</p>
              <p class="price-discount">{{ fmt(v.price) }}<span class="won">원</span></p>
              <p class="card-monthly">월 <strong>{{ fmt(v.monthlyRent) }}원</strong> / {{ v.rentMonths }}개월</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 장점 -->
    <section class="feature-section">
      <div class="container">
        <div class="section-head">
          <h2 class="section-title">왜 오토원트인가요</h2>
        </div>
        <div class="feature-grid">
          <div v-for="item in features" :key="item.title" class="feature-item">
            <div class="feature-num">{{ item.num }}</div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 고객 후기 -->
    <section class="review-section">
      <div class="container">
        <div class="section-head review-head">
          <div>
            <h2 class="section-title">고객 후기</h2>
            <p class="section-sub">오토원트와 함께한 고객님들의 이야기</p>
          </div>
          <router-link to="/reviews/write" class="write-review-btn">후기 작성하기</router-link>
        </div>
        <div class="review-grid">
          <router-link v-for="r in reviews" :key="r.id" :to="'/reviews/' + r.id" class="review-card">
            <div class="review-img" v-if="r.thumbnail">
              <img :src="r.thumbnail" :alt="r.title" />
            </div>
            <div class="review-body">
              <div class="review-stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= r.rating }">★</span>
              </div>
              <h3 class="review-title">{{ r.title }}</h3>
              <p class="review-text">{{ r.blocks?.find(b => b.type === 'text')?.content || '' }}</p>
              <div v-if="r.tags?.length" class="review-tags">
                <span v-for="t in r.tags" :key="t" class="review-tag">{{ t }}</span>
              </div>
              <div class="review-footer">
                <div class="review-avatar">{{ r.name.charAt(0) }}</div>
                <div>
                  <p class="review-name">{{ r.name }}</p>
                  <p class="review-meta">{{ r.vehicle }} · {{ r.date }}</p>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container cta-inner">
        <div>
          <h2>견적이 궁금하신가요?</h2>
          <p>전문 매니저가 최적의 조건을 찾아드립니다</p>
        </div>
        <router-link to="/contact" class="cta-btn">견적 상담 →</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useVehicles } from '../stores/vehicles'
import { useCompare } from '../stores/compare'
import { useReviews } from '../stores/reviews'

const openInquiryModal = inject('openInquiryModal')
const openCalcModal = inject('openCalcModal')
const { vehicleList, specialList: specialVehicles } = useVehicles()
const { toggleCompare, isInCompare } = useCompare()
const { reviewList: reviews } = useReviews()

const searchQuery = ref('')
const selectedBrand = ref('전체')
const selectedType = ref(null)
const selectedFuel = ref(null)
const sortBy = ref('최신순')

const brands = ['전체', '현대', '기아', '제네시스', '쉐보레', 'KGM', '르노', '수입차']
const vehicleTypes = ['세단', 'SUV', '경차', 'RV/MPV']
const fuelTypes = ['가솔린', '디젤', '전기', '하이브리드']
const sortOptions = ['최신순', '가격 낮은순', '가격 높은순', '이름순']

const filteredVehicles = computed(() => {
  let list = [...vehicleList.value]
  if (selectedBrand.value !== '전체') {
    if (selectedBrand.value === '수입차') {
      list = list.filter(v => !['현대','기아','제네시스','쉐보레','KGM','르노'].includes(v.brand))
    } else {
      list = list.filter(v => v.brand === selectedBrand.value)
    }
  }
  if (selectedType.value) list = list.filter(v => v.type === selectedType.value)
  if (selectedFuel.value) list = list.filter(v => v.fuel === selectedFuel.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(v => v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q))
  }
  if (sortBy.value === '가격 낮은순') list.sort((a, b) => a.price - b.price)
  else if (sortBy.value === '가격 높은순') list.sort((a, b) => b.price - a.price)
  else if (sortBy.value === '이름순') list.sort((a, b) => a.name.localeCompare(b.name))
  return list
})

const features = [
  { num: '01', title: '합리적인 가격', desc: '20개 이상 업체를 비교해 최저가를 보장합니다' },
  { num: '02', title: '투명한 견적', desc: '숨겨진 비용 없이 정직한 가격을 제시합니다' },
  { num: '03', title: '전문 상담', desc: '경험 풍부한 매니저가 1:1 맞춤 상담합니다' },
  { num: '04', title: '빠른 출고', desc: '즉시출고 차량을 상시 보유하고 있습니다' },
]

function fmt(p) { return p.toLocaleString('ko-KR') }
function openVehicle(vehicle) { openInquiryModal(vehicle) }
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.section-head { margin-bottom: 24px; }
.section-title { font-size: 1.4rem; font-weight: 800; color: #111; letter-spacing: -0.5px; }
.section-sub { font-size: 13px; color: #999; margin-top: 2px; }
.vehicle-section { padding: 36px 0 24px; }
.brand-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px; }
.brand-chip { padding: 6px 16px; border: 1px solid #e5e5e5; border-radius: 100px; background: white; font-size: 12.5px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.15s; }
.brand-chip:hover { border-color: #ccc; color: #555; }
.brand-chip.active { background: #111; color: white; border-color: #111; }
.filter-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-input { max-width: 280px; }
.filter-select { max-width: 140px; }
@media (max-width: 768px) { .filter-input, .filter-select { max-width: 100%; flex: 1 1 calc(50% - 4px); } }
.vehicle-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 1024px) { .vehicle-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .vehicle-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
.vehicle-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
.vehicle-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
.card-img { position: relative; background: #fafafa; aspect-ratio: 16/10; overflow: hidden; }
.card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.vehicle-card:hover .card-img img { transform: scale(1.03); }
.badge { position: absolute; top: 8px; left: 8px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }
.badge-special { background: #111; color: white; }
.badge-immediate { background: white; color: #111; border: 1px solid #e5e5e5; left: auto; right: 8px; }
.card-body { padding: 12px; }
.card-sub { font-size: 11px; color: #aaa; margin: 0 0 2px; }
.card-name { font-size: 14px; font-weight: 700; color: #111; margin: 0 0 8px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-price-area { border-top: 1px solid #f5f5f5; padding-top: 8px; }
.card-price { font-size: 15px; font-weight: 800; color: #111; margin: 0; }
.won { font-size: 11px; font-weight: 500; color: #888; }
.card-monthly { font-size: 12px; color: #555; margin: 4px 0 0; }
.card-monthly strong { color: #111; }
.card-months { font-size: 11px; color: #aaa; }
.card-deposit { font-size: 11px; color: #bbb; margin: 2px 0 0; }
.card-btns { display: flex; gap: 6px; margin-top: 10px; }
.card-btn {
  flex: 1; padding: 7px 0; border-radius: 6px; font-size: 11.5px; font-weight: 600;
  cursor: pointer; transition: all 0.15s; text-align: center;
}
.card-btn.calc { background: #f5f5f5; color: #555; border: none; }
.card-btn.calc:hover { background: #eee; color: #111; }
.card-btn.compare { background: white; color: #888; border: 1px solid #e5e5e5; }
.card-btn.compare:hover { border-color: #111; color: #111; }
.card-btn.compare.active { background: #111; color: white; border-color: #111; }
.special-section { padding: 36px 0; background: #fafafa; }
.special-scroll { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: thin; }
.special-card { min-width: 240px; max-width: 240px; flex-shrink: 0; background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
.special-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
.price-original { font-size: 11px; color: #ccc; text-decoration: line-through; margin: 0; }
.price-discount { font-size: 16px; font-weight: 800; color: #111; margin: 0; }
.feature-section { padding: 48px 0; }
.feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
@media (max-width: 768px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
.feature-item { padding: 24px 20px; border: 1px solid #f0f0f0; border-radius: 12px; }
.feature-num { font-size: 12px; font-weight: 800; color: #ccc; margin-bottom: 12px; }
.feature-item h4 { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; }
.feature-item p { font-size: 13px; color: #888; line-height: 1.5; margin: 0; }
/* 고객 후기 */
.review-section { padding: 48px 0; background: #fafafa; }
.review-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 1024px) { .review-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .review-grid { grid-template-columns: 1fr; } }
.review-head { display: flex; align-items: flex-end; justify-content: space-between; }
.write-review-btn {
  padding: 8px 18px; background: #111; color: white; border-radius: 6px;
  font-size: 12px; font-weight: 700; text-decoration: none; transition: background 0.15s; flex-shrink: 0;
}
.write-review-btn:hover { background: #333; }
.review-card { background: white; border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; text-decoration: none; color: inherit; display: block; }
.review-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); transform: translateY(-2px); }
.review-img { aspect-ratio: 16/9; overflow: hidden; }
.review-img img { width: 100%; height: 100%; object-fit: cover; }
.review-body { padding: 16px; }
.review-stars { margin-bottom: 8px; }
.star { font-size: 13px; color: #ddd; }
.star.filled { color: #111; }
.review-title { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.review-text { font-size: 13px; color: #777; line-height: 1.6; margin: 0 0 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.review-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 14px; }
.review-tag { font-size: 10px; font-weight: 600; padding: 3px 8px; background: #f5f5f5; border-radius: 4px; color: #888; }
.review-footer { display: flex; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid #f5f5f5; }
.review-avatar {
  width: 32px; height: 32px; border-radius: 50%; background: #111; color: white;
  display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;
}
.review-name { font-size: 12px; font-weight: 700; color: #111; margin: 0; }
.review-meta { font-size: 10px; color: #bbb; margin: 1px 0 0; }

.cta-section { padding: 48px 0; background: #111; }
.cta-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
.cta-inner h2 { font-size: 1.3rem; font-weight: 800; color: white; }
.cta-inner p { font-size: 13px; color: #888; margin-top: 4px; }
.cta-btn { display: inline-block; padding: 12px 32px; background: white; color: #111; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 8px; transition: background 0.15s; }
.cta-btn:hover { background: #f5f5f5; }
</style>
