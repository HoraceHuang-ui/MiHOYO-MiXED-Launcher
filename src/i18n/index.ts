import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

type MessageSchema = typeof enUS

const i18n = createI18n<[MessageSchema], 'en-US' | 'zh-CN'>({
  // default locale
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  legacy: false,
  globalInjection: true,
  // translations
  messages: {
    'zh-CN': zhCN,
    "en-US": enUS,
  },
})

export default i18n

export const translate = (key: string) => {
    if (!key) {
        return '';
    }
    return i18n.global.t(key)
}
