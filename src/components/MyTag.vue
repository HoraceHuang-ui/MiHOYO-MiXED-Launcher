<script setup lang="ts">
defineProps({
    bgColor: {
        type: String,
        default: 'ECF5FF'
    },
    fgColor: {
        type: String,
        default: '409EFF'
    }
})
</script>

<template>
    <div
        class="rounded-full border-red-600 bg-red-100 text-red-600 text-sm py-1.5 px-2.5 backdrop-blur-sm"
        :style="{backgroundColor: `#${bgColor}CC`, color: `#${fgColor}`}"
    >
        <slot/>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
