<template>
  <div class="page">
    <section class="org-section">
      <div class="org-container">
        <div class="org-head">
          <p class="org-eyebrow">ORGANIZATION</p>
          <h2 class="org-title">오토원트 조직도</h2>
          <div class="org-divider"><span></span><span class="org-dot"></span><span></span></div>
        </div>

        <div class="org-chart">
          <!-- 대표이사 -->
          <div class="chart-tier tier-top">
            <div class="chart-node node-ceo">
              <div class="node-avatar ceo-av">
                <img v-if="getImage('신선호')" :src="getImage('신선호')" alt="신선호" />
                <span v-else class="node-initial">신</span>
              </div>
              <div class="node-text">
                <span class="node-badge ceo-badge">CEO</span>
                <h3 class="node-name">신선호</h3>
                <p class="node-title">대표이사</p>
              </div>
            </div>
          </div>

          <div class="chart-line-v"></div>

          <!-- 총괄이사 -->
          <div class="chart-tier tier-mid">
            <div class="chart-node node-director">
              <div class="node-avatar dir-av">
                <img v-if="getImage('강재원')" :src="getImage('강재원')" alt="강재원" />
                <span v-else class="node-initial">강</span>
              </div>
              <div class="node-text">
                <span class="node-badge dir-badge">DIRECTOR</span>
                <h3 class="node-name">강재원</h3>
                <p class="node-title">총괄이사</p>
              </div>
            </div>
          </div>

          <div class="chart-line-v"></div>

          <!-- 지사장 -->
          <div class="chart-tier-label">
            <span class="tier-label-text">지사장</span>
          </div>
          <div class="chart-line-branch"></div>
          <div class="chart-tier tier-branch">
            <div class="chart-node node-branch">
              <div class="node-avatar">
                <span class="node-initial">최</span>
              </div>
              <div class="node-text">
                <span class="node-badge branch-badge">서부지사</span>
                <h3 class="node-name">최원영</h3>
                <p class="node-title">지사장</p>
              </div>
            </div>
            <div class="chart-node node-branch">
              <div class="node-avatar">
                <span class="node-initial">진</span>
              </div>
              <div class="node-text">
                <span class="node-badge branch-badge">동부지사</span>
                <h3 class="node-name">진승범</h3>
                <p class="node-title">지사장</p>
              </div>
            </div>
          </div>

          <!-- 하단 2팀 -->
          <div class="team-section">
            <!-- 영업팀(매니저) -->
            <div class="team-card team-sales">
              <div class="team-header">
                <h3 class="team-title">영업팀(매니저)</h3>
                <span class="team-count">{{ salesTeam.length }}명</span>
              </div>
              <div class="team-grid">
                <div v-for="m in salesTeam" :key="m.name" class="team-member">
                  <div class="member-avatar">
                    <img v-if="getImage(m.name)" :src="getImage(m.name)" :alt="m.name" />
                    <span v-else class="node-initial">{{ m.name.charAt(0) }}</span>
                  </div>
                  <span class="member-name">{{ m.name }}</span>
                </div>
              </div>
            </div>

            <!-- 영업지원팀 -->
            <div class="team-card team-support">
              <div class="team-header">
                <h3 class="team-title">영업지원팀</h3>
                <span class="team-count">{{ supportTeam.length }}명</span>
              </div>
              <div class="team-list">
                <div v-for="m in supportTeam" :key="m.name" class="team-member">
                  <div class="member-avatar">
                    <span class="node-initial">{{ m.name.charAt(0) }}</span>
                  </div>
                  <span class="member-name">{{ m.name }}</span>
                </div>
              </div>
            </div>
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

function getImage(name) {
  const m = managerList.value.find(x => x.name === name)
  return m?.image || ''
}

const salesTeam = [
  { name: '장종현' }, { name: '전호형' }, { name: '황유찬' },
  { name: '김태인' }, { name: '최윤철' }, { name: '김재원' },
  { name: '장효준' }, { name: '정주헌' }, { name: '한영준' },
  { name: '정한수' }, { name: '박승수' }, { name: '이서형' },
  { name: '최원영' },
]

