import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

type MessageSchema = typeof enUS
type lang = 'en-US' | 'zh-CN'

const i18n = createI18n<[MessageSchema], lang>({
  // default locale
  locale: localStorage.getItem('lang') || 'zh-CN',
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

export const translate = (key: string, bindings?: any) => {
    if (!key) {
        return '';
    }
    return i18n.global.t(key, bindings)
}

export const switchLang = (language: lang) => {
    localStorage.setItem('lang', language)
    i18n.global.locale = language
}
