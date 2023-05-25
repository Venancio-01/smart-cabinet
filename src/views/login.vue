<template>
  <BackButton></BackButton>
  <div class="w-[500px] mt-[30px] mx-auto">
    <a-tabs v-model:active-key="activeKey" destroy-inactive-tab-pane>
      <a-tab-pane key="1" tab="账号登录">
        <PasswordAuth class="mt-[80px] h-[300px]" @complete="onPasswordLogin"></PasswordAuth>
      </a-tab-pane>
      <a-tab-pane key="2" tab="指纹登录">
        <FingerAuth class="pt-[80px] h-[300px]" @complete="onFingerLogin"></FingerAuth>
      </a-tab-pane>
      <a-tab-pane key="3" tab="卡号登录">
        <CardAuth class="pt-[80px] h-[300px]" @complete="onCardLogin"></CardAuth>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import useLogin,{PasswordLoginType} from '@/hooks/useLogin';

const activeKey = ref('1') 

const { handlePasswordLogin,handleFingerLogin,handleCardLogin } = useLogin()
const onPasswordLogin = (data:PasswordLoginType)=>{
  handlePasswordLogin(data)
}

const onFingerLogin = (userId: number)=>{
  handleFingerLogin(userId)
}

const onCardLogin = (cardNumber:string)=>{
  handleCardLogin(cardNumber)
}
</script>