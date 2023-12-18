<script lang="ts" setup></script>

<template>
  <div class="scroll-bar-wrap h-full pr-8px overflow-auto">
    <slot />
  </div>
</template>

<style scoped>
.scroll-bar-wrap {
  --sb-track-color: rgba(255, 255, 255, 0.2);
  --sb-thumb-color: #fafafa;
  --sb-size: 6px;

  scrollbar-color: var(--sb-thumb-color) var(--sb-track-color);
}

.scroll-bar-wrap::-webkit-scrollbar {
  width: var(--sb-size);
}

.scroll-bar-wrap::-webkit-scrollbar-track {
  background: var(--sb-track-color);
  border-radius: 10px;
}

.scroll-bar-wrap::-webkit-scrollbar-thumb {
  background: var(--sb-thumb-color);
  border-radius: 10px;
}
</style>
