<script lang="ts" setup>
import useTime from "@/hooks/useTime";

interface Props {
  onBack?: (() => void) | null;
}

const props = withDefaults(defineProps<Props>(), {
  onBack: null,
});
const router = useRouter();
const { resetOperationTimeoutCountdown } = useTime();

function handleBack() {
  if (props.onBack) {
    props.onBack();
  } else {
    resetOperationTimeoutCountdown();
    router.go(-1);
  }
}
</script>

<template>
  <BaseIcon icon="fanhui" class="icon-button z-10" @click="handleBack" />
</template>
