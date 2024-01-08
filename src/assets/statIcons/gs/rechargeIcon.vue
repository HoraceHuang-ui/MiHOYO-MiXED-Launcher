<script setup>
const props = defineProps({
    fill: String
})
</script>

<template>
    <div>
        <svg viewBox="0 0 14 14">
            <path :fill="props.fill"
                  d="M3.562 7.002a4.03 4.03 0 0 1 4.045-4.049L7.606.608C4.09.61 1.216 3.487 1.216 7.003Z"
                  style="fill-opacity:.5;stroke-width:.913084;-inkscape-stroke:none;paint-order:stroke markers fill"></path>
            <path :fill="props.fill"
                  d="M7.607.607v2.344a4.03 4.03 0 0 1 4.047 4.047 4.03 4.03 0 0 1-4.047 4.047 4.03 4.03 0 0 1-3.578-2.17l1.727-.348L1.87 4.123 0 9.689l1.67-.337c.942 2.36 3.251 4.039 5.937 4.039C11.123 13.39 14 10.517 14 7S11.123.607 7.607.607Z"
                  style="fill-opacity:1;stroke-width:.913084;-inkscape-stroke:none;paint-order:stroke markers fill"></path>
        </svg>
    </div>
</template>
