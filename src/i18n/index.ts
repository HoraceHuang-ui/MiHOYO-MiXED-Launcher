import { createI18n } from 'vue-i18n'
import zhCN from './zh_CN.json'
import enUS from './en_US.json'
import zhTW from './zh_TW.json'
import ruRU from './ru_RU.json'
import jaJP from './ja_JP.json'
import frFR from './fr_FR.json'

type MessageSchema = typeof enUS
type lang = 'en_US' | 'zh_CN' | 'zh_TW' | 'ru_RU' | 'ja_JP' | 'fr_FR'

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
    'ru_RU': ruRU,
    'ja_JP': jaJP,
    'fr_FR': frFR
  },
})

export default i18n

export const availableLangCodes = ['en_US', 'zh_CN', 'zh_TW', 'ru_RU', 'ja_JP', 'fr_FR']
export const availableLangNames = ['English', '简体中文', '繁體中文', 'Pусский', '日本語', 'Français']

export const currentLocale = () => {
  return i18n.global.locale
}

export const translate = (key: string, bindings?: any, locale?: string) => {
    if (!key) {
        return ''
    }
    return i18n.global.t(key, locale ? locale : i18n.global.locale, bindings)
}

export const switchLang = (language: lang) => {
    localStorage.lang = language
    i18n.global.locale = language
}
