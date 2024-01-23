import {ref} from 'vue'

export function useTimeout(callback: Function, time: number) {
    const timer = ref<NodeJS.Timer | number | undefined>()

    function clear() {
        if (timer.value) {
            clearTimeout(timer.value as number)
            timer.value = undefined
        }
    }

    function start() {
        clear()
        timer.value = setTimeout(() => {
            clear()
            callback()
        }, time)
    }

    return {
        timer,
        start,
        clear,
    }
}
