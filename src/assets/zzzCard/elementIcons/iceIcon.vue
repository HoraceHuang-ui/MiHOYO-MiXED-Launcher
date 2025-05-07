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
          :href="`#zzz-AddedDamageRatio_Ice__a-${uniqueId}`"
          :id="`zzz-AddedDamageRatio_Ice__b-${uniqueId}`"
          x1="12.046"
          x2="12.046"
          y1="318.508"
          y2="331.879"
          gradientTransform="translate(-3.923 -287.884)scale(.9068)"
          gradientUnits="userSpaceOnUse"
        ></linearGradient>
        <linearGradient :id="`zzz-AddedDamageRatio_Ice__a-${uniqueId}`">
          <stop
            offset="0"
            :style="`stop-color: #04c2c8; stop-opacity: 1`"
          ></stop>
          <stop
            offset="1"
            :style="`stop-color: #83f4f0; stop-opacity: 1`"
          ></stop>
        </linearGradient>
      </defs>
      <path
        d="M7 0 5.166 3.824.938 3.5 3.332 7 .938 10.5l4.228-.323L7 14l1.834-3.823 4.228.323L10.668 7l2.394-3.5-4.228.324ZM5.18 5.06a.1.1 0 0 1 .06.015L7 5.99l1.76-.914a.123.123 0 0 1 .166.167l-.914 1.76.914 1.759a.123.123 0 0 1-.166.166L7 8.013l-1.76.914a.123.123 0 0 1-.166-.166L5.988 7l-.914-1.76a.123.123 0 0 1 .106-.18"
        :style="`
          fill: url(#zzz-AddedDamageRatio_Ice__b-${uniqueId});
          stroke-width: 0.906792;
          stroke-linecap: square;
          stroke-dashoffset: 3.77952;
        `"
      ></path>
    </svg>
  </div>
</template>
