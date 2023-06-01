let preFn: (() => void) | null
let curFn: (() => void) | null

export default function () {
  const addListenEnter = (callback: () => void) => {
    if (curFn)
      preFn = curFn

    curFn = callback
  }

  const removeListenEnter = (isRemoveAll?: boolean) => {
    if (isRemoveAll) {
      curFn = null
      preFn = null
    }

    if (preFn)
      curFn = preFn
    else curFn = null
  }

  onMounted(() => {
    document.onkeydown = (event: KeyboardEvent) => {
      if (event.code !== 'Enter')
        return
      if (curFn)
        curFn()
    }
  })

  return {
    addListenEnter,
    removeListenEnter,
  }
}
