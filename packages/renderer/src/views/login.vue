<template>
  <BackButton></BackButton>
  <div class="w-[500px] mt-[60px] mx-auto">
    <a-tabs v-model:active-key="activeKey">
    <a-tab-pane key="1" tab="账号登录">
      <PasswordAuth class="mt-12 h-[300px]"></PasswordAuth>
    </a-tab-pane>
    <a-tab-pane key="2" tab="指纹登录">
      <FingerAuth class="mt-12 h-[300px]"></FingerAuth>
    </a-tab-pane>
    <a-tab-pane key="3" tab="卡号登录">
      <CardAuth class="mt-12 h-[300px]"></CardAuth>
    </a-tab-pane>
  </a-tabs>
  </div>
</template>

<script lang="ts" setup>

const activeKey = ref('1') 

</script>
<style scoped>

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
  @apply text-light;
}
:deep(.ant-tabs) {
  @apply text-light;
}
:deep(.ant-tabs-tab + .ant-tabs-tab) {
  margin-left: 48px;
}
:deep(.ant-tabs-top > .ant-tabs-nav:before) {
  border-bottom: 1px solid transparent;
}
:deep(.ant-tabs-top > .ant-tabs-nav) {
  margin: 0;
}
:deep(.ant-tabs-tab:hover) {
  @apply text-light;
}

:deep(.ant-tabs-tab-active) {
}

:deep(.ant-tabs-ink-bar) {
  @apply bg-light;
}
:deep(.ant-tabs-tab-btn:active) {
  @apply text-light;
}
</style>