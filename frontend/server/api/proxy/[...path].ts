import { defineEventHandler, readRawBody, getHeaders, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const path = event.context.params?.path || ''
  const targetUrl = `${apiBase}/${path}`

  // Get current request headers
  const clientHeaders = getHeaders(event)
  
  // Construct headers for target request
  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
    'accept': clientHeaders['accept'] || '*/*',
  }

  if (clientHeaders['content-type']) {
    headers['content-type'] = clientHeaders['content-type']!
  }

  // Retrieve SID from custom header and attach as Cookie header
  const sid = clientHeaders['x-erpnext-sid']
  if (sid) {
    headers['Cookie'] = `sid=${sid}`
  }

  // Also support reading from request cookies if available
  if (clientHeaders['cookie'] && !headers['Cookie']) {
    headers['cookie'] = clientHeaders['cookie']!
  }

  // Read request body for POST, PUT, PATCH
  let body: any = undefined
  const method = event.node.req.method || 'GET'
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readRawBody(event, 'utf-8').catch(() => undefined)
  }

  try {
    const response = await $fetch.raw(targetUrl, {
      method,
      headers,
      body,
      ignoreResponseError: true
    })

    // Extract set-cookie headers to see if we received a session id (sid)
    const setCookieHeaders = response.headers.getSetCookie()
    let responseSid = ''
    for (const cookieStr of setCookieHeaders) {
      const match = cookieStr.match(/sid=([^;]+)/)
      if (match) {
        responseSid = match[1]
      }
    }

    // Set response status
    event.node.res.statusCode = response.status

    // Set response headers
    for (const [key, val] of response.headers.entries()) {
      if (key !== 'transfer-encoding' && key !== 'content-encoding') {
        setHeader(event, key, val)
      }
    }

    // If we extracted a sid, send it back as a custom header
    if (responseSid) {
      setHeader(event, 'x-erpnext-sid', responseSid)
    }

    let responseData = response._data

    // If the backend returned a JSON string and it wasn't parsed automatically, parse it
    if (typeof responseData === 'string') {
      try {
        responseData = JSON.parse(responseData)
      } catch (e) {
        // Not JSON
      }
    }

    // If it's an object and we found a sid, inject it into the JSON object
    if (responseData && typeof responseData === 'object' && responseSid) {
      responseData = { ...responseData, sid: responseSid }
    }

    return responseData
  } catch (error: any) {
    console.error('Proxy request failed:', error)
    event.node.res.statusCode = error.statusCode || 500
    return {
      error: true,
      message: error.message || 'Internal proxy error'
    }
  }
})
