<script lang="ts" setup>
interface Props {
  visible: boolean;
  title: string;
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: "",
  width: 400,
  height: 300,
});

const emits = defineEmits(["update:visible", "close"]);

const show = computed({
  get: () => {
    return props.visible;
  },
  set: (value) => {
    emits("update:visible", value);
  },
});
</script>

<template>
  <a-modal
    v-model:visible="show"
    :title="title"
    cancel-text="取消"
    ok-text="确定"
    v-bind="$attrs"
  >
    <template v-for="(_, key, index) in $slots" :key="index" #[key]>
      <slot :name="key" />
    </template>
  </a-modal>
</template>
