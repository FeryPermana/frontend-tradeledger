<template>
  <div class="app-shell flex h-screen w-full overflow-hidden">
    <Sidebar />

    <div class="flex min-w-0 flex-1 flex-col">
      <HeaderBar />

      <main
        class="app-shell-main flex-1 w-full overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Sidebar from './Sidebar.vue'
import HeaderBar from './HeaderBar.vue'
</script>

<style scoped>
.app-shell {
  background: var(--app-shell-bg);
  color: var(--app-shell-text);
}

.app-shell-main {
  background: var(--app-shell-main-bg);
}
</style>