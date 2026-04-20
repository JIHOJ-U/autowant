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
          <div class="chart-row">
            <div class="chart-box ceo-box">
              <span class="box-role">대표이사</span>
              <span class="box-name">신선호</span>
            </div>
          </div>

          <div class="chart-line-v"></div>

          <!-- 총괄이사 -->
          <div class="chart-row">
            <div class="chart-box director-box">
              <span class="box-role">총괄이사</span>
              <span class="box-name">강재원</span>
            </div>
          </div>

          <div class="chart-line-v"></div>

          <!-- 지사장 -->
          <div class="chart-row">
            <div class="chart-label">지사장</div>
            <div class="branch-row">
              <div class="chart-box branch-box">
                <span class="box-name">최원영</span>
                <span class="box-sub">(서부지사)</span>
              </div>
              <div class="chart-box branch-box">
                <span class="box-name">진승범</span>
                <span class="box-sub">(동부지사)</span>
              </div>
            </div>
          </div>

          <div class="chart-line-v"></div>

          <!-- 하단 2개 팀 -->
          <div class="team-row">
            <!-- 영업팀(매니저) -->
            <div class="team-card">
              <h3 class="team-title">영업팀(매니저)</h3>
              <div class="team-grid">
                <span>장종현</span><span>전호형</span><span>황유찬</span>
                <span>김태인</span><span>최윤철</span><span>김재원</span>
                <span>장효준</span><span>정주헌</span><span>김영준</span>
                <span>정한수</span><span>박승수</span><span>이서형</span>
              </div>
            </div>

            <!-- 영업지원팀 -->
            <div class="team-card">
              <h3 class="team-title">영업지원팀</h3>
              <div class="team-list">
                <span>강지수</span>
                <span>최윤호</span>
                <span>박지훈</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page { padding: 0; }

.org-section {
  position: relative;
  background: #f8f9fb;
  padding: 100px 0;
}
.org-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
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

/* 연결선 */
.chart-line-v {
  width: 2px; height: 32px;
  background: #d1d6db;
}

/* 행 */
.chart-row {
  display: flex; flex-direction: column; align-items: center;
  width: 100%;
}

/* 박스 공통 */
.chart-box {
  display: flex; align-items: center; gap: 16px;
  padding: 18px 36px;
  background: #fff;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.box-role {
  font-size: 15px; font-weight: 800; color: #3182f6;
}
.box-name {
  font-size: 17px; font-weight: 800; color: #191f28;
}
.box-sub {
  font-size: 13px; color: #8b95a1; font-weight: 500;
}

/* CEO */
.ceo-box {
  padding: 22px 48px;
  border-color: #191f28;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.ceo-box .box-role { font-size: 17px; }
.ceo-box .box-name { font-size: 20px; }

/* 총괄이사 */
.director-box {
  padding: 20px 40px;
  border-color: #d1d6db;
}

/* 지사장 */
.chart-label {
  font-size: 15px; font-weight: 800; color: #191f28;
  margin-bottom: 14px;
}
.branch-row {
  display: flex; gap: 24px; justify-content: center;
}
.branch-box {
  gap: 8px;
  padding: 14px 28px;
}

/* 하단 팀 영역 */
.team-row {
  display: flex; gap: 20px; width: 100%; margin-top: 8px;
}
.team-card {
  background: #f0f2f5;
  border-radius: 16px;
  padding: 28px 32px;
  flex: 1;
}
.team-card:first-child { flex: 2; }
.team-title {
  font-size: 17px; font-weight: 900; color: #3182f6;
  margin: 0 0 20px;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* 매니저 그리드 (3열) */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 24px;
}
.team-grid span {
  font-size: 15px; font-weight: 600; color: #333;
  text-align: center;
}

/* 영업지원팀 리스트 */
.team-list {
  display: flex; flex-direction: column; gap: 18px;
  align-items: center;
}
.team-list span {
  font-size: 15px; font-weight: 600; color: #333;
}

@media (max-width: 768px) {
  .org-section { padding: 64px 0; }
  .org-title { font-size: 1.4rem; }
  .ceo-box { padding: 16px 28px; }
  .ceo-box .box-role { font-size: 14px; }
  .ceo-box .box-name { font-size: 17px; }
  .branch-row { flex-direction: column; gap: 12px; align-items: center; }
  .team-row { flex-direction: column; }
  .team-card:first-child { flex: 1; }
  .team-grid { grid-template-columns: repeat(3, 1fr); gap: 12px 16px; }
}
</style>
