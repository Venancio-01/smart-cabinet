<script lang="ts" setup>
import useListenEnter from "@/hooks/useListenEnter";
import useEncryption from "@/hooks/useEncryption";
import createAlert from "@/components/BaseAlert";

const router = useRouter();
const { generateRegistrationCode, generateActivationCode, saveActivationCode } =
  useEncryption();
const { addListenEnter, removeListenEnter } = useListenEnter();

const registrationCode = ref("");
const userInputActivationCode = ref("");

async function handleActive() {
  const activationCode = await generateActivationCode();

  console.log(
    "🚀 ~ file: activate.vue:46 ~ handleActive ~ activationCode:",
    activationCode
  );

  if (userInputActivationCode.value === activationCode) {
    saveActivationCode(activationCode);

    createAlert("激活成功");

    router.replace("/index");
  } else {
    createAlert("激活失败");
  }
}

// 使输入框聚焦

const inputEl = ref<null | HTMLInputElement>(null);

function handleFocus() {
  inputEl.value?.focus();
}

const labelWord = "请输入激活码";

const labelWordArr = labelWord.split("");

onMounted(async () => {
  registrationCode.value = await generateRegistrationCode();

  addListenEnter(handleActive);

  nextTick(() => {
    handleFocus();
  });
});

onBeforeMount(() => {
  removeListenEnter(true);
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex justify-center mt-[120px]">
      <BaseIcon icon="activate" class="text-[200px] text-white" />
    </div>

    <div class="w-[500px] text-lg text-white mt-[20px]">
      <span>注册码：</span>
      <span class="select-text">{{ registrationCode }}</span>
    </div>

    <div class="flex justify-center items-center">
      <div class="form-control">
        <input
          ref="inputEl"
          v-model="userInputActivationCode"
          type="password"
          required
        />
        <label>
          <span
            v-for="(item, index) in labelWordArr"
            :key="index"
            :style="{ transitionDelay: `${index * 20}ms` }"
            >{{ item }}</span
          >
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-control {
  @apply my-[40px] w-[500px] flex justify-center;

  position: relative;
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

  font-size: 18px;

  min-width: 5px;

  transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.form-control input:focus + label span,
.form-control input:valid + label span {
  @apply text-light;

  transform: translateY(-30px);
}
</style>
