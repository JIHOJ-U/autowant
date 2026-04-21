<template>
  <div class="page">
    <section class="org-section">
      <div class="org-container">
        <div class="org-head">
          <p class="org-eyebrow">ORGANIZATION</p>
          <h2 class="org-title">오토원트 조직도</h2>
          <div class="org-divider"><span></span><span class="org-dot"></span><span></span></div>
          <p v-if="isAdmin" class="admin-hint">관리자 모드 · 아바타를 클릭하면 이미지와 위치를 편집할 수 있습니다</p>
        </div>

        <div class="org-chart">
          <!-- 대표이사 -->
          <div class="chart-tier tier-top">
            <div class="chart-node node-ceo">
              <Avatar name="신선호" class="ceo-av" :editable="isAdmin" @edit="openEdit" />
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
              <Avatar name="강재원" class="dir-av" :editable="isAdmin" @edit="openEdit" />
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
              <Avatar name="최원영" :editable="isAdmin" @edit="openEdit" />
              <div class="node-text">
                <span class="node-badge branch-badge">서부지사</span>
                <h3 class="node-name">최원영</h3>
                <p class="node-title">지사장</p>
              </div>
            </div>
            <div class="chart-node node-branch">
              <Avatar name="진승범" :editable="isAdmin" @edit="openEdit" />
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
                  <Avatar :name="m.name" size="sm" :editable="isAdmin" @edit="openEdit" />
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
                  <Avatar :name="m.name" size="sm" :editable="isAdmin" @edit="openEdit" />
                  <span class="member-name">{{ m.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 편집 모달 -->
    <div v-if="editTarget" class="edit-modal-backdrop" @click.self="closeEdit">
      <div class="edit-modal">
        <div class="edit-header">
          <h3>{{ editTarget.name }} 이미지 편집</h3>
          <button class="edit-close" @click="closeEdit" aria-label="닫기">✕</button>
        </div>

        <div class="edit-body">
          <!-- 미리보기 -->
          <div class="preview-area">
            <div class="preview-col">
              <span class="preview-label">조직도 적용 미리보기</span>
              <div class="preview-circle">
                <img
                  v-if="editDraft.image"
                  :src="editDraft.image"
                  :style="{ objectPosition: `${editDraft.posX}% ${editDraft.posY}%` }"
                />
                <span v-else class="preview-placeholder">{{ editTarget.name.charAt(0) }}</span>
              </div>
              <span class="preview-note">조직도에 보일 모습</span>
            </div>
            <div class="preview-col">
              <span class="preview-label">원본 이미지</span>
              <div class="preview-full">
                <img
                  v-if="editDraft.image"
                  :src="editDraft.image"
                />
                <span v-else class="preview-placeholder-full">이미지를 업로드해 주세요</span>
              </div>
              <span class="preview-note">전체 영역</span>
            </div>
          </div>

          <!-- 이미지 업로드 -->
          <div class="control-row">
            <label class="upload-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              이미지 교체
              <input type="file" accept="image/*" hidden @change="onFileChange" />
            </label>
            <button class="reset-btn" @click="onReset">초기화</button>
          </div>

          <!-- 위치 슬라이더 -->
          <div class="slider-group" v-if="editDraft.image">
            <p class="slider-group-title">얼굴 위치 조정</p>
            <div class="slider-row">
              <label>좌우</label>
              <input type="range" min="0" max="100" step="1" v-model.number="editDraft.posX" />
              <span class="slider-val">{{ editDraft.posX }}%</span>
            </div>
            <div class="slider-row">
              <label>상하</label>
              <input type="range" min="0" max="100" step="1" v-model.number="editDraft.posY" />
              <span class="slider-val">{{ editDraft.posY }}%</span>
            </div>
          </div>
        </div>

        <div class="edit-footer">
          <button class="btn-secondary" @click="closeEdit">취소</button>
          <button class="btn-primary" @click="saveEdit">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useManagers } from '../stores/managers'
import { useAuth } from '../stores/auth'

const { managerList, setManagerAvatar, resetManagerAvatar } = useManagers()
const { isAdmin } = useAuth()

function findManager(name) {
  return managerList.value.find(x => x.name === name)
}

// 아바타 컴포넌트 (인라인)
const Avatar = {
  props: ['name', 'size', 'editable'],
  emits: ['edit'],
  setup(props, { emit }) {
    return () => {
      const m = findManager(props.name)
      const image = m?.image || ''
      const imageX = m?.imageX ?? 50
      const imageY = m?.imageY ?? 25
      const sizeClass = props.size === 'sm' ? 'member-avatar' : 'node-avatar'
      const initial = props.name.charAt(0)
      const children = image
        ? [h('img', {
            src: image,
            alt: props.name,
            style: { objectPosition: `${imageX}% ${imageY}%` },
          })]
        : [h('span', { class: 'node-initial' }, initial)]
      if (props.editable) {
        children.push(h('span', { class: 'edit-overlay' }, '편집'))
      }
      return h('div', {
        class: [sizeClass, { 'is-editable': props.editable }],
        onClick: props.editable ? () => emit('edit', props.name) : undefined,
      }, children)
    }
  },
}

const editTarget = ref(null)
const editDraft = ref({ image: '', posX: 50, posY: 25 })

function openEdit(name) {
  const m = findManager(name)
  if (!m) return
  editTarget.value = m
  editDraft.value = {
    image: m.image || '',
    posX: m.imageX ?? 50,
    posY: m.imageY ?? 25,
  }
}

function closeEdit() {
  editTarget.value = null
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    editDraft.value.image = reader.result
  }
  reader.readAsDataURL(file)
}

