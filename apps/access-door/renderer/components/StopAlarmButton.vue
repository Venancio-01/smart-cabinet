<script lang="ts" setup>
import useRfid from '@/hooks/useRfid'

const { handleSetGPO } = useRfid()
</script>

<template>
  <div class="btn w-[144px] h-[48px] text-normal" @click="() => handleSetGPO(false)">停止报警</div>
</template>
