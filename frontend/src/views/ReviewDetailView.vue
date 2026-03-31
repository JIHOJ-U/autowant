<template>
  <div class="page" v-if="review">
    <div class="container">
      <router-link to="/" class="back">← 목록으로</router-link>
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
    </div>
  </div>
  <div v-else class="page"><div class="container"><p class="empty">후기를 찾을 수 없습니다</p></div></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReviews } from '../stores/reviews'

const route = useRoute()
const { reviewList } = useReviews()
const review = computed(() => reviewList.value.find(r => r.id === Number(route.params.id)))
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
</style>
