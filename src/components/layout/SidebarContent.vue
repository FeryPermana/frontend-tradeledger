<template>
  <div class="flex h-full flex-col">
    <div class="hidden md:block">
      <div class="flex items-center justify-center">
        <img :src="logo" alt="TradeLedger" class="h-10 w-auto" />
      </div>

      <p class="sidebar-content-tagline mt-3 mb-5 ms-4 text-xs">
        Track. Analyze. Grow.
      </p>
    </div>

    <nav class="flex-1 space-y-1">
      <RouterLink to="/dash/dashboard" class="menu-item" @click="$emit('navigate')">
        <LayoutDashboard class="icon" />
        Dashboard
      </RouterLink>

      <RouterLink to="/dash/accounts" class="menu-item" @click="$emit('navigate')">
        <Wallet class="icon" />
        Accounts
      </RouterLink>

      <RouterLink to="/dash/assets" class="menu-item" @click="$emit('navigate')">
        <Boxes class="icon" />
        Assets
      </RouterLink>

      <RouterLink to="/dash/strategies" class="menu-item" @click="$emit('navigate')">
        <Target class="icon" />
        Strategies
      </RouterLink>

      <RouterLink to="/dash/tags" class="menu-item" @click="$emit('navigate')">
        <Tags class="icon" />
        Tags
      </RouterLink>

      <RouterLink to="/dash/trades" class="menu-item" @click="$emit('navigate')">
        <CandlestickChart class="icon" />
        Trades
      </RouterLink>

      <RouterLink to="/dash/portfolio" class="menu-item" @click="$emit('navigate')">
        <BriefcaseBusiness class="icon" />
        Portfolio
      </RouterLink>

      <RouterLink to="/dash/settings" class="menu-item" @click="$emit('navigate')">
        <Settings class="icon" />
        Settings
      </RouterLink>
    </nav>

    <div class="mt-auto pt-4 border-t border-gray-100/10">
      <a 
        :href="whatsappUrl" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="menu-item whatsapp-btn"
      >
        <MessageCircle class="icon text-emerald-500" />
        <span>Chat Support</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import logo from '@/assets/logo.png'
import {
  LayoutDashboard,
  Wallet,
  Boxes,
  Target,
  Tags,
  CandlestickChart,
  BriefcaseBusiness,
  Settings,
  MessageCircle,
} from 'lucide-vue-next'

defineEmits(['navigate'])

const whatsappConfig = {
  phone: '6285921939896',
  text: 'Hai, saya mau tanya tentang TradeLedger.'
}

const whatsappUrl = computed(() => {
  return `https://wa.me/${whatsappConfig.phone}?text=${encodeURIComponent(whatsappConfig.text)}`
})
</script>

<style scoped>
.sidebar-content-tagline {
  color: var(--sidebar-muted);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  color: var(--sidebar-link-text);
  font-size: 14px;
  transition: all 0.2s ease;
  text-decoration: none; 
}

.menu-item:hover {
  background: var(--sidebar-link-hover-bg);
  color: var(--sidebar-link-hover-text);
}

.router-link-active {
  background: var(--sidebar-link-active-bg);
  color: var(--sidebar-link-active-text);
}

.icon {
  width: 18px;
  height: 18px;
  opacity: 0.8;
}

.whatsapp-btn:hover {
  background: rgba(16, 185, 129, 0.1); 
}
</style>