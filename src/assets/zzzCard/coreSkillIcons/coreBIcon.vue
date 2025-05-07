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
        d="M4.893 3.408l-1.991 6.84h5.304s1.422-.796 1.639-1.741c.229-.998-.193-1.435-.193-1.435s.972-.674 1.157-2.157-.323-1.507-.323-1.507zm1.263 1.56h2.797s.133.417.048.597c-.142.303-.82.58-.82.58l-1.69.022c0 .581-1.058 1.278-1.058 1.278zm-.771 2.767h2.797s.123.243.096.41-.314.506-.314.506H5.216Z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
