<script lang="ts" setup>
interface Props {
  index: number
  name: string
  inPlaceNumber: number
  misPlaceNumber: number
  totalNumber: number
  departmentName: string
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  name: '柜门',
  inPlaceNumber: 0,
  misPlaceNumber: 0,
  totalNumber: 0,
  departmentName: '',
})

onMounted(() => {
  console.log(props.misPlaceNumber)
})
const hasMisPlace = computed(() => props.misPlaceNumber > 0)
</script>

<template>
  <div class="rounded-md bg-white bg-opacity-20 p-4 text-light">
    <div class="flex justify-between">
      <BaseIcon icon="door" class="text-4xl" :class="[hasMisPlace ? 'text-error' : 'text-white']" />
      <div class="text-sm">
        {{ departmentName }}
      </div>
    </div>

    <div class="pt-4 text-sm flex justify-between">
      <div>
        <span class="mr-2">{{ index + 1 }}.</span>
        <span>{{ name }}</span>
      </div>
      <span>{{ inPlaceNumber }} / {{ totalNumber }}</span>
    </div>
  </div>
</template>
