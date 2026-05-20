import { api } from './client'

export async function registerUser({ name, email, password }) {
  return api.post('/auth/register', { name, email, password })
}

export async function loginUser({ email, password }) {
  return api.post('/auth/login', { email, password })
}


export async function logoutUser() {
  return api.postAuth('/auth/logout', {})
}

export async function forgotPassword({ email }) {
  return api.post('/auth/forgot-password', { email })
}

export async function resetPassword({ token, new_password }) {
  return api.post('/auth/reset-password', { token, new_password })
}
