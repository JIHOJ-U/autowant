<template>
  <div class="page">
    <!-- 매니저 리스트 (풀 섹션) -->
    <div id="managers-list"></div>
    <template v-for="(m, idx) in managerList" :key="m.id">
      <div :id="'manager-' + m.id" class="leader-full" :class="'theme-' + (idx % 4)">
      <div class="leader-full-bg"></div>
      <div class="container leader-section" :class="{ reverse: idx % 2 === 1 }">
        <div v-reveal="{ delay: 100, dir: idx % 2 === 0 ? 'left' : 'right' }" class="leader-photo">
          <img v-if="m.image" :src="m.image" :alt="m.name" />
          <div v-else class="leader-placeholder"><span>{{ m.name.charAt(0) }}</span></div>
          <label v-if="isAdmin" class="photo-edit-btn">
            사진 변경
            <input type="file" accept="image/*" hidden @change="e => changePhoto(e, m)" />
          </label>
        </div>

        <div v-reveal="{ delay: 200, dir: idx % 2 === 0 ? 'right' : 'left' }" class="leader-info">
          <template v-if="editingId !== m.id">
            <p class="leader-num">{{ String(idx + 1).padStart(2, '0') }}</p>
            <h2>{{ m.name }}</h2>
            <h3>{{ m.role }}</h3>
            <p class="leader-intro">{{ m.intro }}</p>

            <div v-if="m.detail" class="toggle-section">
              <button class="toggle-btn" @click="toggleDetail(m.id)">
                {{ openIds.has(m.id) ? '접기' : '자세히 보기' }}
                <span :class="{ open: openIds.has(m.id) }">›</span>
              </button>
              <div class="toggle-content" :class="{ show: openIds.has(m.id) }">
                <p>{{ m.detail }}</p>
              </div>
            </div>

            <div class="leader-tags">
              <span v-for="t in m.tags" :key="t">{{ t }}</span>
            </div>

            <div class="leader-actions">
              <button class="consult-btn" @click="openInquiryModal(m)">상담받기 ›</button>
              <button v-if="isAdmin" class="edit-inline-btn" @click="startEdit(m)">수정</button>
            </div>
          </template>

          <!-- 수정 모드 (관리자) -->
          <template v-else>
            <div class="inline-edit">
              <div class="ie-row">
                <div class="ie-field"><label>이름</label><input v-model="editForm.name" /></div>
                <div class="ie-field"><label>직책</label><input v-model="editForm.role" /></div>
                <div class="ie-field"><label>경력</label><input v-model="editForm.experience" /></div>
              </div>
              <div class="ie-field"><label>소개</label><textarea v-model="editForm.intro" rows="3"></textarea></div>
              <div class="ie-field"><label>상세 소개</label><textarea v-model="editForm.detail" rows="5"></textarea></div>
              <div class="ie-row">
                <div class="ie-field"><label>전화번호</label><input v-model="editForm.phone" /></div>
                <div class="ie-field"><label>전문분야 (쉼표 구분)</label><input v-model="editTagInput" /></div>
              </div>
              <div class="ie-actions">
                <button class="ie-cancel" @click="editingId = null">취소</button>
                <button class="ie-save" @click="saveEdit">저장</button>
              </div>
            </div>
          </template>
        </div>
      </div>
      </div>
    </template>

    <!-- 관리자: 매니저 추가 -->
    <div v-if="isAdmin" class="add-leader">
      <div class="container">
        <button class="add-leader-btn" @click="addNew">+ 새 매니저 추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useManagers } from '../stores/managers'
import { useAuth } from '../stores/auth'

const route = useRoute()
const openInquiryModal = inject('openInquiryModal')
const { managerList, addManager, updateManager } = useManagers()
const { isAdmin } = useAuth()

