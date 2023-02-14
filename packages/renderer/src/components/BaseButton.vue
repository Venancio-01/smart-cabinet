<template>
  <button class="blue-gradient bg-center text-white">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup></script>
<style scoped>
button {
  @apply select-none outline-none;
}
</style>
