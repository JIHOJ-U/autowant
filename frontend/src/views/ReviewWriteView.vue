<template>
  <div class="page">
    <div class="container">
      <h1 class="page-title">후기 작성</h1>
      <p class="page-sub">오토원트 이용 경험을 공유해주세요</p>

      <div class="write-card">
        <!-- 기본 정보 -->
        <div class="info-section">
          <div class="row2">
            <div class="field"><label>이름 *</label><input v-model="form.name" /></div>
            <div class="field"><label>차량명 *</label><input v-model="form.vehicle" placeholder="예: 싼타페 하이브리드" /></div>
          </div>
          <div class="field"><label>제목 *</label><input v-model="form.title" placeholder="후기 제목을 입력해주세요" /></div>
          <div class="row2">
            <div class="field">
              <label>대표 이미지 (선택)</label>
              <div class="img-input-row">
                <input v-model="form.thumbnail" placeholder="URL 입력 또는 파일 선택" />
                <label class="file-btn">파일<input type="file" accept="image/*" hidden @change="e => handleFile(e, val => form.thumbnail = val)" /></label>
              </div>
              <div v-if="form.thumbnail" class="thumb-preview"><img :src="form.thumbnail" /></div>
            </div>
            <div class="field">
              <label>별점</label>
              <div class="star-select">
                <button v-for="n in 5" :key="n" :class="n <= form.rating ? 'sf' : 'se'" @click="form.rating = n">★</button>
              </div>
            </div>
          </div>
          <div class="field"><label>태그 (쉼표로 구분, 선택)</label><input v-model="tagInput" placeholder="친절한 상담, 빠른 출고" /></div>
        </div>

        <!-- 블록 에디터 -->
        <div class="editor-section">
          <label class="editor-label">내용 작성</label>
          <p class="editor-desc">텍스트와 이미지를 자유롭게 추가하세요</p>

          <div v-for="(block, i) in form.blocks" :key="i" class="block-item">
            <!-- 텍스트 블록 -->
            <div v-if="block.type === 'text'" class="block-wrap">
              <div class="block-handle">
                <span class="block-type-label">텍스트</span>
                <div class="block-controls">
                  <button v-if="i > 0" @click="moveBlock(i, -1)" class="bc">↑</button>
                  <button v-if="i < form.blocks.length - 1" @click="moveBlock(i, 1)" class="bc">↓</button>
                  <button @click="removeBlock(i)" class="bc del">✕</button>
                </div>
              </div>
              <textarea v-model="block.content" rows="4" placeholder="내용을 입력하세요..."></textarea>
            </div>

            <!-- 이미지 블록 -->
            <div v-if="block.type === 'image'" class="block-wrap">
              <div class="block-handle">
                <span class="block-type-label">이미지</span>
                <div class="block-controls">
                  <button v-if="i > 0" @click="moveBlock(i, -1)" class="bc">↑</button>
                  <button v-if="i < form.blocks.length - 1" @click="moveBlock(i, 1)" class="bc">↓</button>
                  <button @click="removeBlock(i)" class="bc del">✕</button>
                </div>
              </div>
              <div class="img-input-row block-url-row">
                <input v-model="block.src" placeholder="URL 입력 또는 파일 선택" class="img-url-input" />
                <label class="file-btn">파일<input type="file" accept="image/*" hidden @change="e => handleFile(e, val => block.src = val)" /></label>
              </div>
              <div v-if="block.src" class="block-img-preview"><img :src="block.src" /></div>
              <input v-model="block.caption" placeholder="사진 설명 (선택)" class="caption-input" />
            </div>
          </div>

          <!-- 블록 추가 버튼 -->
          <div class="add-block-row">
            <button class="add-block-btn" @click="addBlock('text')">+ 텍스트 추가</button>
            <button class="add-block-btn" @click="addBlock('image')">+ 이미지 추가</button>
          </div>
        </div>

        <!-- 제출 -->
        <div class="submit-section">
          <button class="submit-btn" @click="submit" :disabled="!canSubmit">후기 등록하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReviews } from '../stores/reviews'

const router = useRouter()
const { addReview } = useReviews()

const tagInput = ref('')
const form = ref({
  name: '', vehicle: '', title: '', thumbnail: '', rating: 5, tags: [],
  blocks: [{ type: 'text', content: '' }],
})

function handleFile(e, setter) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => setter(reader.result)
  reader.readAsDataURL(file)
}

const canSubmit = computed(() => form.value.name && form.value.vehicle && form.value.title && form.value.blocks.some(b => (b.type === 'text' && b.content) || (b.type === 'image' && b.src)))

function addBlock(type) {
  if (type === 'text') form.value.blocks.push({ type: 'text', content: '' })
  else form.value.blocks.push({ type: 'image', src: '', caption: '' })
}

