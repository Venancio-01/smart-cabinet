<script lang="ts" setup>
export interface Props {
  label: string
  value: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '请输入',
  value: '',
})
const emit = defineEmits(['update:value'])
const labelWords = computed(() => {
  return props.label.split('')
})

const inputValue = computed({
  get: () => {
    return props.value
  },
  set: (value) => {
    emit('update:value', value)
  },
})

const inputRef = ref<null | HTMLInputElement>(null)
function focus() {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

defineExpose({
  focus,
})
</script>

<template>
  <div class="form-control">
    <input ref="inputRef" v-model="inputValue" type="password" required>
    <label>
      <span v-for="(item, index) in labelWords" :key="index" :style="{ transitionDelay: `${index * 20}ms` }">{{ item }}</span>
    </label>
  </div>
</template>

<style scoped>
.form-control {
  @apply relative flex justify-center;
}

.form-control input {
  background-color: transparent;
  border: 0;
  border-bottom-width: 2px;
  border-style: solid;
  display: block;
  width: 100%;
  padding: 15px 0;
  font-size: 18px;
  @apply w-full  border-light text-light;
}

.form-control input:focus,
.form-control input:valid {
  outline: 0;
  @apply border-b-light;
}

.form-control label {
  position: absolute;
  top: 15px;
  left: 0;
  pointer-events: none;
}

.form-control label span {
  @apply text-light;
  display: inline-block;
  min-width: 5px;
  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.form-control input:focus + label span,
.form-control input:valid + label span {
  @apply text-light;
  transform: translateY(-30px);
}
</style>
