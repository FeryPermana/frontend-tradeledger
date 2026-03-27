import api from '@/api/axios'

export function fetchStrategies(params = {}) {
  return api.get('/strategies', { params })
}

export function fetchStrategy(id) {
  return api.get(`/strategies/${id}`)
}

export function createStrategy(payload) {
  return api.post('/strategies', payload)
}

export function updateStrategy(id, payload) {
  return api.put(`/strategies/${id}`, payload)
}

export function deleteStrategy(id) {
  return api.delete(`/strategies/${id}`)
}
