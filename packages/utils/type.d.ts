import type { electronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: electronAPI
  }
}
