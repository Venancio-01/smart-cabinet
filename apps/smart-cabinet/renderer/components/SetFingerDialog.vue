<script lang="ts" setup>
import { VDialog, VIcon } from '@smart-cabinet/components'
import useFinger from '@/hooks/useFinger'
import { useStore } from '@/store'
import createAlert from '@/components/BaseAlert'

interface Props {
  visible: boolean
  order: 1 | 2
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  order: 1,
})
const emits = defineEmits(['update:visible'])
const store = useStore()
const { user, isFingerConnected } = storeToRefs(store)
const { openFingerDevice, closeFingerDevice, startRegisterFinger, endRegisterFinger, registerResult } = useFinger()

const show = computed({
  get: () => {
    return props.visible
  },
  set: (value) => {
    emits('update:visible', value)
  },
})

const title = computed(() => {
  return props.order === 1 ? '设置指纹一' : '设置指纹二'
})

const message = ref('请按压同一手指3次')

watch(registerResult, (value) => {
  if (value) {
    const msg = value.msg as string
    const data = value.data as any
    if (data && data.alert) {
      createAlert(msg)
      if (data.registerSuccess) endRegisterFinger()

      emits('update:visible', false)
    }
    else {
      message.value = msg
    }
  }
})

const isConnected = ref(false)
watch(show, async (value) => {
  if (value) {
    if (!isFingerConnected.value) {
      message.value = '设备未连接'
      return
    }

    message.value = '请按压同一手指3次'
    await openFingerDevice()
    if (user.value?.userId)
      // @ts-expect-error bigint
      startRegisterFinger(user.value?.userId, props.order)
  }
  else {
    await closeFingerDevice()
    endRegisterFinger()
    message.value = '请按压同一手指3次'
  }
})
</script>

<template>
  <VDialog v-model:visible="show" :title="title" :footer="null" centered>
    <div class="flex pb-20px">
      <div class="flex h-full items-center">
        <VIcon icon="zhiwen" class="text-140px text-white" />
      </div>

      <div class="relative m-4 flex flex-1 select-none items-center justify-center rounded-lg text-white ">
        {{ message }}
      </div>
    </div>
  </VDialog>
</template>

<style scoped>
.form-item {
  @apply flex items-center text-white;
}
.form-item .label {
  @apply h-[30px] w-[120px] text-justify  text-sm leading-[30px];
}
.form-item .label::after {
  content: '';
  display: inline-block;
  padding-left: 100%;
  margin-left: 100%;
}

.form-item input {
  @apply h-[30px] w-full text-black;
}
.form-item input[type='password'] {
  @apply text-2xl;
}
.form-item + .form-item {
  @apply mt-[16px];
}
</style>
