<script lang="ts" setup>
import type { PasswordLoginType } from '@/hooks/useLogin'
import useLogin from '@/hooks/useLogin'

const activeKey = ref('1')

const { handlePasswordLogin, handleFingerLogin, handleCardLogin } = useLogin()
function onPasswordLogin(data: PasswordLoginType) {
  handlePasswordLogin(data)
}

function onFingerLogin(userId: number) {
  handleFingerLogin(userId)
}

function onCardLogin(cardNumber: string) {
  handleCardLogin(cardNumber)
}
</script>

<template>
  <BackButton />
  <div class="w-[500px] mt-[30px] mx-auto">
    <a-tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
      <a-tab-pane key="1" tab="账号登录">
        <PasswordAuth class="mt-[80px] h-[300px]" @complete="onPasswordLogin" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="指纹登录">
        <FingerAuth class="pt-[80px] h-[300px]" @complete="onFingerLogin" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="卡号登录">
        <CardAuth class="pt-[80px] h-[300px]" @complete="onCardLogin" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
