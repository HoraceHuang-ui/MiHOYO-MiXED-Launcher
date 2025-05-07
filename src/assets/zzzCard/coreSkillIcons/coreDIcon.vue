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
        d="M5.321 3.59l-2.025 6.903h3.013s4.714 0 4.677-5.297c-.011-1.53-1.374-1.606-1.374-1.606Zm1.498 1.616h1.784c.157 0 .643.271.062 1.591C7.915 8.5 7.56 8.648 6.326 8.75l-1.06 1.23Z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
