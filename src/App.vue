<template>
  <RouterView />
  <Toaster position="top-right" richColors expand :duration="3000" />
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.store'
import { syncThemeWithRoute } from './utils/theme'

const authStore = useAuthStore()
const route = useRoute()

onMounted(async () => {
  syncThemeWithRoute(route.path)

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch (error) {
      await authStore.logout()
    }
  }
})

watch(
  () => route.path,
  (newPath) => {
    syncThemeWithRoute(newPath)
  },
  { immediate: true }
)
</script>