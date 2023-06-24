<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
})
const prefix = '#icon-'
const iconClassName = computed(() => {
  return prefix + props.icon
})
</script>

<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconClassName" />
  </svg>
</template>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
