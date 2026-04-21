<template>
  <div class="page" v-if="review">
    <div class="container">
      <router-link to="/reviews" class="back">← 목록으로</router-link>
      <article class="article">
        <div class="article-head">
          <div class="article-stars"><span v-for="n in 5" :key="n" :class="n <= review.rating ? 'sf' : 'se'">★</span></div>
          <h1>{{ review.title }}</h1>
          <div class="article-meta">
            <span class="author-avatar">{{ review.name.charAt(0) }}</span>
            <span class="author-name">{{ review.name }}</span>
            <span class="meta-dot">·</span>
            <span>{{ review.vehicle }}</span>
            <span class="meta-dot">·</span>
            <span>{{ review.date }}</span>
          </div>
          <div class="article-tags" v-if="review.tags?.length">
            <span v-for="t in review.tags" :key="t">{{ t }}</span>
          </div>
        </div>
        <div class="article-body">
          <template v-for="(block, i) in review.blocks" :key="i">
            <p v-if="block.type === 'text'" class="block-text">{{ block.content }}</p>
            <figure v-if="block.type === 'image'" class="block-figure">
              <img :src="block.src" :alt="block.caption" />
              <figcaption v-if="block.caption">{{ block.caption }}</figcaption>
            </figure>
          </template>
        </div>
      </article>

      <!-- 댓글 섹션 -->
      <section class="comments">
        <h2 class="comments-title">댓글 <span class="comments-count">{{ allComments.length }}</span></h2>

        <ul v-if="allComments.length" class="comment-list">
          <li
            v-for="c in allComments"
            :key="c.id"
            class="comment-item"
            :class="{ 'is-staff': c.isStaff }"
          >
            <div class="comment-head">
              <span class="comment-avatar" :class="{ 'has-img': c.avatar }">
                <img v-if="c.avatar" :src="c.avatar" :alt="c.name" />
                <span v-else>{{ c.name.charAt(0) }}</span>
              </span>
              <div class="comment-name-wrap">
                <span class="comment-name">
                  {{ c.name }}<span v-if="c.role" class="comment-role"> {{ c.role }}</span>
                </span>
                <span v-if="c.isStaff" class="comment-badge">오토원트</span>
              </div>
              <span class="comment-date">{{ formatDate(c.date) }}</span>
              <button v-if="isAdmin && !c.isStaff" class="comment-del" @click="onRemove(c.id)">삭제</button>
            </div>
            <p class="comment-text">{{ c.content }}</p>
          </li>
        </ul>
        <p v-else class="comment-empty">첫 댓글을 남겨보세요</p>

        <form class="comment-form" @submit.prevent="onSubmit">
          <div v-if="isAdmin && adminUser?.avatar" class="as-admin-row">
            <img :src="adminUser.avatar" :alt="adminUser.name" class="as-admin-avatar" />
            <span class="as-admin-text">{{ adminUser.name }}{{ adminUser.role ? ' ' + adminUser.role : '' }} 이름으로 댓글</span>
          </div>
          <input
            v-else
            v-model="form.name"
            class="comment-name-input"
            placeholder="이름"
            maxlength="20"
          />
          <div class="comment-content-row">
            <textarea
              v-model="form.content"
              class="comment-content-input"
              placeholder="댓글을 입력하세요"
              rows="3"
              maxlength="500"
            />
            <button type="submit" class="comment-submit" :disabled="!canSubmit">등록</button>
          </div>
        </form>
      </section>
    </div>
  </div>
  <div v-else class="page"><div class="container"><p class="empty">후기를 찾을 수 없습니다</p></div></div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useReviews } from '../stores/reviews'
import { useComments } from '../stores/comments'
import { useAuth } from '../stores/auth'
import { getStaffReplies } from '../stores/staffReplies'

const route = useRoute()
const { reviewList } = useReviews()
const { getComments, addComment, removeComment } = useComments()
const { isAdmin, adminUser } = useAuth()

const reviewId = computed(() => Number(route.params.id))
const review = computed(() => reviewList.value.find(r => r.id === reviewId.value))

const staffList = computed(() =>
  getStaffReplies(reviewId.value).map((r, idx) => ({
    id: `staff-${reviewId.value}-${idx}`,
    name: r.name,
    role: r.role,
    content: r.content,
    date: r.date,
    avatar: r.name === '신선호'
      ? '/images/managers/Shin Seon-ho CEO.png'
      : r.name === '강재원'
        ? '/images/managers/Kang Jae-won Director.jpg'
        : '',
    isStaff: true,
  }))
)

const userList = computed(() => getComments(reviewId.value).map(c => ({ ...c, isStaff: !!c.isStaff })))

const allComments = computed(() =>
  [...staffList.value, ...userList.value].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const form = ref({ name: '', content: '' })
const canSubmit = computed(() => {
  if (!form.value.content.trim()) return false
  if (isAdmin.value && adminUser.value?.avatar) return true
  return !!form.value.name.trim()
})

function onSubmit() {
  if (!canSubmit.value) return
  const payload = isAdmin.value && adminUser.value?.avatar
    ? {
        name: adminUser.value.name,
        role: adminUser.value.role || '',
        avatar: adminUser.value.avatar,
        isStaff: true,
        content: form.value.content,
      }
    : {
        name: form.value.name,
        content: form.value.content,
      }
  addComment(reviewId.value, payload)
  form.value.content = ''
  if (!isAdmin.value) form.value.name = ''
}

function onRemove(id) {
  if (!confirm('이 댓글을 삭제하시겠습니까?')) return
  removeComment(reviewId.value, id)
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}시간 전`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}일 전`
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}
</script>

