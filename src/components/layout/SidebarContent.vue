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

    <nav class="space-y-1">
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
  </div>
</template>

<script setup>
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
} from 'lucide-vue-next'

defineEmits(['navigate'])
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
</style>