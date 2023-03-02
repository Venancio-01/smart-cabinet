import { create } from 'zustand'

interface Props {
  isLogin: boolean
  changeIsLogin: (value: boolean) => void
}

export const useStore = create<Props>(set => ({
  isLogin: false,
  changeIsLogin: (value: boolean) => set(() => ({ isLogin: value }))
}))
