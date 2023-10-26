import { createI18n } from 'vue-i18n'
import zhCN from './zh_CN.json'
import enUS from './en_US.json'
import zhTW from './zh_TW.json'
import jaJP from './ja_JP.json'

type MessageSchema = typeof enUS
type lang = 'en_US' | 'zh_CN' | 'zh_TW' | 'ja_JP'

const i18n = createI18n<[MessageSchema], lang>({
  // default locale
  locale: localStorage.lang ? localStorage.lang : 'en_US',
  fallbackLocale: 'en_US',
  legacy: false,
  globalInjection: true,
  // translations
  messages: {
    "en_US": enUS,
    'zh_CN': zhCN,
    'zh_TW': zhTW,
    'ja_JP': jaJP,
  },
})

export default i18n

export const availableLangCodes = ['en_US', 'zh_CN', 'zh_TW', 'ja_JP']
export const availableLangNames = ['English', '简体中文', '繁體中文', '日本語']

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
