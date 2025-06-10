<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  fill: String,
})

// 生成唯一ID
const uniqueId = ref('')

onMounted(() => {
  // 使用时间戳和随机数生成唯一ID
  uniqueId.value = `uid-${Date.now()}-${Math.floor(Math.random() * 10000)}`
})
</script>

<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
      <defs>
        <linearGradient id="zzz-AddedDamageRatio_AuricEther__a">
          <stop offset="0" style="stop-color: #f3d299; stop-opacity: 1"></stop>
          <stop offset=".5" style="stop-color: #b7822c; stop-opacity: 1"></stop>
          <stop offset="1" style="stop-color: #ffcd77; stop-opacity: 1"></stop>
        </linearGradient>
        <linearGradient
          xlink:href="#zzz-AddedDamageRatio_AuricEther__a"
          id="zzz-AddedDamageRatio_AuricEther__b"
          x1="15.915"
          x2="22.39"
          y1="2.392"
          y2="8.867"
          gradientTransform="translate(-12.386 1.207)"
          gradientUnits="userSpaceOnUse"
        ></linearGradient>
      </defs>
      <path
        d="M7.161 0S5.305 2.79 4.128 3.967c-.254.253-.59.54-.948.831l.076.063c2.105 1.177 3.63 2.942 5.05 4.666l-1.253 1.621L5.95 9.585l.784-.833c-.02-.198-.513-.735-1.148-1.326-.508.47-1.474 1.312-2.384 1.795.35.284.677.564.925.812C5.305 11.21 7.033 14 7.033 14c1.162-1.719 2.064-3.582 3.957-4.78-.533-.283-1.803-1.212-2.619-2.22l-1.21-1.322-1.21-1.287 1.268-1.588L8.294 4.32l-.91.955 1.205 1.308c.536-.69 1.92-1.806 2.41-1.904C9.69 3.6 8.389 2.143 7.16 0m-4.1 5.344S1.154 7 .652 7c.5 0 2.41 1.656 2.41 1.656l1.369-.898-1.04-.595v-.327l1.04-.594Zm7.878 0-1.37.898 1.04.594v.327l-1.04.595 1.37.898S12.904 7 13.348 7c-.444 0-2.41-1.656-2.41-1.656"
        style="
          opacity: 1;
          fill: url(#zzz-AddedDamageRatio_AuricEther__b);
          stroke-linecap: square;
          stroke-dashoffset: 3.77952;
        "
      ></path>
    </svg>
  </div>
</template>
