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
        d="M7.214 3.123L2.537 10.03h5.304l.81-1.107.25 1.107h2.122L9.721 3.123Zm.627 2.218.667 2.949h-2.74z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
