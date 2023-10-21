<script setup>
const props = defineProps({
    name: string,
    val: string
})
</script>

<template>
    <div class="flex flex-row justify-between my-1">
        <div class="flex flex-row">
            <div class="w-4 mr-1">
                <slot name="icon"></slot>
            </div>
            <div class="font-normal font-sans">{{ props.name }}</div>
        </div>
        <div>{{ props.val }}</div>
        <slot></slot>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
