import { useRouter } from '#app'

export const useErpApi = () => {
  const router = useRouter()

  const getSessionSid = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem('erpnext_sid')
    }
    return null
  }

  const getSessionUser = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem('erpnext_user')
    }
    return null
  }

  const clearSession = () => {
    if (import.meta.client) {
      localStorage.removeItem('erpnext_sid')
      localStorage.removeItem('erpnext_user')
      router.push('/login')
    }
  }

  const setSession = (sid: string, username: string) => {
    if (import.meta.client) {
      localStorage.setItem('erpnext_sid', sid)
      localStorage.setItem('erpnext_user', username)
    }
  }

  const erpFetch = async <T = any>(endpoint: string, options: any = {}): Promise<T> => {
    // Standardize leading slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const url = `/api/proxy/${cleanEndpoint}`

    // Prepare headers
    const headers = { ...(options.headers || {}) }
    
    // Attach session id if available
    const sid = getSessionSid()
    if (sid) {
      headers['X-ERPNext-Sid'] = sid
    }

    try {
      const response = await $fetch<T>(url, {
        ...options,
        headers,
      })

      // Check if response indicates permission issue
      if (response && (response as any).message === 'Not permitted') {
        clearSession()
        throw new Error('Not permitted')
      }

      return response
    } catch (error: any) {
      // If 403 Forbidden or unauthorized
      if (error.status === 403) {
        clearSession()
      }
      throw error
    }
  }

  return {
    erpFetch,
    clearSession,
    setSession,
    getSessionSid,
    getSessionUser,
  }
}
