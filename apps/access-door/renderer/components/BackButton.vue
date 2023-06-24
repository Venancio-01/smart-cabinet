<script lang="ts" setup>
import { VIcon } from 'components'

export interface Props {
  onBack?: (() => void) | null
}

const props = withDefaults(defineProps<Props>(), {
  onBack: null,
})
const router = useRouter()

function handleBack() {
  if (props.onBack) props.onBack()
  else router.go(-1)
}
</script>

<template>
  <div class="w-[48px] h-[48px] flex-center-center">
    <VIcon icon="fanhui" class="text-light text-[32px] z-10" @click="handleBack" />
  </div>
</template>
