import api from '@/api/axios'

export function fetchTags(params = {}) {
  return api.get('/tags', { params })
}

export function createTag(payload) {
  return api.post('/tags', payload)
}

export function deleteTag(id) {
  return api.delete(`/tags/${id}`)
}