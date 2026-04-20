<template>
  <div class="page">
    <div class="container">
      <h1 class="page-title">후기 작성</h1>
      <p class="page-sub">오토원트 이용 경험을 공유해주세요</p>

      <div class="notice-box">
        <div class="notice-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="notice-text">
          <p class="notice-title">후기 작성 시 유의사항</p>
          <p class="notice-desc">허위 정보, 욕설·비방, 광고·홍보, 타인을 불쾌하게 하는 내용 등 부적절한 게시물은 <strong>사전 고지 없이 관리자에 의해 임의 삭제</strong>될 수 있습니다. 건전하고 진정성 있는 이용 후기를 부탁드립니다.</p>
        </div>
      </div>

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

          <button class="ai-btn" @click="generateReview" :disabled="!form.vehicle || aiLoading">
            <svg v-if="!aiLoading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>
            <span v-if="aiLoading" class="ai-spinner"></span>
            {{ aiLoading ? 'AI 작성 중...' : 'AI로 후기 자동 작성' }}
          </button>

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

const aiLoading = ref(false)

function generateReview() {
  if (!form.value.vehicle) return alert('차량명을 먼저 입력해주세요')
  aiLoading.value = true

  const vehicle = form.value.vehicle
  const name = form.value.name || '고객'
  const rating = form.value.rating

  const templates = [
    {
      title: `${vehicle} 장기렌트 후기 - 정말 만족합니다`,
      blocks: [
        `안녕하세요, ${vehicle}를 장기렌트로 이용하고 있는 ${name}입니다.`,
        `처음에 렌트카를 알아볼 때 여러 업체를 비교했는데, 오토원트가 가격도 제일 합리적이고 상담도 정말 친절하게 해주셔서 바로 결정했습니다.`,
        `특히 매니저님이 제 상황에 맞는 조건을 꼼꼼하게 비교해주신 게 인상 깊었어요. 다른 곳에서는 그냥 견적만 던져주는 느낌이었는데, 여기는 진짜 1:1로 맞춤 상담해주시더라구요.`,
        `${vehicle} 차량 자체도 너무 만족스럽고, 출고도 빨라서 계약하고 3일 만에 받았습니다. 주변에 렌트 고민하는 분들에게 꼭 추천하고 싶은 곳이에요!`,
      ],
      tags: ['친절한 상담', '빠른 출고', '합리적인 가격'],
    },
    {
      title: `${vehicle} 리스 이용 후기`,
      blocks: [
        `${vehicle}를 리스로 이용 중인 ${name}입니다. 후기 남깁니다.`,
        `법인 차량으로 ${vehicle}를 리스하려고 여러 곳을 알아봤는데, 오토원트에서 가장 좋은 조건을 제시해주셨습니다. 세금 혜택까지 꼼꼼하게 안내해주셔서 비용 절감에 큰 도움이 되었어요.`,
        `상담부터 계약까지 과정이 정말 매끄러웠습니다. 중간에 궁금한 점이 있어서 카카오톡으로 물어봤는데 바로바로 답변해주시더라구요. 이런 세심한 서비스가 정말 마음에 들었습니다.`,
        `${vehicle} 타고 다니면서 매일 기분이 좋습니다. 다음에 차량 교체할 때도 오토원트를 이용할 생각입니다. ${rating}점 만점!`,
      ],
      tags: ['법인리스', '세금혜택', '빠른 답변'],
    },
    {
      title: `오토원트에서 ${vehicle} 계약했어요!`,
      blocks: [
        `${name}입니다. 드디어 ${vehicle}를 오토원트에서 계약했어요!`,
        `가격 비교를 정말 많이 했는데, 오토원트가 확실히 저렴했습니다. 같은 차량인데도 월 납입금이 다른 곳보다 8만원이나 적었거든요. 20개 이상 금융사를 비교해준다더니 진짜였어요.`,
        `무엇보다 좋았던 건 견적서가 정말 투명했다는 거예요. 다른 곳에서는 이것저것 추가비용이 붙던데, 여기는 처음 안내받은 그대로였습니다. 숨겨진 비용 없이 정직하게 안내해주셔서 신뢰가 갔어요.`,
        `${vehicle} 출고받고 벌써 한 달째 타고 있는데, 진짜 잘 선택했다는 생각이 듭니다. 오토원트 강력 추천합니다!`,
      ],
      tags: ['최저가', '투명한 견적', '강력 추천'],
    },
  ]

  setTimeout(() => {
    const tpl = templates[Math.floor(Math.random() * templates.length)]
    form.value.title = tpl.title
    form.value.blocks = tpl.blocks.map(text => ({ type: 'text', content: text }))
    tagInput.value = tpl.tags.join(', ')
    aiLoading.value = false
  }, 1500)
}

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
.page-sub { font-size: 13px; color: #999; margin: 2px 0 20px; }

.notice-box {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 16px 20px; margin-bottom: 20px;
  background: #fff8e6;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 10px;
}
.notice-icon {
  flex-shrink: 0; color: #d97706;
  margin-top: 1px;
}
.notice-title {
  font-size: 13px; font-weight: 800; color: #92400e;
  margin: 0 0 4px; letter-spacing: -0.2px;
}
.notice-desc {
  font-size: 12.5px; color: #78350f;
  margin: 0; line-height: 1.65; font-weight: 500;
}
.notice-desc strong { color: #92400e; font-weight: 800; }

.write-card { border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden; }
.info-section { padding: 24px; border-bottom: 1px solid #f0f0f0; }
.editor-section { padding: 24px; border-bottom: 1px solid #f0f0f0; }
.submit-section { padding: 20px 24px; }

.row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (max-width: 600px) { .row2 { grid-template-columns: 1fr; } }
.field { margin-bottom: 12px; }
.field label { display: block; font-size: 12px; font-weight: 700; color: #333; margin-bottom: 4px; }
.field input { width: 100%; padding: 9px 12px; border: 1px solid #eee; border-radius: 6px; font-size: 13px; color: #111; outline: none; }
.field input:focus { border-color: #999; }
.img-input-row { display: flex; gap: 6px; align-items: stretch; }
.img-input-row input { flex: 1; }
.file-btn {
  padding: 8px 14px; background: #f5f5f5; border: 1px solid #eee; border-radius: 6px;
  font-size: 12px; font-weight: 600; color: #666; cursor: pointer; display: flex; align-items: center;
  white-space: nowrap; transition: all 0.15s; height: auto;
}
.file-btn:hover { background: #eee; color: #111; }
.thumb-preview { margin-top: 8px; border-radius: 8px; overflow: hidden; max-height: 160px; }
.thumb-preview img { width: 100%; max-height: 160px; object-fit: cover; }

.star-select { display: flex; gap: 2px; padding-top: 4px; }
.star-select button { background: none; border: none; font-size: 22px; cursor: pointer; padding: 0; }
.sf { color: #111; }
.se { color: #ddd; }

.editor-label { display: block; font-size: 14px; font-weight: 800; color: #111; margin-bottom: 2px; }
.editor-desc { font-size: 12px; color: #999; margin: 0 0 12px; }

.ai-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  width: 100%; padding: 12px; margin-bottom: 16px;
  background: linear-gradient(135deg, #4d8ef7, #6c5ce7); color: white;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.ai-btn:hover { box-shadow: 0 4px 16px rgba(77,142,247,0.3); transform: translateY(-1px); }
.ai-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
.ai-spinner {
  width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white; border-radius: 50%;
  animation: aiSpin 0.6s linear infinite;
}
@keyframes aiSpin { to { transform: rotate(360deg); } }

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