onMounted(() => {
  const hash = route.hash
  if (hash && hash.startsWith('#manager-')) {
    setTimeout(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }
})

// 자세히 보기 토글
const openIds = reactive(new Set())
function toggleDetail(id) {
  if (openIds.has(id)) openIds.delete(id)
  else openIds.add(id)
}

// 인라인 수정
const editingId = ref(null)
const editForm = ref({})
const editTagInput = ref('')

function startEdit(m) {
  editingId.value = m.id
  editForm.value = { ...m }
  editTagInput.value = (m.tags || []).join(', ')
}

function saveEdit() {
  editForm.value.tags = editTagInput.value ? editTagInput.value.split(',').map(t => t.trim()).filter(Boolean) : []
  updateManager(editForm.value)
  editingId.value = null
}

function changePhoto(e, m) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    m.image = reader.result
    updateManager(m)
  }
  reader.readAsDataURL(file)
}

function addNew() {
  addManager({
    name: '새 매니저', role: '매니저', experience: '', phone: '',
    intro: '소개를 입력해주세요.', detail: '', image: '', tags: [], isMVP: false,
  })
}

</script>

<style scoped>
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
.page { padding: 0; }

.leader-full { position: relative; overflow: hidden; }
.leader-full-bg { position: absolute; inset: 0; opacity: 0.06; }

