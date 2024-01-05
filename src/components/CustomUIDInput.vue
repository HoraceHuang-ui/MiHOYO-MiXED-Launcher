<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['submit', 'update:modelValue'])
</script>

<template>
    <div class="flex flex-row rounded-full border border-gray-400 h-10">
        <input class="px-2 rounded-full" :placeholder="$t('uidInput_placeholder')" style="width: 16vw; margin: 1px;"
               :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
               @keyup.native.enter="$emit('submit')"/>
        <button
            class="rounded-full bg-gray-100 px-3 hover:bg-gray-300 active:bg-gray-500 active:scale-90 transition-all"
            style="min-width: 5rem;" @click="$emit('submit')">{{ $t('uidInput_query') }}
        </button>
    </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
