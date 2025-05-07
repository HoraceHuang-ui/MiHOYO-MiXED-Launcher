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
        d="M5.22 3.717l-2 6.903h5.158s.888-1.11.94-1.261c.053-.15-.168-.482-.168-.482H5.606l.41-.989H8.74L9.752 6.37h-2.82L5.919 7.455l.868-2.14h3.375l.72-1.256-.172-.342Z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