<style scoped>
.container { max-width: 720px; margin: 0 auto; padding: 0 20px; }
.page { padding: 32px 0 60px; }
.back { font-size: 13px; color: #999; text-decoration: none; display: inline-block; margin-bottom: 20px; }
.back:hover { color: #111; }
.article-head { margin-bottom: 32px; }
.article-stars { margin-bottom: 8px; }
.sf { font-size: 15px; color: #111; }
.se { font-size: 15px; color: #ddd; }
.article-head h1 { font-size: 1.6rem; font-weight: 800; color: #111; line-height: 1.4; margin: 0 0 14px; }
.article-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #999; margin-bottom: 12px; }
.author-avatar { width: 28px; height: 28px; border-radius: 50%; background: #111; color: white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
.author-name { font-weight: 600; color: #444; }
.meta-dot { color: #ddd; }
.article-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.article-tags span { font-size: 11px; font-weight: 600; padding: 4px 10px; background: #f5f5f5; border-radius: 4px; color: #888; }
.article-body { }
.block-text { font-size: 15px; color: #444; line-height: 1.8; margin: 0 0 24px; word-break: keep-all; }
.block-figure { margin: 0 0 24px; }
.block-figure img { width: 100%; border-radius: 10px; }
.block-figure figcaption { font-size: 12px; color: #bbb; text-align: center; margin-top: 8px; }
.empty { text-align: center; color: #ccc; padding: 60px 0; }

/* 댓글 */
.comments {
  margin-top: 48px; padding-top: 32px;
  border-top: 1px solid #eee;
}
.comments-title {
  font-size: 16px; font-weight: 800; color: #111;
  margin: 0 0 18px; display: flex; align-items: center; gap: 6px;
}
.comments-count {
  font-size: 14px; font-weight: 700; color: #4d8ef7;
}

.comment-list { list-style: none; padding: 0; margin: 0 0 28px; }
.comment-item {
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}
.comment-item:last-child { border-bottom: none; }
.comment-item.is-staff {
  background: linear-gradient(180deg, #f8fafc, #ffffff);
  border-left: 3px solid #111;
  padding-left: 14px; padding-right: 14px;
  border-radius: 8px;
  border-bottom: 1px solid #eef2f7;
  margin-bottom: 4px;
}
.comment-item.is-staff + .comment-item.is-staff { margin-top: -4px; }

.comment-head {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 6px;
}
.comment-avatar {
  width: 30px; height: 30px; border-radius: 50%;
  background: #f0f0f0; color: #666;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  flex-shrink: 0; overflow: hidden;
}
.comment-avatar.has-img { background: transparent; }
.comment-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.comment-name-wrap { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.comment-name { font-size: 13px; font-weight: 700; color: #333; }
.comment-role { font-weight: 500; color: #666; font-size: 12px; }
.comment-badge {
  font-size: 10px; font-weight: 800;
  padding: 2px 7px; background: #111; color: white;
  border-radius: 4px; letter-spacing: 0.3px;
}
.comment-date { font-size: 11.5px; color: #bbb; margin-left: 2px; }
.comment-del {
  margin-left: auto; font-size: 11px; color: #d00;
  background: none; border: none; cursor: pointer; padding: 2px 6px;
}
.comment-del:hover { text-decoration: underline; }
.comment-text {
  font-size: 14px; color: #444; line-height: 1.7;
  margin: 0 0 0 38px; word-break: keep-all; white-space: pre-wrap;
}
.is-staff .comment-text { color: #222; }
.comment-empty {
  font-size: 13px; color: #bbb; text-align: center;
  padding: 20px 0; margin: 0 0 24px;
}

.comment-form {
  background: #fafafa; border-radius: 10px; padding: 14px;
}
.as-admin-row {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 10px;
  padding: 6px 10px; background: white;
  border: 1px solid #e5e5e5; border-radius: 6px;
}
.as-admin-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  object-fit: cover; object-position: center top;
}
.as-admin-text { font-size: 12.5px; font-weight: 700; color: #111; }
.comment-name-input {
  width: 140px; padding: 8px 10px;
  border: 1px solid #e5e5e5; border-radius: 6px;
  font-size: 12.5px; color: #111; outline: none;
  margin-bottom: 8px; background: white;
}
.comment-name-input:focus { border-color: #111; }
.comment-content-row { display: flex; gap: 8px; align-items: stretch; }
.comment-content-input {
  flex: 1; padding: 10px 12px;
  border: 1px solid #e5e5e5; border-radius: 6px;
  font-size: 13px; color: #333; line-height: 1.6;
  outline: none; resize: vertical; font-family: inherit;
  background: white;
}
.comment-content-input:focus { border-color: #111; }
.comment-submit {
  padding: 0 18px; background: #111; color: white;
  border: none; border-radius: 6px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background 0.15s; white-space: nowrap;
}
.comment-submit:hover { background: #333; }
.comment-submit:disabled { background: #ccc; cursor: not-allowed; }

@media (max-width: 600px) {
  .comment-content-row { flex-direction: column; }
  .comment-submit { padding: 10px; }
}
</style>
