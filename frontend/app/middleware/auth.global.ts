import { defineNuxtRouteMiddleware, navigateTo } from '#app'

export default defineNuxtRouteMiddleware((to, from) => {
  // Only execute auth check on the client-side to have access to localStorage
  if (import.meta.client) {
    const sid = localStorage.getItem('erpnext_sid')

    // If there is no session and the user is navigating to a page other than login, redirect to login
    if (!sid && to.path !== '/login') {
      return navigateTo('/login')
    }

    // If the user has a session and is trying to go to login, redirect back to index
    if (sid && to.path === '/login') {
      return navigateTo('/')
    }
  }
})