const supportTeam = [
  { name: '강지수' }, { name: '최윤호' }, { name: '박지훈' },
]
</script>

<style scoped>
.page { padding: 0; }

.org-section {
  position: relative;
  background: #f8f9fb;
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

/* 차트 */
.org-chart {
  display: flex; flex-direction: column; align-items: center;
}
.chart-tier { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; width: 100%; }

/* 노드 카드 */
.chart-node {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px;
  background: #fff;
  border: 1px solid #e5e8eb;
  border-radius: 14px;
  transition: all 0.2s ease;
}
.chart-node:hover {
  border-color: #c7d2fe;
  box-shadow: 0 8px 24px rgba(99,102,241,0.1);
  transform: translateY(-2px);
}

/* 아바타 */
.node-avatar {
  flex-shrink: 0;
  width: 64px; height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f7fa;
}
.node-avatar img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.node-initial {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; color: #8b95a1;
  background: #f2f4f6;
}

/* 텍스트 */
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
.branch-badge { background: #f0f6ff; color: #3182f6; }
.node-name {
  font-size: 17px; font-weight: 800; color: #191f28;
  margin: 0; letter-spacing: -0.3px; line-height: 1.3;
}
.node-title {
  font-size: 12px; font-weight: 500; color: #8b95a1;
  margin: 0;
}

/* CEO */
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

/* 총괄이사 */
.node-director {
  padding: 18px 28px;
  border-color: #d1d6db;
}
.node-director .node-avatar, .dir-av {
  width: 72px; height: 72px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.node-director .node-name { font-size: 18px; }

/* 지사장 */
.tier-branch { gap: 24px; }
.node-branch { padding: 14px 22px; }

/* 연결선 */
.chart-line-v {
  width: 2px; height: 32px;
  background: #d1d6db;
}
.chart-tier-label {
  display: flex; align-items: center; justify-content: center;
  gap: 8px; margin: 4px 0 6px;
}
.tier-label-text {
  font-size: 12px; font-weight: 800; color: #191f28;
  letter-spacing: 2px;
}
.chart-line-branch {
  width: 40%; max-width: 400px; height: 1px;
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

/* 하단 팀 */
.team-section {
  display: flex; gap: 20px; width: 100%; margin-top: 8px;
}
.team-card {
  background: #fff;
  border: 1px solid #eef0f3;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.team-card.team-sales { flex: 2; }
.team-card.team-support { flex: 1; }
.team-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.team-title {
  display: inline-block;
  font-size: 14px; font-weight: 800; color: #4e5968;
  margin: 0;
  padding: 6px 16px;
  background: #e5e8eb;
  border-radius: 6px;
  letter-spacing: 0.5px;
}
.team-count {
  font-size: 12px; font-weight: 700; color: #8b95a1;
  background: #f2f4f6; padding: 3px 10px; border-radius: 100px;
}

/* 매니저 그리드 */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.team-member {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.member-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  overflow: hidden; background: #f5f7fa;
}
.member-avatar img {
  width: 100%; height: 100%; object-fit: cover;
}
.member-avatar .node-initial {
  font-size: 18px;
}
.member-name {
  font-size: 13px; font-weight: 700; color: #333;
}

/* 영업지원팀 리스트 */
.team-list {
  display: flex; flex-direction: column; gap: 16px;
  align-items: center;
}

@media (max-width: 768px) {
  .org-section { padding: 64px 0; }
  .org-title { font-size: 1.4rem; }
  .node-ceo { padding: 16px 20px; }
  .node-ceo .node-avatar, .ceo-av { width: 64px; height: 64px; }
  .node-director .node-avatar, .dir-av { width: 56px; height: 56px; }
  .tier-branch { flex-direction: column; gap: 12px; align-items: center; }
  .team-section { flex-direction: column; }
  .team-card.team-sales { flex: 1; }
  .team-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .chart-line-branch { width: 60%; }
}
</style>
