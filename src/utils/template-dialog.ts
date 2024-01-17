import {Component, h, render} from 'vue'

interface essentialProps {
    onOk?: Function,
    onCancel?: Function
}

export function useDialog(component: Component, essentials: essentialProps, props: Record<string, any> = {}) {
    const container = document.createElement('div')
    const dialogVNode = h(
        component,
        {
            ...props,
            onOk: () => {
                essentials && essentials.onOk ? essentials.onOk(dispose) : dispose()
            },
            onCancel: () => {
                essentials && essentials.onCancel ? essentials.onCancel(dispose) : dispose()
            }
        }
    )

    render(dialogVNode, container)
    document.body.appendChild(container)

    const dispose = () => {
        setTimeout(() => {
            render(null, container)
            document.body.removeChild(container)
        }, 500)
    }
}