<script lang="ts" setup>
interface Props {
  equipment: ActiveEquipmentProps
}
defineProps<Props>()

const emits = defineEmits(['viewDetail'])

function viewDetail() {
  emits('viewDetail')
}
</script>

<template>
  <div flex="col justify-center" h="500px" text="light 5xl center" font="thin" tracking="10px">
    <div v-if="equipment.readRecordList.length === 0">
      未检测到载体
    </div>

    <div v-else>
      <div>
        {{ `检测到载体数量：${equipment.readRecordList.length}` }}
      </div>
      <div flex="~" justify-center items-center mt-100px>
        <div class="btn btn-lg btn-wide text-normal mt-16" font="thin" @click="viewDetail">
          查看详情
        </div>
      </div>
    </div>
  </div>
</template>
