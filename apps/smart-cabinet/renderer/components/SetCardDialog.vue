<script lang="ts" setup>
import useListenEnter from "@/hooks/useListenEnter";
import useTime from "@/hooks/useTime";
import AnimationInput from "@/components/AnimationInput.vue";
import createAlert from "@/components/BaseAlert";
import { useStore } from "@/store";

interface Props {
  visible: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
});
const emits = defineEmits(["update:visible"]);
const store = useStore();
const { user } = storeToRefs(store);
const { addListenEnter, removeListenEnter } = useListenEnter();
const { resetOperationTimeoutCountdown } = useTime();

const show = computed({
  get: () => {
    return props.visible;
  },
  set: (value) => {
    emits("update:visible", value);
  },
});

const cardNumber = ref("");

// 使输入框聚焦
const inputRef = ref<InstanceType<typeof AnimationInput>>();
function handleFocus() {
  inputRef.value?.focus();
}

async function handleUpdateCardNumber(cardNumber: string) {
  if (cardNumber === "") {
    createAlert("请输入卡号");
    return false;
  }

  const success = await window.JSBridge.sys.updateCardNumber(
    user.value.userId,
    cardNumber
  );
  const tips = success ? "卡号设置成功" : "卡号设置失败";
  createAlert(tips);

  if (success) emits("update:visible", false);
}

watch(show, (value) => {
  resetOperationTimeoutCountdown();

  if (value) {
    addListenEnter(() => {
      handleUpdateCardNumber(cardNumber.value);
    });
    nextTick(() => {
      handleFocus();
    });
  } else {
    removeListenEnter(true);
    cardNumber.value = "";
  }
});

function onClose() {
  resetOperationTimeoutCountdown();

  cardNumber.value = "";
}
</script>

<template>
  <BaseDialog
    v-model:visible="show"
    title="设置卡号"
    :footer="null"
    centered
    @close="onClose"
  >
    <div class="h-full pb-20px">
      <div class="flex justify-center">
        <BaseIcon icon="card" class="icon-large text-white" />
      </div>
      <div class="flex justify-center items-center">
        <AnimationInput
          ref="inputRef"
          v-model:value="cardNumber"
          class="w-[500px] mt-[10px]"
          label="请刷卡设置卡号"
        />
      </div>
    </div>
  </BaseDialog>
</template>
