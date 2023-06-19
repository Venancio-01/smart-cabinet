import dayjs from "dayjs";

export const currentTime = ref<string | null>(null);
const currentTimeTimer = ref<number | null>(null);

/**
 * @description: 生成当前时间
 * @return {*}
 */
export function startGenerateCurrentTime() {
  currentTimeTimer.value = window.setInterval(() => {
    currentTime.value = dayjs().format("HH:mm:ss");
  }, 1000);
}

export function stopGenerateCurrentTime() {
  if (currentTimeTimer.value) clearTimeout(currentTimeTimer.value);
}
