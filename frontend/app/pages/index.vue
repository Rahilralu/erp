<template>
  <div class="dashboard-container">
    <!-- Session Validation Loading Screen -->
    <div v-if="isValidating" class="loading-overlay">
      <div class="spinner-large"></div>
      <p class="loading-text">Verifying secure session...</p>
    </div>

    <!-- Main Dashboard UI -->
    <div v-else class="dashboard-card glass-panel animate-fade">
      <div class="dashboard-header">
        <img src="/logo.png" alt="Cognifyr Logo" class="logo-img-dashboard" />
        <h1 class="dashboard-title">Welcome to Cognifyr</h1>
        <p class="dashboard-subtitle">
          Logged in as: <strong class="user-highlight">{{ username }}</strong>
        </p>
      </div>

      <div class="dashboard-body">
        <div class="status-indicator">
          <span class="pulse-dot"></span>
          <span>Session is Live & Secure</span>
        </div>
        <p class="body-text">
          This is the primary gateway for your Frappe ERP interface. Use the navigation portal to explore different ERP modules.
        </p>
      </div>

      <div class="dashboard-footer">
        <button @click="handleLogout" class="btn-secondary" :disabled="isLoggingOut">
          <span v-if="isLoggingOut" class="spinner"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span>{{ isLoggingOut ? 'Ending session...' : 'Logout' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from '#app'
import { useErpApi } from '~/composables/useErpApi'

const router = useRouter()
const { erpFetch, clearSession, getSessionSid, getSessionUser } = useErpApi()

const username = ref('')
const isValidating = ref(true)
const isLoggingOut = ref(false)

onMounted(async () => {
  const sid = getSessionSid()
  if (!sid) {
    clearSession()
    return
  }

  try {
    // Validate session with the backend
    const response = await erpFetch('api/method/frappe.auth.get_logged_user')
    username.value = response?.message || getSessionUser() || 'Administrator'
    isValidating.value = false
  } catch (error) {
    console.error('Session validation failed:', error)
    clearSession()
  }
})

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await erpFetch('api/method/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout request failed:', error)
  } finally {
    clearSession()
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 3px solid var(--accent-gold-glow);
  border-left-color: var(--accent-gold);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  color: var(--text-secondary);
}

.dashboard-card {
  width: 100%;
  max-width: 480px;
  padding: 40px;
}

.logo-img-dashboard {
  width: 56px;
  height: 56px;
  object-fit: contain;
  margin-bottom: 16px;
  display: block;
}

.dashboard-header {
  margin-bottom: 24px;
}

.dashboard-title {
  font-size: 26px;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.dashboard-subtitle {
  font-size: 15px;
  color: var(--text-secondary);
}

.user-highlight {
  color: var(--accent-gold);
  font-weight: 600;
}

.dashboard-body {
  border-top: 1px solid var(--border-glass);
  border-bottom: 1px solid var(--border-glass);
  padding: 24px 0;
  margin-bottom: 24px;
}

.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.15);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: var(--success);
  margin-bottom: 16px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  animation: pulse 1.6s infinite;
}

.body-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.dashboard-footer {
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  gap: 8px;
}

.animate-fade {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}
</style>
