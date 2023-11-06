<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['change', 'update:modelValue'])

const valueChange = () => {
    emit('update:modelValue', !props.modelValue)
    emit('change')
}
</script>

<template>
    <div class="rounded-full h-8 w-14 border-2 relative transition-all cursor-pointer" @click="valueChange"
        :class="props.modelValue ? 'bg-blue-500 border-blue-500' : 'bg-white border-blue-200'">
        <div class="rounded-full w-5 h-5 absolute top-1 bottom-1 transition-all"
            :class="props.modelValue ? 'left-7 bg-white' : 'left-1 bg-blue-500'"></div>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
