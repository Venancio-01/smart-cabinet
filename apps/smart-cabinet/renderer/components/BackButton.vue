<script lang="ts" setup>
import { VIcon } from '@smart-cabinet/components'

interface Props {
  onBack?: (() => void) | null
}

const props = withDefaults(defineProps<Props>(), {
  onBack: null,
})
const router = useRouter()

function handleBack() {
  if (props.onBack) {
    props.onBack()
  }
  else {
    router.go(-1)
  }
}
</script>

<template>
  <VIcon icon="fanhui" class="icon-button z-10" @click="handleBack" />
</template>
