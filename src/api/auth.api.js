import api from '@/api/axios'

export default {
  login(payload) {
    return api.post('/auth/login', payload)
  },

  register(payload) {
    return api.post('/auth/register', payload)
  },

  me() {
    return api.get('/auth/me')
  },

  logout() {
    return api.post('/auth/logout')
  },

  resendVerificationEmail() {
    return api.post('/auth/email/verification-notification')
  },

  planStatus() {
    return api.get('/auth/plan-status')
  },
}