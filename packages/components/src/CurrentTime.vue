<script lang="ts" setup>
import dayjs from 'dayjs'
import { onMounted, onUnmounted, ref } from 'vue'

const currentTime = ref<string | null>(null)
const timer = ref<number | null>(null)

function startGenerateCurrentTime() {
  timer.value = window.setInterval(() => {
    currentTime.value = dayjs().format('HH:mm:ss')
  }, 1000)
}

function stopGenerateCurrentTime() {
  if (timer.value) clearTimeout(timer.value)
}

onMounted(() => {
  startGenerateCurrentTime()
})

onUnmounted(() => {
  stopGenerateCurrentTime()
})
</script>

<template>
  <div text="light large" font="thin">{{ currentTime }}</div>
</template>
