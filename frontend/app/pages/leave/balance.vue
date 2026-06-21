<template>
  <div class="page-container animate-fade">
    <div class="glass-panel page-card">
      <div class="page-header">
        <h1 class="page-title">My Leave Balance</h1>
        <p class="page-subtitle">Leave / Balances</p>
      </div>
      <div class="page-body">
        <div class="placeholder-content">
          <svg class="placeholder-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <p>This page is currently empty. Module integration is in progress.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-card {
  padding: 40px;
}

.page-header {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-glass);
  padding-bottom: 20px;
}

.page-title {
  font-size: 28px;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.page-body {
  padding: 40px 0;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-muted);
  gap: 16px;
}

.placeholder-icon {
  stroke: var(--accent-gold);
  opacity: 0.8;
}

.animate-fade {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
