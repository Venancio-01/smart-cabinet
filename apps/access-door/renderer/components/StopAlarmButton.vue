<script lang="ts" setup>
import type { DoorEquipment } from '@smart-cabinet/database'
import useRfid from '@/hooks/useRfid'
import { useStore } from '@/store'

interface Props {
  type?: 'single' | 'all'
  equipment?: DoorEquipment
}

const props = withDefaults(defineProps<Props>(), {
  type: 'single',
})

const store = useStore()
const { activeEquipmentList } = storeToRefs(store)
const { handleSetGPO } = useRfid()

function handleClick() {
  if (props.type === 'single') handleSetGPO(props.equipment, false)
  else {
    activeEquipmentList.value.forEach((equipment) => {
      handleSetGPO(equipment, false)
    })
  }
}
</script>

<template>
  <div class="btn w-[144px] h-[48px] text-normal" font="thin" @click="handleClick">
    {{ type === 'single' ? '停止报警' : '停止全部报警' }}
  </div>
</template>
