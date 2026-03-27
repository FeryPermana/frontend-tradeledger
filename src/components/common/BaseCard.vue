<template>
  <div class="base-card rounded-2xl p-5">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid var(--surface-card-border);
  background: var(--surface-card-bg);
  box-shadow:
    0 10px 30px rgba(2, 6, 23, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.02);
}
</style>