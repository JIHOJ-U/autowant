import { ref, watch } from 'vue'

const STORAGE_KEY = 'autowant_review_comments'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const commentsByReview = ref(load())

watch(commentsByReview, (v) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch {}
}, { deep: true })

export function useComments() {
  function getComments(reviewId) {
    return commentsByReview.value[reviewId] || []
  }

  function addComment(reviewId, { name, content }) {
    const list = commentsByReview.value[reviewId] || []
    const comment = {
      id: Date.now() + Math.random(),
      name: name.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
    }
    commentsByReview.value = {
      ...commentsByReview.value,
      [reviewId]: [...list, comment],
    }
    return comment
  }

  function removeComment(reviewId, commentId) {
    const list = commentsByReview.value[reviewId] || []
    commentsByReview.value = {
      ...commentsByReview.value,
      [reviewId]: list.filter(c => c.id !== commentId),
    }
  }

  function commentCount(reviewId) {
    return (commentsByReview.value[reviewId] || []).length
  }

  return { getComments, addComment, removeComment, commentCount }
}
