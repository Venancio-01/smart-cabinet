<template>
  <BaseIcon icon="fanhui" class="icon-button z-10" @click="handleBack"></BaseIcon>
</template>

<script lang="ts" setup>
import useTime from '@/hooks/useTime'
type Props = {
  onBack: (() => void) | null
}

const props = withDefaults(defineProps<Props>(), {
  onBack: null
})
const router = useRouter()
const { resetOperationTimeoutCountdown } = useTime()

const handleBack = () => {
  if (props.onBack) {
    props.onBack()
  } else {
    resetOperationTimeoutCountdown()
    router.go(-1)
  }
}
</script>
