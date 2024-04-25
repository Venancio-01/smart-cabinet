<script lang="ts" setup>
import { AccessDirection } from '~/enums'

interface Props {
  equipment: ActiveEquipmentProps
}

const props = defineProps<Props>()

const message = computed(() => {
  return props.equipment.direction === AccessDirection.IN ? '检测到人员进入' : '检测到人员外出'
})
</script>

<template>
  <div flex="col" class="w-h-full">
    <div flex="~" items-center justify-center h="260px" text="light center 6xl" font="thin" tracking="10px">
      {{ message }}
    </div>

    <div flex="~ 1">
      <div w="full" h="full" flex="~" justify-center items-center>
        <BaseLoading />
      </div>
    </div>
  </div>
</template>
