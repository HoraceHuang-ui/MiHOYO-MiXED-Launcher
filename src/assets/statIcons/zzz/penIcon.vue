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
        d="M9.388.105 6.81 2.795.47.56l2.382 6.2L.195 9.38l9.646.275Zm1.558 3.289.134 2.833c.428.6.66 1.318.66 2.056a3.547 3.547 0 0 1-3.547 3.547 3.55 3.55 0 0 1-2.33-.875l-2.641-.076a5.61 5.61 0 0 0 4.971 3.016 5.612 5.612 0 0 0 2.753-10.5Z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