.theme-0 { background: #f0f5ff; }
.theme-0 .leader-full-bg { background: radial-gradient(ellipse at 30% 50%, rgba(77,142,247,0.08), transparent 70%); }
.theme-0 .leader-num { color: #4d8ef7; }
.theme-0 .leader-info h3 { color: #4d8ef7; }
.theme-0 .leader-tags span { background: rgba(77,142,247,0.1); color: #4d8ef7; }
.theme-0 .consult-btn { background: linear-gradient(135deg, #4d8ef7, #3a6fd8); }
.theme-0 .toggle-btn { border-color: #c8daff; color: #4d8ef7; }
.theme-0 .toggle-btn:hover { background: rgba(77,142,247,0.06); }

.theme-1 { background: #f5f0ff; }
.theme-1 .leader-full-bg { background: radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.08), transparent 70%); }
.theme-1 .leader-num { color: #8b5cf6; }
.theme-1 .leader-info h3 { color: #8b5cf6; }
.theme-1 .leader-tags span { background: rgba(139,92,246,0.1); color: #8b5cf6; }
.theme-1 .consult-btn { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }
.theme-1 .toggle-btn { border-color: #ddd0ff; color: #8b5cf6; }
.theme-1 .toggle-btn:hover { background: rgba(139,92,246,0.06); }

.theme-2 { background: #ecfdf5; }
.theme-2 .leader-full-bg { background: radial-gradient(ellipse at 30% 50%, rgba(16,185,129,0.08), transparent 70%); }
.theme-2 .leader-num { color: #10b981; }
.theme-2 .leader-info h3 { color: #10b981; }
.theme-2 .leader-tags span { background: rgba(16,185,129,0.1); color: #10b981; }
.theme-2 .consult-btn { background: linear-gradient(135deg, #10b981, #059669); }
.theme-2 .toggle-btn { border-color: #a7f3d0; color: #10b981; }
.theme-2 .toggle-btn:hover { background: rgba(16,185,129,0.06); }

.theme-3 { background: #fff8eb; }
.theme-3 .leader-full-bg { background: radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.08), transparent 70%); }
.theme-3 .leader-num { color: #f59e0b; }
.theme-3 .leader-info h3 { color: #d97706; }
.theme-3 .leader-tags span { background: rgba(245,158,11,0.1); color: #d97706; }
.theme-3 .consult-btn { background: linear-gradient(135deg, #f59e0b, #d97706); }
.theme-3 .toggle-btn { border-color: #fde68a; color: #d97706; }
.theme-3 .toggle-btn:hover { background: rgba(245,158,11,0.06); }

/* 리더 섹션 */
.leader-section {
  display: flex; gap: 48px; align-items: center;
  padding: 72px 0; position: relative; z-index: 1;
}
.leader-section.reverse { flex-direction: row-reverse; }

/* 넘버 */
.leader-num { font-size: 48px; font-weight: 900; opacity: 0.3; margin: 0 0 4px; line-height: 1; }

/* 사진 */
.leader-photo { width: 300px; flex-shrink: 0; position: relative; }
.leader-photo img {
  width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.leader-placeholder {
  width: 100%; aspect-ratio: 3/4; border-radius: 16px;
  background: white; border: 1px solid #eee;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 40px rgba(0,0,0,0.06);
}
.leader-placeholder span { font-size: 72px; font-weight: 900; color: #ddd; }
.photo-edit-btn {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  padding: 6px 16px; background: rgba(0,0,0,0.6); color: white; border-radius: 6px;
  font-size: 11px; font-weight: 600; cursor: pointer; backdrop-filter: blur(4px);
}
.photo-edit-btn:hover { background: rgba(0,0,0,0.8); }

/* 정보 */
.leader-info { flex: 1; }
.leader-info h2 { font-size: 1.6rem; font-weight: 900; color: #1a1a1a; margin: 0; }
.leader-info h3 { font-size: 14px; font-weight: 600; margin: 4px 0 18px; letter-spacing: 0.5px; }
.leader-intro { font-size: 15px; color: #666; line-height: 1.8; margin: 0 0 16px; word-break: keep-all; }

/* 자세히 보기 */
.toggle-section { margin-bottom: 16px; }
.toggle-btn {
  background: none; border: 1px solid #e0e7ff; border-radius: 6px;
  padding: 8px 18px; font-size: 13px; font-weight: 600; color: #4d8ef7;
  cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s;
}
.toggle-btn:hover { border-color: #4d8ef7; background: #f0f4ff; }
.toggle-btn span { transition: transform 0.25s; font-size: 16px; }
.toggle-btn span.open { transform: rotate(90deg); }
.toggle-content {
  max-height: 0; overflow: hidden; transition: max-height 0.35s ease;
}
.toggle-content.show { max-height: 600px; }
.toggle-content p {
  font-size: 14px; color: #888; line-height: 1.8; margin: 14px 0 0;
  white-space: pre-line; word-break: keep-all;
}

/* 태그 */
.leader-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.leader-tags span {
  font-size: 11px; font-weight: 600; padding: 5px 14px;
  background: #f0f4ff; border-radius: 100px; color: #4d8ef7;
}

/* 버튼 */
.leader-actions { display: flex; gap: 8px; }
.consult-btn {
  padding: 10px 28px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white; border: none;
  border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.consult-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
.edit-inline-btn {
  padding: 10px 20px; background: white; color: #888;
  border: 1px solid #e5e5e5; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.edit-inline-btn:hover { border-color: #ccc; color: #333; }

/* 인라인 수정 */
.inline-edit { }
.ie-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ie-field { margin-bottom: 10px; }
.ie-field label { display: block; font-size: 11px; font-weight: 600; color: #999; margin-bottom: 4px; }
.ie-field input, .ie-field textarea {
  width: 100%; padding: 9px 12px; border: 1px solid #e5e5e5; border-radius: 6px;
  font-size: 13px; color: #333; background: white; outline: none; font-family: inherit; resize: vertical;
}
.ie-field input:focus, .ie-field textarea:focus { border-color: #aaa; }
.ie-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
.ie-cancel { padding: 8px 18px; background: white; color: #666; border: 1px solid #e5e5e5; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.ie-save { padding: 8px 22px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.ie-save:hover { box-shadow: 0 4px 12px rgba(77,142,247,0.3); }

/* 매니저 추가 */
.add-leader { text-align: center; padding: 48px 0; background: #f8f9fa; }
.add-leader-btn {
  padding: 14px 36px; border: 2px dashed #d0d9f0; border-radius: 10px;
  background: white; font-size: 14px; font-weight: 600; color: #4d8ef7; cursor: pointer;
  transition: all 0.2s;
}
.add-leader-btn:hover { border-color: #4d8ef7; background: #f0f5ff; }

.photo-edit-btn {
  position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
  padding: 6px 16px; background: rgba(0,0,0,0.6); color: white; border-radius: 6px;
  font-size: 11px; font-weight: 600; cursor: pointer; backdrop-filter: blur(4px);
}
.photo-edit-btn:hover { background: rgba(0,0,0,0.8); }

/* 반응형 */
@media (max-width: 768px) {
  .leader-section, .leader-section.reverse { flex-direction: column; gap: 24px; padding: 48px 0; }
  .leader-photo { width: 100%; max-width: 280px; margin: 0 auto; }
  .leader-num { font-size: 36px; }
  .ie-row { grid-template-columns: 1fr; }
}
</style>
