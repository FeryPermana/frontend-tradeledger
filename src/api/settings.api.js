import api from '@/api/axios'

export function fetchMyProfile() {
  return api.get('/auth/me')
}

export function updateMyProfile(payload) {
  return api.put('/auth/profile', payload)
}

export function updateMyPassword(payload) {
  return api.put('/auth/password', payload)
}