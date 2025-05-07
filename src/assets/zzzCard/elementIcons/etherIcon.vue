<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  fill: String,
})

// Generate unique ID
const uniqueId = ref('')

onMounted(() => {
  uniqueId.value = `uid-${Date.now()}-${Math.floor(Math.random() * 10000)}`
})
</script>

<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <defs>
        <linearGradient
          :href="`#zzz-AddedDamageRatio_Ether__a-${uniqueId}`"
          :id="`zzz-AddedDamageRatio_Ether__b-${uniqueId}`"
          x1="16.461"
          x2="7.36"
          y1="354.589"
          y2="367.587"
          gradientTransform="translate(-2.93 -294.054)scale(.83374)"
          gradientUnits="userSpaceOnUse"
        ></linearGradient>
        <linearGradient :id="`zzz-AddedDamageRatio_Ether__a-${uniqueId}`">
          <stop offset="0" style="stop-color: #ff0a1a; stop-opacity: 1"></stop>
          <stop
            offset=".171"
            style="stop-color: #ff0626; stop-opacity: 1"
          ></stop>
          <stop offset=".5" style="stop-color: #b338dd; stop-opacity: 1"></stop>
          <stop
            offset=".85"
            style="stop-color: #2a6bea; stop-opacity: 1"
          ></stop>
          <stop offset="1" style="stop-color: #2a6bea; stop-opacity: 1"></stop>
        </linearGradient>
      </defs>
      <path
        d="M6.52 0 5.036 3.715a1.68 1.68 0 0 1-.935.936L.385 6.135l3.716 1.483a1.47 1.47 0 0 1 .866.96L6.52 14l1.553-5.422a1.47 1.47 0 0 1 .866-.96l3.716-1.483L8.94 4.65a1.68 1.68 0 0 1-.935-.936Zm4.568 7.83-.57 1.403a1 1 0 0 1-.554.553l-1.403.57 1.403.57a1 1 0 0 1 .554.554l.57 1.404.57-1.404a1 1 0 0 1 .554-.553l1.403-.57-1.403-.57a1 1 0 0 1-.554-.554Z"
        :style="`
          fill: url(#zzz-AddedDamageRatio_Ether__b-${uniqueId});
          stroke-width: 0.833738;
          stroke-linecap: square;
          stroke-dashoffset: 3.77952;
        `"
      ></path>
    </svg>
  </div>
</template>
