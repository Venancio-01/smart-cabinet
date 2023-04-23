import { ConfigProvider } from 'ant-design-vue'
import themeConfig from '@/design/theme.json'

export const setAntdConfig = () => {
  ConfigProvider.config({
    theme: {
      primaryColor: themeConfig.primary
    }
  })
}
