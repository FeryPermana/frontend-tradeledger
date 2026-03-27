import { toast } from 'vue-sonner'

export const toastService = {
    success(message) {
        toast.success(message)
    },

    error(message) {
        toast.error(message)
    },

    info(message) {
        toast(message)
    },

    warning(message) {
        toast.warning(message)
    },

    loading(message) {
        return toast.loading(message)
    },

    dismiss(id) {
        toast.dismiss(id)
    }
}