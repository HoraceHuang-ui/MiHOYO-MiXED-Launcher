<script setup lang="ts">
import {onMounted, PropType, ref, watch} from 'vue'
import ScrollWrapper from "./ScrollWrapper.vue";

const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    },
    tabs: {
        type: Array as PropType<String[]>,
        required: true
    }
})
const emit = defineEmits(['update:modelValue'])

const panesWrapper = ref<HTMLDivElement>()
let panes: HTMLCollection

const selectTab = (idx: number) => {
    if (idx == props.modelValue) {
        return
    }
    emit('update:modelValue', idx)
}

const refreshState = () => {
    if (panes) {
        for (let i = 0; i < panes.length; i++) {
            if (i == props.modelValue) {
                continue
            }
            (panes.item(i) as HTMLElement)!!.style.display = 'none'
        }
    }
}

watch(() => props.modelValue, (newId: number, oldId: number) => {
    const newItem = panes.item(newId) as HTMLElement
    const oldItem = panes.item(oldId) as HTMLElement

    if (panes) {
        oldItem!!.style.display = 'none'
        newItem!!.style.display = 'block'
    }
})

onMounted(() => {
    panes = panesWrapper.value!!.children
    refreshState()
})
</script>

<template>
    <div class="p-2">
        <ScrollWrapper show-bar="hover" height="fit-content" class="mt-1">
            <div class="flex flex-row pb-2">
                <div v-for="(tabText, idx) in tabs" class="mx-1 rounded-full px-3 py-0.5 transition-all"
                     :class="idx == modelValue ? 'tab-selected' : 'tab-unselected'" @click="selectTab(idx)">{{
                        tabText
                    }}
                </div>
            </div>
        </ScrollWrapper>
        <div ref="panesWrapper" class="px-2">
            <slot/>
        </div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.tab-selected {
    @apply text-white bg-blue-600 cursor-default;
}

.tab-unselected {
    @apply cursor-pointer hover:bg-blue-100;
}
</style>