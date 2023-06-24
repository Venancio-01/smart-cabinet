<script lang="ts" setup>
import VIcon from './VIcon.vue'

interface Props {
  recordCount?: number
  recordVisible?: boolean
  warnVisible?: boolean
  rfidVisible?: boolean
  networkVisible?: boolean
  lockControlVisible?: boolean
}

withDefaults(defineProps<Props>(), {
  recordCount: 0,
  recordVisible: true,
  warnVisible: true,
  rfidVisible: true,
  networkVisible: true,
  lockControlVisible: true,
})

const emits = defineEmits(['onClickRecord', 'onClickWarn', 'onClickRFID', 'onClickNetwork', 'onClickLock'])
</script>

<template>
  <div>
    <div class="flex h-[50px] items-center justify-end gap-4">
      <div v-show="recordVisible" class="flex items-center justify-center">
        <a-badge :count="recordCount">
          <VIcon icon="record" class="text-5xl text-light" @click="emits('onClickRecord')" />
        </a-badge>
      </div>

      <div v-show="warnVisible" class="flex items-center justify-center">
        <VIcon icon="warn" class="text-4xl text-error-color" @click="emits('onClickWarn')" />
      </div>

      <div v-show="!rfidVisible" class="flex items-center justify-center">
        <VIcon icon="RFID" class="text-5xl text-error-color" @click="emits('onClickRFID')" />
      </div>

      <div v-show="!networkVisible" class="flex items-center justify-center">
        <VIcon icon="network" class="text-5xl text-error-color" @click="emits('onClickNetwork')" />
      </div>

      <div v-show="!lockControlVisible" class="flex items-center justify-center">
        <VIcon icon="lock" class="text-4xl text-error" @click="emits('onClickLock')" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.state-display-area svg {
  @apply mx-2 select-none;
  -webkit-user-drag: none;
}

.card {
  border-radius: 30px;
  background: rgba(250, 250, 250, 0.5);
  box-shadow: 15px 15px 30px #bebebe, -15px -15px 30px #ffffff;
}
</style>
