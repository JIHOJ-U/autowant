<template>
  <div class="page">
    <div class="container">
      <div class="page-head">
        <h1>오토원트를 이끌어가는 사람들</h1>
        <p>클릭하시면 매니저에게 바로 상담받으실 수 있습니다</p>
      </div>

      <!-- 매니저 리스트 -->
      <div v-for="(m, idx) in managerList" :key="m.id" v-reveal="{ delay: 100, dir: idx % 2 === 0 ? 'left' : 'right' }" class="leader-section" :class="{ reverse: idx % 2 === 1 }">
        <div class="leader-photo">
          <img v-if="m.image" :src="m.image" :alt="m.name" />
          <div v-else class="leader-placeholder"><span>{{ m.name.charAt(0) }}</span></div>
          <!-- 관리자: 사진 변경 -->
          <label v-if="isAdmin" class="photo-edit-btn">
            사진 변경
            <input type="file" accept="image/*" hidden @change="e => changePhoto(e, m)" />
          </label>
        </div>

        <div class="leader-info">
          <!-- 보기 모드 -->
          <template v-if="editingId !== m.id">
            <h2>{{ m.name }}</h2>
            <h3>{{ m.role }}</h3>
            <p class="leader-intro">{{ m.intro }}</p>

            <!-- 자세히 보기 -->
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

      <!-- 관리자: 매니저 추가 -->
      <div v-if="isAdmin" class="add-leader">
        <button class="add-leader-btn" @click="addNew">+ 새 매니저 추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useManagers } from '../stores/managers'
import { useAuth } from '../stores/auth'

const openInquiryModal = inject('openInquiryModal')
const { managerList, addManager, updateManager } = useManagers()
const { isAdmin } = useAuth()

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
    intro: '소개를 입력해주세요.', detail: '', image: '', tags: [],
  })
}
</script>

<style scoped>
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
.page { padding: 48px 0 60px; }
.page-head { text-align: center; margin-bottom: 48px; }
.page-head h1 { font-size: 1.6rem; font-weight: 800; color: #111; }
.page-head p { font-size: 14px; color: #999; margin-top: 6px; }

/* 리더 섹션 */
.leader-section {
  display: flex; gap: 40px; align-items: flex-start;
  padding: 48px 0; border-bottom: 1px solid #f0f0f0;
}
.leader-section:last-of-type { border-bottom: none; }
.leader-section.reverse { flex-direction: row-reverse; }

/* 사진 */
.leader-photo { width: 280px; flex-shrink: 0; position: relative; }
.leader-photo img {
  width: 100%; aspect-ratio: 3/4; object-fit: cover; border-radius: 12px;
}
.leader-placeholder {
  width: 100%; aspect-ratio: 3/4; border-radius: 12px;
  background: linear-gradient(135deg, #e8e8e8, #d0d0d0);
  display: flex; align-items: center; justify-content: center;
}
.leader-placeholder span { font-size: 64px; font-weight: 800; color: white; }
.photo-edit-btn {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  padding: 6px 16px; background: rgba(0,0,0,0.6); color: white; border-radius: 6px;
  font-size: 11px; font-weight: 600; cursor: pointer; backdrop-filter: blur(4px);
}
.photo-edit-btn:hover { background: rgba(0,0,0,0.8); }

/* 정보 */
.leader-info { flex: 1; }
.leader-info h2 { font-size: 1.5rem; font-weight: 800; color: #111; margin: 0; }
.leader-info h3 { font-size: 15px; font-weight: 600; color: #999; margin: 4px 0 16px; }
.leader-intro { font-size: 15px; color: #444; line-height: 1.75; margin: 0 0 16px; word-break: keep-all; }

/* 자세히 보기 */
.toggle-section { margin-bottom: 16px; }
.toggle-btn {
  background: none; border: 1px solid #eee; border-radius: 6px;
  padding: 8px 18px; font-size: 13px; font-weight: 600; color: #666;
  cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.15s;
}
.toggle-btn:hover { border-color: #ccc; color: #111; }
.toggle-btn span { transition: transform 0.25s; font-size: 16px; }
.toggle-btn span.open { transform: rotate(90deg); }
.toggle-content {
  max-height: 0; overflow: hidden; transition: max-height 0.35s ease;
}
.toggle-content.show { max-height: 600px; }
.toggle-content p {
  font-size: 14px; color: #666; line-height: 1.8; margin: 14px 0 0;
  white-space: pre-line; word-break: keep-all;
}

/* 태그 */
.leader-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.leader-tags span {
  font-size: 12px; font-weight: 600; padding: 5px 14px;
  background: #f5f5f5; border-radius: 100px; color: #888;
}

/* 버튼 */
.leader-actions { display: flex; gap: 8px; }
.consult-btn {
  padding: 10px 28px; background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white; border: none;
  border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.consult-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(77,142,247,0.3); }
.edit-inline-btn {
  padding: 10px 20px; background: white; color: #888; border: 1px solid #eee;
  border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
}
.edit-inline-btn:hover { border-color: #ccc; color: #111; }

/* 인라인 수정 */
.inline-edit { }
.ie-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.ie-field { margin-bottom: 10px; }
.ie-field label { display: block; font-size: 11px; font-weight: 600; color: #999; margin-bottom: 4px; }
.ie-field input, .ie-field textarea {
  width: 100%; padding: 9px 12px; border: 1px solid #eee; border-radius: 6px;
  font-size: 13px; color: #111; outline: none; font-family: inherit; resize: vertical;
}
.ie-field input:focus, .ie-field textarea:focus { border-color: #999; }
.ie-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
.ie-cancel { padding: 8px 18px; background: white; color: #666; border: 1px solid #eee; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.ie-save { padding: 8px 22px; background: #111; color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
.ie-save:hover { background: #333; }

/* 매니저 추가 */
.add-leader { text-align: center; padding: 40px 0; }
.add-leader-btn {
  padding: 12px 32px; border: 1px dashed #ddd; border-radius: 8px;
  background: white; font-size: 14px; font-weight: 600; color: #999; cursor: pointer;
}
.add-leader-btn:hover { border-color: #111; color: #111; }

/* 반응형 */
@media (max-width: 768px) {
  .leader-section, .leader-section.reverse { flex-direction: column; gap: 20px; }
  .leader-photo { width: 100%; max-width: 300px; margin: 0 auto; }
  .ie-row { grid-template-columns: 1fr; }
}
</style>
