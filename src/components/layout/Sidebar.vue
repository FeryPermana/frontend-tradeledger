<template>
  <!-- Desktop Sidebar -->
  <aside class="sidebar-desktop hidden w-64 shrink-0 flex-col px-5 py-6 md:flex">
    <SidebarContent />
  </aside>

  <!-- Mobile Overlay -->
  <transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="ui.mobileSidebarOpen" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
      @click="ui.closeMobileSidebar" />
  </transition>

  <!-- Mobile Sidebar -->
  <aside
    class="sidebar-mobile fixed left-0 top-0 z-50 flex h-full w-[88vw] max-w-[320px] flex-col px-5 py-6 shadow-2xl transition-transform duration-300 md:hidden"
    :class="ui.mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'">
    <div class="mb-6 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <img :src="logo" alt="TradeLedger" class="h-10 w-auto" />
        <p class="sidebar-tagline mt-3 text-sm">
          Track. Analyze. Grow.
        </p>
      </div>

      <button type="button"
        class="sidebar-close-btn inline-flex h-10 w-10 items-center justify-center rounded-xl transition"
        @click="ui.closeMobileSidebar">
        ✕
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <SidebarContent @navigate="ui.closeMobileSidebar" />
    </div>
  </aside>
</template>

<script setup>
import logo from '@/assets/logo.png'
import { useUiStore } from '@/stores/ui.store'
import SidebarContent from './SidebarContent.vue'

const ui = useUiStore()
</script>

<style scoped>
.sidebar-desktop,
.sidebar-mobile {
  border-right: 1px solid var(--sidebar-border);
  background: var(--sidebar-bg);
}

.sidebar-tagline {
  color: var(--sidebar-muted);
}

.sidebar-close-btn {
  border: 1px solid var(--sidebar-btn-border);
  background: var(--sidebar-btn-bg);
  color: var(--sidebar-btn-text);
}

.sidebar-close-btn:hover {
  border-color: var(--sidebar-btn-border-hover);
  color: var(--sidebar-btn-text-hover);
}
</style>