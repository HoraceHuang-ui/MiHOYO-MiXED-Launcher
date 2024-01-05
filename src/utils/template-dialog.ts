import type {Component} from 'vue'
import {createApp, nextTick, ref} from 'vue'

export function useDialog(component: Component, props: Record<string, any> = {}) {
    const app = createApp(component, props)
    const dom = document.createElement('div')

    function unmount() {
        app.unmount()
        document.body.removeChild(dom)
    }

    const show = ref(false)
    app.provide('app/showDialog', show)
    app.provide('app/unmountDialog', unmount)
    app.mount(dom)
    document.body.appendChild(dom)
    nextTick(() => {
        show.value = true
    })

    function hide() {
        show.value = false
        setTimeout(unmount, 350)
    }

    return {
        hide
    }
}
