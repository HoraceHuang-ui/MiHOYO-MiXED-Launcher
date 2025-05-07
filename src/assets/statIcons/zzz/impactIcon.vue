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
        d="m.336.336 4.613 7.688-2.563.768 2.819 1.794-4.613 3.075h7.944c1.506 0 2.923.11 4.079-1.046s1.046-2.573 1.046-4.079V.592c-1.236 1.654-2.164 3.17-3.075 4.613L9.17 2.32 8.024 4.95zm6.919 6.663 2.819 1.793 1.281-1.537c0 1.153.26 2.724-.69 3.507-.949.783-2.443.575-3.41.593l1.537-1.281z"
        style="stroke: none"
      ></path>
    </svg>
  </div>
</template>
