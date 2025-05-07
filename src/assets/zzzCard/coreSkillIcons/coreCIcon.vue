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
        d="M6.678 3.577c-.308 0-3.167.38-3.188 3.877-.015 2.68 2.218 3.026 2.455 3.026H8.04l.904-1.736H6.133s-.827 0-.836-1.29c-.011-1.382.945-2.272 1.364-2.27.42.003 1.721 0 1.721 0l.43.977 1.532-2.215-.077-.369Z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
