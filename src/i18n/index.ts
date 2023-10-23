import { createI18n } from 'vue-i18n'
import zhCN from './zh_CN.json'
import enUS from './en_US.json'

type MessageSchema = typeof enUS
type lang = 'en_US' | 'zh_CN'

const i18n = createI18n<[MessageSchema], lang>({
  // default locale
  locale: localStorage.lang ? localStorage.lang : 'zh_CN',
  fallbackLocale: 'zh_CN',
  legacy: false,
  globalInjection: true,
  // translations
  messages: {
    'zh_CN': zhCN,
    "en_US": enUS,
  },
})

export default i18n

export const availableLangCodes = ['en_US', 'zh_CN']
export const availableLangNames = ['English', '简体中文']

export const currentLocale = () => {
  return i18n.global.locale
}

export const translate = (key: string, locale?: string, bindings?: any) => {
    if (!key) {
        return ''
    }
    return i18n.global.t(key, locale ? locale : i18n.global.locale, bindings)
}

export const switchLang = (language: lang) => {
    localStorage.lang = language
    i18n.global.locale = language
}
