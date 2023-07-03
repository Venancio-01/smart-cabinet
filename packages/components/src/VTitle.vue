<script lang="ts" setup>
interface Props {
  title: string
}

withDefaults(defineProps<Props>(), {
  title: 'Default title',
})
</script>

<template>
  <div class="text-center select-none font-thin tracking-[10px] text-light text-system-title">
    {{ title }}
  </div>
</template>
