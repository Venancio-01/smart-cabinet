<template>
  <button class="blue-gradient text-white bg-center">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup></script>
<style scoped>
button {
  @apply outline-none select-none
}
</style>
