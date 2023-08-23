<script setup>
const props = defineProps({
    name: String,
    val: String
})
</script>

<template>
    <div class="flex flex-row justify-between my-1">
        <div class="font-normal font-sans">{{ props.name }}</div>
        <div>{{ props.val }}</div>
        <slot></slot>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
