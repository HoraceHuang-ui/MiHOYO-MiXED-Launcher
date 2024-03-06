<script setup>
const props = defineProps({
  fill: String,
})
</script>

<template>
  <div>
    <svg viewBox="0 0 14 14">
      <path
        :fill="props.fill"
        d="m0 14 3.5-7.764-1.527-4.772L7.255 3.5 14 0l-3.5 7.255 1.527 4.772L7.255 10.5 0 14"
      ></path>
      <path
        :fill="props.fill"
        d="M7.045.19a6.756 6.756 0 0 0-3.326.857l3.613 1.392L10.168.967A6.648 6.648 0 0 0 7.045.189zM1.502 3.073A6.812 6.812 0 0 0 .309 6.947c0 .925.189 1.808.529 2.612l1.601-3.555-.937-2.93zm11.63.998-1.571 3.26 1.076 3.361a6.709 6.709 0 0 0 .496-6.621zm-5.8 7.489-3.11 1.5a6.693 6.693 0 0 0 6.436-.436L7.332 11.56z"
        style="
          opacity: 0.5;
          stroke-width: 1.09597;
          -inkscape-stroke: none;
          paint-order: stroke markers fill;
        "
      ></path>
    </svg>
  </div>
</template>
