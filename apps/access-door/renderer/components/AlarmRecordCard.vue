<script lang="ts" setup>
import dayjs from 'dayjs'
import type { DoorAlarmrecord } from 'database'

export interface Props {
  record: DoorAlarmrecord
  layout?: 'horizontal' | 'vertical'
  size?: 'large' | 'normal' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'horizontal',
  size: 'normal',
})

const layoutClassMap = {
  horizontal: 'grid-cols-2 grid-rows-2',
  vertical: 'grid-cols-1 grid-rows-4',
}

const sizeClassMap = {
  large: 'p-[64px]',
  normal: 'p-[48px]',
  small: 'p-[24px]',
}

const data = computed(() => {
  return [
    {
      name: '设备名称：',
      value: props.record?.equipmentName,
    },
    {
      name: '载体名称：',
      value: props.record?.carrierName,
    },
    {
      name: '所属部门：',
      value: props.record?.carrierDeptName,
    },
    {
      name: '检测时间：',
      value: dayjs(props.record?.createTime).format('MM-DD HH:mm:ss'),
    },
  ]
})
</script>

<template>
  <div class="rounded-[14px] bg-[rgba(255,255,255,0.15)] grid gap-4 h-full" :class="[layoutClassMap[layout], sizeClassMap[size]]">
    <div v-for="(item, index) in data" :key="index" class="text-light text-xl flex-col justify-center">
      <div class="mb-4">
        {{ item.name }}
      </div>
      <div class="t-ellipsis">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>
