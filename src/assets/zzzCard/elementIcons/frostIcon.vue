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
        <linearGradient id="zzz-AddedDamageRatio_FireFrost__a">
          <stop offset="0" style="stop-color: #28fbff; stop-opacity: 1"></stop>
          <stop
            offset=".228"
            style="stop-color: #21f8f8; stop-opacity: 1"
          ></stop>
          <stop offset=".5" style="stop-color: #3cd6f1; stop-opacity: 1"></stop>
          <stop
            offset=".792"
            style="stop-color: #73a2ff; stop-opacity: 1"
          ></stop>
          <stop offset="1" style="stop-color: #75a3ff; stop-opacity: 1"></stop>
        </linearGradient>
        <linearGradient
          xlink:href="#zzz-AddedDamageRatio_FireFrost__a"
          id="zzz-AddedDamageRatio_FireFrost__b"
          x1="10.74"
          x2="3.26"
          y1="1.242"
          y2="12.758"
          gradientUnits="userSpaceOnUse"
        ></linearGradient>
      </defs>
      <path
        d="M7.021 0c-.111 0-.5 1.435-1.35 2.226-.034.032-.003.122-.003.14.547.278 1.03.663 1.35 1.143.319-.575.773-.936 1.31-1.174 0 0 .037-.114 0-.146C7.519 1.482 7.133 0 7.022 0M.134 2.047c.109.24.306.355.481.547.209.227.39.518.537.79.382.708.54 1.53 1.01 2.187.836 1.163 2.65 1.723 3.987 1.094l-.42-.492-.613-.845c.616.25 1.324.927 1.878.921.634-.006 1.227-.68 1.829-.921a2.13 2.13 0 0 1-.608.898c-.105.09-.477.395-.477.395s.12.202.963.224c.779.045 1.805-.01 2.43-.55.87-.75 1.08-1.707 1.596-2.669.177-.33.365-.675.614-.958.172-.196.384-.342.525-.56-.302-.11-.722-.008-1.033.069-.777.192-1.392.431-2.066.876-.186.122-.687.46-.763.027-.052-.302.423-.585.52-.851-1.685.168-3.087.431-3.528 2.286-.218-1.452-2.124-2.354-3.58-2.286.155.245.858.66.516 1.013-.24.247-.735-.235-.942-.355-.881-.508-1.826-.836-2.856-.84m4.614 5.052c-.642.01-1.289.143-1.758.447-.338.218-.686.612-.912.941-.425.622-.57 1.405-.926 2.066a4 4 0 0 1-.598.85c-.163.17-.336.261-.42.487a5.53 5.53 0 0 0 2.917-.87c.183-.118.684-.53.872-.278.233.314-.31.67-.386.966 1.381-.07 3.041-.512 3.341-2.066.368.25.434.765.735 1.094.551.601 1.362.749 2.121.874.267.044.598.163.85.098-.136-.212-.74-.551-.618-.846.159-.386.594-.057.801.068a7.1 7.1 0 0 0 3.038 1.02c-.175-.478-.7-.874-.957-1.336-.426-.763-.596-1.67-1.134-2.37-.942-1.226-2.606-1.136-3.99-.99l.6.57.499.846-1.276-.743-.593-.223-.622.282-1.276.684.5-.728.593-.67a5 5 0 0 0-1.4-.173m2.204 3.392c-.319.575-.773.936-1.31 1.174 0 0-.038.114-.001.146C6.453 12.518 6.837 14 6.949 14c.11 0 .499-1.435 1.35-2.226.034-.032.003-.122.003-.14-.548-.278-1.03-.663-1.35-1.143"
        style="
          fill: url(#zzz-AddedDamageRatio_FireFrost__b);
          stroke: none;
          stroke-width: 0.229848;
        "
      ></path>
    </svg>
  </div>
</template>
