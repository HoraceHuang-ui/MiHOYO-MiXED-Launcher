<script setup>
const props = defineProps({
    fill: typeof 'aaa'
})
</script>

<template>
    <div>
        <svg viewBox="0 0 14 14">
            <path :fill="props.fill"
                d="M14 0 7.256 3.5 1.973 1.465 3.5 6.236 0 14l7.256-3.5 4.771 1.527L10.5 7.256Zm-3.24 3.24L8.88 7.136 9.701 9.7l-2.564-.82-3.898 1.88 1.88-4.17-.82-2.565L7.137 5.12Z">
            </path>
        </svg>
    </div>
</template>
