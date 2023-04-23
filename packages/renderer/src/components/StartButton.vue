<template>
  <div class="relative h-[56px] w-[144px]">
    <div id="water-button" class="start-btn">
      <a-button type="primary" class="!h-[56px] !w-[144px] !rounded-lg !font-medium tracking-widest">开始使用</a-button>
    </div>
    <span :class="{ 'water-1': isWaving }"></span>
    <span :class="{ 'water-2': isWaving }"></span>
  </div>
</template>

<script lang="ts" setup>
const isWaving = ref(true)
</script>
<style scoped>
.water-button {
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.start-btn {
  position: absolute;
  width: 144px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  z-index: 5;
  cursor: pointer;
  box-shadow: 0.4rem 0.4rem 0.8rem #c8d0e7, -0.4rem -0.4rem 0.8rem #fff;
}

.water-1,
.water-2 {
  @apply rounded-xl;
  width: 144px;
  height: 56px;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  filter: blur(1px);
}
.water-1 {
  box-shadow: 0.4rem 0.4rem 0.8rem #c8d0e7, -0.4rem -0.4rem 0.8rem #f0f0f0;
  animation: waves 6s linear infinite;
}
.water-2 {
  box-shadow: 0.4rem 0.4rem 0.8rem #c8d0e7, -0.4rem -0.4rem 0.8rem #f0f0f0;
  animation: waves 6s linear 2s infinite;
}
@keyframes waves {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
