<template>
  <div class="page">
    <div class="container">
      <div class="head">
        <p class="eyebrow">REAL STORIES</p>
        <h1 class="title">고객 후기</h1>
        <p class="sub">오토원트를 이용해 주신 고객님들의 생생한 이야기입니다</p>
        <router-link to="/reviews/write" class="write-btn">후기 작성하기 →</router-link>
      </div>

      <div class="count-row">
        <span class="count">{{ filteredReviews.length }}개의 후기</span>
      </div>

      <div v-if="filteredReviews.length" class="grid">
        <router-link
          v-for="r in filteredReviews"
          :key="r.id"
          :to="'/reviews/' + r.id"
          class="card"
        >
          <div class="card-img" v-if="r.thumbnail">
            <img :src="r.thumbnail" :alt="r.title" />
          </div>
          <div class="card-img placeholder" v-else>
            <span>AUTOWANT</span>
          </div>
          <div class="card-body">
            <div class="card-head">
              <h3 class="card-title">{{ r.title }}</h3>
              <span class="card-tag">장기렌트</span>
            </div>
            <p class="card-meta">{{ (r.region || '') }}{{ r.region && r.vehicle ? ' | ' : '' }}{{ r.vehicle }}</p>
            <div class="card-rating">
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="n <= r.rating ? 'sf' : 'se'">★</span>
              </div>
              <span class="card-date">{{ r.date }}</span>
            </div>
            <p class="card-text">{{ r.blocks?.find(b => b.type === 'text')?.content || '' }}</p>
          </div>
        </router-link>
      </div>

      <div v-else class="empty">
        <p>아직 등록된 후기가 없습니다</p>
        <router-link to="/reviews/write" class="empty-btn">첫 후기 작성하기 →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useReviews } from '../stores/reviews'

const { reviewList } = useReviews()
const filteredReviews = computed(() => reviewList.value)
</script>

<style scoped>
.container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
.page { padding: 48px 0 80px; background: #fafafa; min-height: calc(100vh - 72px); }

.head { text-align: center; margin-bottom: 36px; }
.eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 2px; color: #999; margin: 0 0 8px; }
.title { font-size: 2rem; font-weight: 800; color: #111; margin: 0 0 8px; letter-spacing: -0.5px; }
.sub { font-size: 14px; color: #777; margin: 0 0 20px; }
.write-btn {
  display: inline-block; padding: 10px 22px; background: #111; color: white;
  border-radius: 999px; font-size: 13px; font-weight: 700; text-decoration: none;
  transition: background 0.15s;
}
.write-btn:hover { background: #333; }

.count-row { display: flex; justify-content: flex-end; margin-bottom: 20px; }
.count { font-size: 12.5px; color: #999; font-weight: 500; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
}

.card {
  display: block; background: white; border-radius: 14px; overflow: hidden;
  text-decoration: none; color: inherit;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}
.card:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); border-color: #e0e0e0; }

.card-img { width: 100%; aspect-ratio: 16/10; overflow: hidden; background: #f5f5f5; }
.card-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-img.placeholder {
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #f5f5f5, #ebebeb);
  color: #bbb; font-size: 14px; font-weight: 800; letter-spacing: 2px;
}

.card-body { padding: 18px 18px 20px; }
.card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
.card-title {
  font-size: 15px; font-weight: 700; color: #111; margin: 0; line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; word-break: keep-all;
}
.card-tag {
  flex-shrink: 0; font-size: 10.5px; font-weight: 700; color: #666;
  background: #f5f5f5; padding: 3px 8px; border-radius: 4px;
}
.card-meta { font-size: 12px; color: #999; margin: 0 0 10px; font-weight: 500; }
.card-rating { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.stars { display: flex; gap: 1px; }
.star { font-size: 12px; }
.sf { color: #f59e0b; }
.se { color: #e5e5e5; }
.card-date { font-size: 11.5px; color: #bbb; }
.card-text {
  font-size: 13px; color: #666; line-height: 1.65; margin: 0; word-break: keep-all;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

.empty { text-align: center; padding: 80px 0; }
.empty p { color: #aaa; font-size: 14px; margin: 0 0 16px; }
.empty-btn {
  display: inline-block; padding: 10px 22px; background: #111; color: white;
  border-radius: 999px; font-size: 13px; font-weight: 700; text-decoration: none;
}
.empty-btn:hover { background: #333; }

@media (max-width: 600px) {
  .title { font-size: 1.5rem; }
  .grid { grid-template-columns: 1fr; gap: 14px; }
  .count-row { justify-content: flex-start; }
}
</style>
