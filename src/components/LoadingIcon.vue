<script setup lang="ts">
defineProps({
    colour: {
        type: String,
        default: '#dddddd'
    }
})
</script>

<template>
    <i class="bi bi-arrow-repeat ml-2 text-xl w-9 h-9 text-center icon-loading"
       :style="{color: colour}"
       style="padding-top: 3px;"/>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>