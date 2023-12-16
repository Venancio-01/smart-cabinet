import path from 'path'
import { session } from 'electron'

export function installVueDevTools() {
  const vueDevToolsPath = path.resolve(__dirname, '../../../../resources/devtools/6.5.1_0')

  return session.defaultSession.loadExtension(vueDevToolsPath)
}
