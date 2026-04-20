<template>
  <div class="page">
    <section id="org" class="org-section">
      <div class="org-container">
        <div v-reveal class="org-head">
          <p class="org-eyebrow">ORGANIZATION</p>
          <h2 class="org-title">AUTOWANT Organization</h2>
          <div class="org-divider"><span></span><span class="org-dot"></span><span></span></div>
        </div>

        <div v-reveal="{ delay: 100 }" class="org-chart">
          <!-- CEO -->
          <div class="chart-tier tier-top">
            <router-link v-if="orgCEO" class="chart-node node-ceo" :to="'/managers#manager-' + orgCEO.id">
              <div class="node-avatar ceo-av">
                <img v-if="orgCEO.image" :src="orgCEO.image" :alt="orgCEO.name" />
                <span v-else class="node-initial">{{ orgCEO.name.charAt(0) }}</span>
              </div>
              <div class="node-text">
                <span class="node-badge ceo-badge">CEO</span>
                <h3 class="node-name">{{ orgCEO.name }}</h3>
                <p class="node-title">대표이사</p>
              </div>
            </router-link>
          </div>

          <div class="chart-line-v"></div>

          <!-- 총괄이사 -->
          <div class="chart-tier tier-mid">
            <router-link v-if="orgDirector" class="chart-node node-director" :to="'/managers#manager-' + orgDirector.id">
              <div class="node-avatar dir-av">
                <img v-if="orgDirector.image" :src="orgDirector.image" :alt="orgDirector.name" />
                <span v-else class="node-initial">{{ orgDirector.name.charAt(0) }}</span>
              </div>
              <div class="node-text">
                <span class="node-badge dir-badge">DIRECTOR</span>
                <h3 class="node-name">{{ orgDirector.name }}</h3>
                <p class="node-title">총괄이사</p>
              </div>
            </router-link>
          </div>

          <div class="chart-line-v"></div>

          <!-- 매니저 라벨 -->
          <div class="chart-tier-label">
            <span class="tier-label-text">MANAGERS</span>
            <span class="tier-label-count">{{ orgManagers.length }}</span>
          </div>
          <div class="chart-line-branch"></div>

          <!-- 매니저들 -->
          <div class="chart-tier tier-bottom">
            <router-link v-for="(m, i) in orgManagers" :key="m.id"
               class="chart-node node-manager"
               :style="{ animationDelay: (i * 0.04 + 0.08) + 's' }"
               :to="'/managers#manager-' + m.id">
              <div class="node-avatar mgr-av">
                <img v-if="m.image" :src="m.image" :alt="m.name" />
                <span v-else class="node-initial">{{ m.name.charAt(0) }}</span>
              </div>
              <div class="node-text">
                <h3 class="node-name">{{ m.name }}</h3>
                <p class="node-title">{{ m.tags?.[0] || '매니저' }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useManagers } from '../stores/managers'

const { managerList } = useManagers()

const orgCEO = computed(() => managerList.value.find(m => m.role === '대표'))
const orgDirector = computed(() => managerList.value.find(m => m.role === '이사'))
const orgManagers = computed(() => managerList.value.filter(m => m.role === '매니저'))
</script>

<style scoped>
.page { padding: 0; }

.org-section {
  position: relative;
  background: #ffffff;
  padding: 100px 0;
}
.org-container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
.org-head { text-align: center; margin-bottom: 52px; }
.org-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 5px;
  color: #8b95a1; margin: 0 0 14px; text-transform: uppercase;
}
.org-title {
  font-size: 1.8rem; font-weight: 900; color: #191f28;
  margin: 0 0 16px; letter-spacing: -0.5px;
}
.org-divider {
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.org-divider span:first-child,
.org-divider span:last-child {
  width: 40px; height: 1px; background: #e5e8eb;
}
.org-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #191f28;
}

.org-chart {
  display: flex; flex-direction: column; align-items: center;
}
.chart-tier { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; width: 100%; }

.chart-node {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px;
  background: #fff;
  border: 1px solid #e5e8eb;
  border-radius: 14px;
  cursor: pointer; text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}
.chart-node:hover {
  border-color: #c7d2fe;
  box-shadow: 0 8px 24px rgba(99,102,241,0.1);
  transform: translateY(-2px);
}

.node-avatar {
  flex-shrink: 0;
  width: 64px; height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f7fa;
}
.node-avatar img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
}
.node-initial {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; font-weight: 800; color: #8b95a1;
  background: #f2f4f6;
}

.node-text { display: flex; flex-direction: column; gap: 2px; }
.node-badge {
  display: inline-block; width: fit-content;
  padding: 2px 8px;
  font-size: 9px; font-weight: 800; letter-spacing: 1.2px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.ceo-badge { background: #191f28; color: #fff; }
.dir-badge { background: #e5e8eb; color: #4e5968; }
.node-name {
  font-size: 17px; font-weight: 800; color: #191f28;
  margin: 0; letter-spacing: -0.3px; line-height: 1.3;
}
.node-title {
  font-size: 12px; font-weight: 500; color: #8b95a1;
  margin: 0;
}

.node-ceo {
  padding: 20px 32px;
  border-color: #191f28;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.node-ceo .node-avatar, .ceo-av {
  width: 80px; height: 80px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.node-ceo .node-name { font-size: 20px; }
.node-ceo:hover {
  border-color: #191f28;
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.node-director {
  padding: 18px 28px;
  border-color: #d1d6db;
}
.node-director .node-avatar, .dir-av {
  width: 72px; height: 72px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.node-director .node-name { font-size: 18px; }

.node-manager {
  padding: 12px 18px;
  animation: chartFadeIn 0.5s ease both;
}
.node-manager .node-avatar {
  width: 50px; height: 50px;
}
.node-manager .node-name { font-size: 14px; }
.node-manager .node-title { font-size: 11px; }

@keyframes chartFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.tier-bottom {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
}

.chart-line-v {
  width: 1px; height: 36px;
  background: #d1d6db;
  margin: 0;
}

.chart-tier-label {
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  margin: 4px 0 6px;
}
.tier-label-text {
  font-size: 10px; font-weight: 800; color: #8b95a1;
  letter-spacing: 2px; text-transform: uppercase;
}
.tier-label-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 6px;
  background: #f2f4f6; color: #4e5968;
  border-radius: 100px; font-size: 11px; font-weight: 800;
}

.chart-line-branch {
  width: 70%; max-width: 800px; height: 1px;
  background: #e5e8eb;
  margin: 0 auto 16px;
  position: relative;
}
.chart-line-branch::before, .chart-line-branch::after {
  content: ''; position: absolute; top: -2px;
  width: 5px; height: 5px; border-radius: 50%;
  background: #d1d6db;
}
.chart-line-branch::before { left: 0; }
.chart-line-branch::after { right: 0; }

@media (max-width: 1024px) {
  .tier-bottom { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .org-section { padding: 64px 0; }
  .org-title { font-size: 1.4rem; }
  .org-head { margin-bottom: 36px; }
  .tier-bottom { grid-template-columns: 1fr; gap: 10px; }
  .node-ceo { padding: 16px 20px; }
  .node-ceo .node-avatar, .ceo-av { width: 64px; height: 64px; }
  .node-director .node-avatar, .dir-av { width: 56px; height: 56px; }
  .chart-line-branch { width: 90%; }
}
</style>
