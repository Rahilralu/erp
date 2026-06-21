<template>
  <div class="app-layout">
    <!-- Left Sidebar -->
    <aside class="sidebar glass-panel">
      <!-- Header / Logo -->
      <div class="sidebar-header">
        <img src="/logo.png" alt="Cognifyr Logo" class="logo-img" />
        <div class="brand-info">
          <span class="brand-name">Cognifyr</span>
          <span class="brand-sub">Session Portal</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="sidebar-nav">
        <div v-for="(group, gIdx) in navigation" :key="gIdx" class="nav-group">
          <!-- Accordion Toggle Button -->
          <button 
            @click="toggleGroup(group.name)" 
            class="group-toggle"
            :class="{ 'group-active': isGroupActive(group) }"
          >
            <span class="group-icon">
              <!-- Inline SVG Icons depending on group icon name -->
              <svg v-if="group.icon === 'GridIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              <svg v-else-if="group.icon === 'UsersIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <svg v-else-if="group.icon === 'CalendarIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="8" y2="10"></line></svg>
              <svg v-else-if="group.icon === 'FileTextIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <svg v-else-if="group.icon === 'CreditCardIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              <svg v-else-if="group.icon === 'BriefcaseIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              <svg v-else-if="group.icon === 'AwardIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
              <svg v-else-if="group.icon === 'TrendingUpIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              <svg v-else-if="group.icon === 'ActivityIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              <svg v-else-if="group.icon === 'ShieldIcon'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </span>
            <span class="group-title">{{ group.name }}</span>
            <span class="group-caret" :class="{ 'caret-rotated': expandedGroups[group.name] }">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </span>
          </button>

          <!-- Accordion Sub-items -->
          <div 
            class="group-items" 
            :style="{ maxHeight: expandedGroups[group.name] ? `${group.items.length * 40}px` : '0px' }"
          >
            <NuxtLink 
              v-for="(item, iIdx) in group.items" 
              :key="iIdx" 
              :to="item.path" 
              class="nav-item"
              active-class="nav-item-active"
            >
              <span class="nav-bullet"></span>
              <span class="nav-label">{{ item.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer (User info & Logout) -->
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            {{ userInitials }}
          </div>
          <div class="user-details">
            <span class="user-name" :title="username">{{ username }}</span>
            <span class="user-status">Online</span>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn" :disabled="isLoggingOut" title="Log Out">
          <span v-if="isLoggingOut" class="spinner btn-spinner"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from '#app'
import { useErpApi } from '~/composables/useErpApi'

const route = useRoute()
const { erpFetch, clearSession, getSessionSid, getSessionUser } = useErpApi()

const username = ref('Administrator')
const isLoggingOut = ref(false)

const userInitials = computed(() => {
  if (!username.value) return 'U'
  const parts = username.value.split(/[ ._-]+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return username.value.substring(0, 2).toUpperCase()
})

// Navigation menu definition
const navigation = [
  {
    name: 'Dashboard',
    icon: 'GridIcon',
    items: [
      { name: 'Home / Overview', path: '/' }
    ]
  },
  {
    name: 'Employee',
    icon: 'UsersIcon',
    items: [
      { name: 'Employee List', path: '/employee/list' },
      { name: 'Employee Profile / Detail', path: '/employee/profile' },
      { name: 'Add / Edit Employee', path: '/employee/add-edit' }
    ]
  },
  {
    name: 'Attendance',
    icon: 'CalendarIcon',
    items: [
      { name: 'My Attendance', path: '/attendance/my-attendance' },
      { name: 'Mark Attendance', path: '/attendance/mark' },
      { name: 'Attendance Requests', path: '/attendance/requests' },
      { name: 'Shift Assignments', path: '/attendance/shifts' }
    ]
  },
  {
    name: 'Leave',
    icon: 'FileTextIcon',
    items: [
      { name: 'My Leave Balance', path: '/leave/balance' },
      { name: 'Apply for Leave', path: '/leave/apply' },
      { name: 'Leave History', path: '/leave/history' },
      { name: 'Leave Approvals', path: '/leave/approvals' },
      { name: 'Leave Allocation', path: '/leave/allocation' }
    ]
  },
  {
    name: 'Payroll',
    icon: 'CreditCardIcon',
    items: [
      { name: 'My Salary Slips', path: '/payroll/salary-slips' },
      { name: 'Salary Slip Detail', path: '/payroll/salary-slip-detail' },
      { name: 'Payroll Entry', path: '/payroll/entry' }
    ]
  },
  {
    name: 'Recruitment',
    icon: 'BriefcaseIcon',
    items: [
      { name: 'Job Openings', path: '/recruitment/jobs' },
      { name: 'Job Applicants List', path: '/recruitment/applicants' },
      { name: 'Interview Schedule', path: '/recruitment/interviews' }
    ]
  },
  {
    name: 'Onboarding',
    icon: 'AwardIcon',
    items: [
      { name: 'Onboarding Checklist', path: '/onboarding/checklist' },
      { name: 'Offboarding / Separation', path: '/onboarding/offboarding' }
    ]
  },
  {
    name: 'Expenses',
    icon: 'TrendingUpIcon',
    items: [
      { name: 'My Expense Claims', path: '/expenses/my-claims' },
      { name: 'Submit Expense Claim', path: '/expenses/submit' },
      { name: 'Travel Requests', path: '/expenses/travel' }
    ]
  },
  {
    name: 'Performance',
    icon: 'ActivityIcon',
    items: [
      { name: 'My Appraisals', path: '/performance/appraisals' },
      { name: 'Goals / KRA', path: '/performance/goals' },
      { name: 'Employee Feedback', path: '/performance/feedback' }
    ]
  },
  {
    name: 'Admin / HR Settings',
    icon: 'ShieldIcon',
    items: [
      { name: 'Employee Directory', path: '/admin/directory' },
      { name: 'Reports', path: '/admin/reports' },
      { name: 'Settings / HR Settings', path: '/admin/settings' }
    ]
  }
]

// Accordion Expand/Collapse state
const expandedGroups = ref<Record<string, boolean>>({})

// Initialize expand status based on the current active route
const initializeAccordion = () => {
  navigation.forEach(group => {
    const hasActiveChild = group.items.some(item => route.path === item.path)
    if (hasActiveChild || group.name === 'Dashboard') {
      expandedGroups.value[group.name] = true
    } else if (expandedGroups.value[group.name] === undefined) {
      expandedGroups.value[group.name] = false
    }
  })
}

const toggleGroup = (name: string) => {
  expandedGroups.value[name] = !expandedGroups.value[name]
}

const isGroupActive = (group: any) => {
  return group.items.some((item: any) => route.path === item.path)
}

// Watch for route changes to automatically expand containing folder/accordion
watch(() => route.path, () => {
  initializeAccordion()
}, { immediate: true })

onMounted(async () => {
  initializeAccordion()
  const sid = getSessionSid()
  if (sid) {
    username.value = getSessionUser() || 'Administrator'
    try {
      const response = await erpFetch('api/method/frappe.auth.get_logged_user')
      if (response && response.message) {
        username.value = response.message
        if (import.meta.client) {
          localStorage.setItem('erpnext_user', response.message)
        }
      }
    } catch (error) {
      console.error('Failed to validate session user in layout:', error)
    }
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
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
}

/* Sidebar Styling */
.sidebar {
  width: 280px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  border-radius: 0; /* Align perfectly to the left edge */
  border-top: none;
  border-bottom: none;
  border-left: none;
  border-right: 1px solid var(--border-glass);
  background: var(--bg-glass);
  box-shadow: 4px 0 24px rgba(168, 136, 99, 0.04);
  z-index: 50;
  flex-shrink: 0;
}

/* Header */
.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-glass);
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.brand-sub {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

/* Navigation Scroll Area */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Custom Slim Scrollbar for Sidebar */
.sidebar-nav::-webkit-scrollbar {
  width: 5px;
}
.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(168, 136, 99, 0.15);
  border-radius: 10px;
}
.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 136, 99, 0.3);
}

/* Accordion Toggle */
.group-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  user-select: none;
}

.group-toggle:hover {
  background: rgba(168, 136, 99, 0.06);
  color: var(--text-primary);
}

.group-active {
  color: var(--accent-gold);
}

.group-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  opacity: 0.75;
}

