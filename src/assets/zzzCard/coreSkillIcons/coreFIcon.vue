<script setup>
const props = defineProps({
  fill: String,
})
</script>

<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <path
        :fill="props.fill"
        d="M5.482 3.67l-2.045 6.903 1.892-.007.63-2.18 2.766.007L9.778 7.12l-.136-.441-2.623.034-.957 1.193.784-2.64h3.546l.733-1.32-.14-.277Z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