function onReset() {
  if (!editTarget.value) return
  if (!confirm('이 매니저의 이미지 편집을 모두 원래대로 되돌리시겠습니까?')) return
  resetManagerAvatar(editTarget.value.id)
  closeEdit()
}

function saveEdit() {
  if (!editTarget.value) return
  setManagerAvatar(editTarget.value.id, {
    image: editDraft.value.image,
    imageX: editDraft.value.posX,
    imageY: editDraft.value.posY,
  })
  closeEdit()
}

const salesTeam = [
  { name: '장종현' }, { name: '전호형' }, { name: '황유찬' },
  { name: '김태인' }, { name: '최윤철' }, { name: '김재원' },
  { name: '장효준' }, { name: '장주헌' }, { name: '한영준' },
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
.admin-hint {
  display: inline-block;
  margin: 14px 0 0;
  padding: 6px 14px;
  background: #111;
  color: #fff;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 999px;
  letter-spacing: 0.3px;
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
  position: relative;
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

/* 편집 오버레이 */
.is-editable { cursor: pointer; }
.edit-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(17,17,17,0.55);
  color: #fff; font-size: 11px; font-weight: 700;
  letter-spacing: 0.5px;
  opacity: 0; transition: opacity 0.15s;
  pointer-events: none;
}
.is-editable:hover .edit-overlay { opacity: 1; }

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
.ceo-av {
  width: 80px !important; height: 80px !important;
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
.dir-av {
  width: 72px !important; height: 72px !important;
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
  position: relative;
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

/* 편집 모달 */
.edit-modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.edit-modal {
  width: 100%; max-width: 520px;
  background: white; border-radius: 16px;
  overflow: hidden;
  display: flex; flex-direction: column;
  max-height: 90vh;
}
.edit-header {
  padding: 18px 22px;
  border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between;
}
.edit-header h3 {
  margin: 0; font-size: 16px; font-weight: 800; color: #111;
}
.edit-close {
  background: none; border: none; font-size: 18px;
  color: #999; cursor: pointer; padding: 4px 8px;
}
.edit-close:hover { color: #111; }

.edit-body {
  padding: 22px; overflow-y: auto;
}
.preview-area {
  display: flex; gap: 16px; justify-content: center;
  margin-bottom: 22px;
}
.preview-col {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  flex: 1;
}
.preview-label {
  font-size: 11.5px; font-weight: 800; color: #111; letter-spacing: 0.3px;
}
.preview-note { font-size: 11px; color: #999; }
.preview-circle {
  width: 120px; height: 120px; border-radius: 50%;
  overflow: hidden;
  background: #f5f7fa;
  border: 2px solid #111;
}
.preview-circle img {
  width: 100%; height: 100%; object-fit: cover; display: block;
}
.preview-full {
  width: 100%; max-width: 200px; aspect-ratio: 1;
  background: #f5f7fa;
  border: 1px dashed #ccc; border-radius: 8px;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.preview-full img {
  max-width: 100%; max-height: 100%;
  object-fit: contain; display: block;
}
.preview-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; font-weight: 800; color: #bbb;
}
.preview-placeholder-full {
  font-size: 12px; color: #aaa; text-align: center; padding: 14px;
}

.control-row {
  display: flex; gap: 8px; margin-bottom: 18px;
}
.upload-btn {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 14px;
  background: #111; color: white; border: none;
  border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background 0.15s;
}
.upload-btn:hover { background: #333; }
.reset-btn {
  padding: 10px 14px;
  background: white; color: #666; border: 1px solid #ddd;
  border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s;
}
.reset-btn:hover { border-color: #111; color: #111; }

.slider-group {
  background: #fafafa; border-radius: 10px; padding: 14px 16px;
}
.slider-group-title {
  font-size: 12px; font-weight: 800; color: #111;
  margin: 0 0 10px;
}
.slider-row {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.slider-row:last-child { margin-bottom: 0; }
.slider-row label {
  width: 34px; font-size: 12px; font-weight: 700; color: #444;
}
.slider-row input[type=range] {
  flex: 1; cursor: pointer;
}
.slider-val {
  width: 42px; text-align: right;
  font-size: 12px; font-variant-numeric: tabular-nums;
  color: #666; font-weight: 600;
}

.edit-footer {
  padding: 14px 22px;
  border-top: 1px solid #eee;
  display: flex; gap: 8px; justify-content: flex-end;
}
.btn-secondary, .btn-primary {
  padding: 9px 18px; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  border: none; transition: all 0.15s;
}
.btn-secondary { background: #f5f5f5; color: #666; }
.btn-secondary:hover { background: #e5e5e5; color: #111; }
.btn-primary { background: #111; color: white; }
.btn-primary:hover { background: #333; }

@media (max-width: 768px) {
  .org-section { padding: 64px 0; }
  .org-title { font-size: 1.4rem; }
  .node-ceo { padding: 16px 20px; }
  .ceo-av { width: 64px !important; height: 64px !important; }
  .dir-av { width: 56px !important; height: 56px !important; }
  .tier-branch { flex-direction: column; gap: 12px; align-items: center; }
  .team-section { flex-direction: column; }
  .team-card.team-sales { flex: 1; }
  .team-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .chart-line-branch { width: 60%; }
  .preview-area { flex-direction: column; align-items: center; }
  .preview-full { max-width: 240px; }
}
</style>
