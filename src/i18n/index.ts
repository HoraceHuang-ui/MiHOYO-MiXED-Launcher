import {createI18n} from 'vue-i18n'
import zhCN from './zh_CN.json'
import enUS from './en_US.json'
import zhTW from './zh_TW.json'
import ruRU from './ru_RU.json'
import jaJP from './ja_JP.json'
import frFR from './fr_FR.json'

type MessageSchema = typeof enUS
export type lang = 'en_US' | 'zh_CN' | 'zh_TW' | 'ru_RU' | 'ja_JP' | 'fr_FR'

const i18n = createI18n<[MessageSchema], lang>({
    // default locale
    locale: localStorage.lang ? localStorage.lang : 'en_US',
    fallbackLocale: 'en_US',
    legacy: true,
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

export const translate = (key: string, bindings?: any) => {
    if (!key || key === '') {
        return ''
    }
    return i18n.global.t(key, bindings)
}

export const translateMultiple = (keys: string[]) => {
    let res: string[] = []

    if (!keys || keys.length == 0) {
        return res
    }

    for (let i = 0; i < keys.length; i++) {
        res.push(translate(keys[i]))
    }

    return res
}

export const translateWithLocale = (key: string, locale: lang, bindings?: any) => {
    if (!key) {
        return ''
    }
    return i18n.global.t(key, locale, bindings)
}

export const switchLang = (language: lang) => {
    localStorage.lang = language
    i18n.global.locale = language
}
