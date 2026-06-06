const BASE_URL = import.meta.env.VITE_API_URL

function getToken() {
  return localStorage.getItem('access_token')
}

// Single in-flight refresh promise shared across all concurrent 401s
let refreshPromise = null

async function attemptRefresh() {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) throw new Error('No refresh token')

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!res.ok) throw new Error('Refresh failed')

    const data = await res.json()
    localStorage.setItem('access_token',  data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
    return data.access_token
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

function clearAndRedirect() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  window.location.href = '/'
}

async function request(method, path, body = null, requiresAuth = true) {
  const headers = { 'Content-Type': 'application/json' }

  if (requiresAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const config = { method, headers }
  if (body) config.body = JSON.stringify(body)

  let response = await fetch(`${BASE_URL}${path}`, config)

  // On 401, try one token refresh then retry the original request
  if (response.status === 401 && requiresAuth) {
    try {
      const newToken = await attemptRefresh()
      const retryHeaders = { ...headers, 'Authorization': `Bearer ${newToken}` }
      response = await fetch(`${BASE_URL}${path}`, { ...config, headers: retryHeaders })
    } catch {
      clearAndRedirect()
      return
    }
  }

  // Some endpoints return no body (204) — handle gracefully
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.detail || 'Something went wrong')
  }

  return data
}

export const api = {
  get:      (path)       => request('GET',    path),
  post:     (path, body) => request('POST',   path, body, false),
  postAuth: (path, body) => request('POST',   path, body, true),
  patch:    (path, body) => request('PATCH',  path, body),
  delete:   (path)       => request('DELETE', path),
}
