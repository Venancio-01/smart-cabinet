<script lang="ts" setup>
import dayjs from 'dayjs'
import { onMounted, onUnmounted, ref } from 'vue'

const currentTime = ref<string>()
const timer = ref<number | null>(null)

function generateCurrentTime() {
  currentTime.value = dayjs().format('HH:mm:ss')
}

function startGenerateCurrentTime() {
  timer.value = window.setInterval(generateCurrentTime, 1000)
}

function stopGenerateCurrentTime() {
  if (timer.value) clearTimeout(timer.value)
}

onMounted(() => {
  generateCurrentTime()
  startGenerateCurrentTime()
})

onUnmounted(() => {
  stopGenerateCurrentTime()
})
</script>

<template>
  <div text="light large" font="thin">
    {{ currentTime }}
  </div>
</template>
