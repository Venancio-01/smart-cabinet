import { ConfigProvider } from "ant-design-vue";
import themeConfig from "./design/theme.json";

export function setAntdConfig() {
  ConfigProvider.config({
    theme: {
      primaryColor: themeConfig.primary,
    },
  });
}
