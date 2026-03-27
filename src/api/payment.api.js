import api from '@/api/axios'

export default {
    getMyPayments() {
        return api.get('/payments')
    },

    submitPayment(formData) {
        return api.post('/payments', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },

    getAdminPayments(params = {}) {
        return api.get('/admin/payments', { params })
    },

    approvePayment(id) {
        return api.post(`/admin/payments/${id}/approve`)
    },

    rejectPayment(id, payload = {}) {
        return api.post(`/admin/payments/${id}/reject`, payload)
    },
}