import api from '@/api/axios'

export function fetchAssets(params = {}) {
  return api.get('/assets', { params })
}

export function fetchAsset(id) {
  return api.get(`/assets/${id}`)
}

export function createAsset(payload) {
  return api.post('/assets', payload)
}

export function updateAsset(id, payload) {
  return api.put(`/assets/${id}`, payload)
}

export function deleteAsset(id) {
  return api.delete(`/assets/${id}`)
}

export function toggleAssetWatchlist(id) {
  return api.patch(`/assets/${id}/toggle-watchlist`)
}

export function updateAssetPrice(id, payload) {
  return api.patch(`/assets/${id}/price`, payload)
}