<template>
  <div class="page">
    <div class="container">
      <div class="login-card">
        <h2>관리자 로그인</h2>
        <p class="login-sub">관리자 계정으로 로그인해주세요</p>

        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" rounded="lg">{{ error }}</v-alert>

        <v-form ref="form" @submit.prevent="handleLogin">
          <v-text-field
            v-model="id" label="아이디" variant="outlined" density="compact" rounded="lg" class="mb-1"
            :rules="[v => !!v || '아이디를 입력해주세요']"
          />
          <v-text-field
            v-model="password" label="비밀번호"
            :type="showPw ? 'text' : 'password'"
            :append-inner-icon="showPw ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append-inner="showPw = !showPw"
            variant="outlined" density="compact" rounded="lg" class="mb-4"
            :rules="[v => !!v || '비밀번호를 입력해주세요']"
          />
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>
        </v-form>
        <p class="back-link"><router-link to="/">← 홈으로</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { login } = useAuth()
const form = ref(null)
const id = ref('')
const password = ref('')
const showPw = ref(false)
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  const { valid } = await form.value.validate()
  if (!valid) return
  loading.value = true
  error.value = ''
  setTimeout(() => {
    const result = login(id.value, password.value)
    loading.value = false
    if (result.success) router.push('/admin')
    else error.value = result.message
  }, 400)
}
</script>

<style scoped>
.container { max-width: 400px; margin: 0 auto; padding: 0 20px; }
.page { padding: 80px 0; }
.login-card { border: 1px solid #f0f0f0; border-radius: 12px; padding: 32px; }
.login-card h2 { font-size: 1.2rem; font-weight: 800; color: #111; margin: 0 0 4px; }
.login-sub { font-size: 13px; color: #999; margin: 0 0 24px; }
.login-btn {
  width: 100%; padding: 12px; background: #111; color: white; border: none; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.15s;
}
.login-btn:hover { background: #333; }
.login-btn:disabled { background: #ccc; cursor: not-allowed; }
.back-link { text-align: center; margin-top: 16px; }
.back-link a { font-size: 13px; color: #999; text-decoration: none; }
.back-link a:hover { color: #111; }
</style>
