import api from '@/api/axios'

export function fetchPortfolioPositions(params = {}) {
  return api.get('/portfolio-positions', { params })
}

export function fetchPortfolioPosition(id) {
  return api.get(`/portfolio-positions/${id}`)
}

export function fetchPortfolioSummary(params = {}) {
  return api.get('/portfolio-summary', { params })
}

export function createPortfolioPosition(payload) {
  return api.post('/portfolio-positions', payload)
}

export function updatePortfolioPosition(id, payload) {
  return api.put(`/portfolio-positions/${id}`, payload)
}

export function deletePortfolioPosition(id) {
  return api.delete(`/portfolio-positions/${id}`)
}

export function fetchPortfolioAllocation(params = {}) {
  return api.get('/portfolio-allocation', { params })
}

export function partialClosePortfolio(id, payload) {
  return api.post(`/portfolio-positions/${id}/partial-close`, payload)
}