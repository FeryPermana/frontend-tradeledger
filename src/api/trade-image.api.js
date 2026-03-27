import api from '@/api/axios'

export function fetchTradeImages(tradeId) {
  return api.get(`/trades/${tradeId}/images`)
}

export function uploadTradeImage(tradeId, file) {
  const formData = new FormData()
  formData.append('image', file)

  return api.post(`/trades/${tradeId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function deleteTradeImage(imageId) {
  return api.delete(`/trade-images/${imageId}`)
}

export function buildPublicImageUrl(imagePath) {
  if (!imagePath) return ''

  const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const appBaseUrl = rawBaseUrl.replace(/\/api\/?$/, '')

  return `${appBaseUrl}/storage/${imagePath}`
}