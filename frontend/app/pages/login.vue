<template>
  <div class="login-container">
    <div class="login-card glass-panel">
      <div class="login-header">
        <img src="/logo.png" alt="Cognifyr Logo" class="logo-img" />
        <h1 class="login-title">Cognifyr</h1>
        <p class="login-subtitle">Session Portal Integration</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Error Alert -->
        <div v-if="errorMsg" class="alert alert-error animate-fade">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>{{ errorMsg }}</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="form-input"
            placeholder="e.g. Administrator"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="form-input"
            placeholder="e.g. admin"
            :disabled="loading"
          />
        </div>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span>{{ loading ? 'Connecting...' : 'Sign In' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

import { ref } from 'vue'
import { useRouter } from '#app'
import { useErpApi } from '~/composables/useErpApi'

const router = useRouter()
const { erpFetch, setSession, clearSession } = useErpApi()

const username = ref('Administrator')
const password = ref('admin')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true

  const formData = new URLSearchParams()
  formData.append('usr', username.value)
  formData.append('pwd', password.value)

  try {
    // 1. Post to login endpoint
    const response = await $fetch.raw<any>('/api/proxy/api/method/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })

    // On success, extract sid from the response body (injected by proxy) or custom header
    const sid = response._data?.sid || response.headers.get('x-erpnext-sid')
    if (!sid) {
      throw new Error('Authentication succeeded but session ID was not received.')
    }

    // Temporarily save SID so subsequent verification fetch uses it
    setSession(sid, '')

    // 2. Immediately call get_logged_user to confirm session is live and store username
    const userResponse = await erpFetch('api/method/frappe.auth.get_logged_user')
    const loggedInUser = userResponse?.message || username.value

    // 3. Fully update local session storage
    setSession(sid, loggedInUser)

    // 4. Redirect to home page
    router.push('/')
  } catch (err: any) {
    console.error('Login error:', err)
    clearSession()
    if (err.data && err.data.message) {
      errorMsg.value = err.data.message
    } else if (err.message) {
      errorMsg.value = err.message
    } else {
      errorMsg.value = 'Failed to connect. Please check credentials or if Cognifyr is running.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.logo-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin: 0 auto 16px;
  display: block;
}

.login-title {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
}

.w-full {
  width: 100%;
}

.animate-fade {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
