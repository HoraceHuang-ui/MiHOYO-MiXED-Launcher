<script setup>
const props = defineProps({
    fill: String
})
</script>

<template>
    <div>
        <svg viewBox="0 0 14 14">
            <path :fill="props.fill"
                  d="M14 4.765v4.47a.589.589 0 0 1-.588.589H9.824v3.588a.589.589 0 0 1-.589.588h-4.47a.589.589 0 0 1-.589-.588V9.824H.588A.589.589 0 0 1 0 9.235v-4.47a.589.589 0 0 1 .588-.589h3.588V.588A.589.589 0 0 1 4.765 0h4.47a.589.589 0 0 1 .589.588v3.588h3.588a.589.589 0 0 1 .588.589Z">
            </path>
        </svg>
    </div>
</template>