function removeBlock(i) {
  form.value.blocks.splice(i, 1)
}

function moveBlock(i, dir) {
  const arr = form.value.blocks
  const j = i + dir
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

function submit() {
  const tags = tagInput.value ? tagInput.value.split(',').map(t => t.trim()).filter(Boolean) : []
  const blocks = form.value.blocks.filter(b => (b.type === 'text' && b.content) || (b.type === 'image' && b.src))
  const today = new Date()
  const date = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}`

  addReview({
    ...form.value,
    date,
    tags,
    blocks,
    thumbnail: form.value.thumbnail || (blocks.find(b => b.type === 'image')?.src || ''),
  })
  alert('후기가 등록되었습니다. 감사합니다!')
  router.push('/')
}
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
.page { padding: 36px 0 60px; }
.page-title { font-size: 1.4rem; font-weight: 800; color: #111; margin: 0; }
.page-sub { font-size: 13px; color: #999; margin: 2px 0 24px; }

.write-card { border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; }
.info-section { padding: 24px; border-bottom: 1px solid #f0f0f0; }
.editor-section { padding: 24px; border-bottom: 1px solid #f0f0f0; }
.submit-section { padding: 20px 24px; }

.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 600px) { .row2 { grid-template-columns: 1fr; } }
.field { margin-bottom: 12px; }
.field label { display: block; font-size: 12px; font-weight: 600; color: #888; margin-bottom: 4px; }
.field input { width: 100%; padding: 9px 12px; border: 1px solid #eee; border-radius: 6px; font-size: 13px; color: #111; outline: none; }
.field input:focus { border-color: #999; }
.img-input-row { display: flex; gap: 6px; }
.img-input-row input { flex: 1; }
.file-btn {
  padding: 0 14px; background: #f5f5f5; border: 1px solid #eee; border-radius: 6px;
  font-size: 12px; font-weight: 600; color: #666; cursor: pointer; display: flex; align-items: center;
  white-space: nowrap; transition: all 0.15s;
}
.file-btn:hover { background: #eee; color: #111; }
.thumb-preview { margin-top: 8px; border-radius: 8px; overflow: hidden; max-height: 160px; }
.thumb-preview img { width: 100%; max-height: 160px; object-fit: cover; }

.star-select { display: flex; gap: 2px; padding-top: 4px; }
.star-select button { background: none; border: none; font-size: 22px; cursor: pointer; padding: 0; }
.sf { color: #111; }
.se { color: #ddd; }

.editor-label { display: block; font-size: 14px; font-weight: 700; color: #111; margin-bottom: 2px; }
.editor-desc { font-size: 12px; color: #bbb; margin: 0 0 16px; }

.block-item { margin-bottom: 12px; }
.block-wrap { border: 1px solid #f0f0f0; border-radius: 8px; overflow: hidden; }
.block-handle { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
.block-type-label { font-size: 11px; font-weight: 600; color: #999; }
.block-controls { display: flex; gap: 4px; }
.bc { width: 24px; height: 24px; border: 1px solid #eee; border-radius: 4px; background: white; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #888; }
.bc:hover { border-color: #ccc; color: #111; }
.bc.del { color: #d00; }
.bc.del:hover { background: #fff0f0; }

.block-wrap textarea {
  width: 100%; border: none; padding: 14px; font-size: 14px; color: #333; line-height: 1.7;
  resize: vertical; outline: none; font-family: inherit; min-height: 100px;
}
.block-url-row { padding: 8px 14px 0; }
.block-url-row input { border: 1px solid #eee; border-radius: 6px; padding: 8px 10px; font-size: 12px; }
.img-url-input { width: 100%; border: none; border-bottom: 1px solid #f0f0f0; padding: 10px 14px; font-size: 13px; outline: none; color: #111; }
.img-url-input:focus { border-color: #999; }
.block-img-preview { padding: 10px 14px; }
.block-img-preview img { width: 100%; border-radius: 6px; max-height: 300px; object-fit: cover; }
.caption-input { width: 100%; border: none; border-top: 1px solid #f0f0f0; padding: 8px 14px; font-size: 12px; color: #888; outline: none; }

.add-block-row { display: flex; gap: 8px; margin-top: 4px; }
.add-block-btn {
  flex: 1; padding: 10px; border: 1px dashed #ddd; border-radius: 8px; background: white;
  font-size: 13px; font-weight: 600; color: #999; cursor: pointer; transition: all 0.15s;
}
.add-block-btn:hover { border-color: #111; color: #111; }

.submit-btn {
  width: 100%; padding: 13px; background: #111; color: white; border: none; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s;
}
.submit-btn:hover { background: #333; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }
</style>