.group-toggle:hover .group-icon,
.group-active .group-icon {
  opacity: 1;
}

.group-title {
  flex: 1;
}

.group-caret {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  opacity: 0.5;
}

.caret-rotated {
  transform: rotate(180deg);
}

/* Sub-items Container */
.group-items {
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}

/* Navigation Items */
.nav-item {
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin: 2px 0;
  border-radius: 6px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 400;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(168, 136, 99, 0.04);
  color: var(--text-primary);
}

.nav-item-active {
  background: rgba(175, 140, 99, 0.08) !important;
  color: var(--accent-gold) !important;
  font-weight: 500;
}

.nav-bullet {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--text-muted);
  margin-right: 10px;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.nav-item:hover .nav-bullet {
  background-color: var(--text-secondary);
  opacity: 1;
}

.nav-item-active .nav-bullet {
  background-color: var(--accent-gold) !important;
  transform: scale(1.5);
  opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-glass);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: rgba(255, 255, 255, 0.3);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  flex: 1;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3d362d;
  color: #FAF9F6;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-glass);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(61, 54, 45, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-status {
  font-size: 11px;
  color: var(--success);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-status::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--success);
}

.logout-btn {
  background: transparent;
  border: 1px solid rgba(168, 136, 99, 0.2);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(198, 40, 40, 0.08);
  border-color: rgba(198, 40, 40, 0.2);
  color: var(--error);
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border-width: 1.5px;
  border-left-color: var(--error);
}

/* Main Content Wrapper */
.main-content {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding: 40px;
}
</style>
