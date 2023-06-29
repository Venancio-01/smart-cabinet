import { ConfigProvider } from 'ant-design-vue'
import Color from '../design/color.json'

export function setAntdConfig() {
  ConfigProvider.config({
    theme: {
      primaryColor: Color.primary,
    },
  })
}
