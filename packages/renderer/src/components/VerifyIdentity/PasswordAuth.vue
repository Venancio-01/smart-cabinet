<template>
  <div class="flex h-full flex-1 items-center">
    <div class="form-item">
      <div class="label">确认密码</div>
      ：
      <input :value="value" @input="$emit('update:value', ($event.target as HTMLInputElement).value)" type="password" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  value: string
}

defineProps<Props>()
defineEmits(['update:value'])
</script>

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

.form-item > div {
  @apply h-[30px] w-full leading-[30px];
}

.form-item input {
  @apply h-[30px] w-full bg-white text-black;
}
.form-item input[type='password'] {
  @apply text-2xl;
}
.form-item + .form-item {
  @apply mt-[16px];
}
</style>
