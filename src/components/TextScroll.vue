<template>
  <div
    class="marquee-wrap"
    ref="wrapRef"
    :style="{
      width: containerWidth,
      height: containerHeight,
      ...containerStyle,
    }"
  >
    <div
      class="marquee-inner"
      :style="{
        animation: `marquee-slide ${duration}s linear infinite`,
        ...contentStyle,
      }"
      ref="innerRef"
    >
      <span
        v-for="(copy, index) in contentCopies"
        :key="index"
        :style="{
          fontSize: fontSize,
          fontFamily: fontFamily,
          ...textStyle,
        }"
      >
        {{ content }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  // 轮播内容
  content: {
    type: String,
    default: '本店主营拉面,刀削面,烩面,盖浇饭',
  },
  // 动画持续时间(秒)
  duration: {
    type: Number,
    default: 5,
  },
  // 容器宽度
  containerWidth: {
    type: String,
    default: '200px',
  },
  // 容器高度
  containerHeight: {
    type: String,
    default: '20px',
  },
  // 字体大小
  fontSize: {
    type: String,
    default: 'inherit',
  },
  // 字体
  fontFamily: {
    type: String,
    default: 'inherit',
  },
  // 容器额外样式
  containerStyle: {
    type: Object,
    default: () => ({}),
  },
  // 内容额外样式
  contentStyle: {
    type: Object,
    default: () => ({}),
  },
  // 文本额外样式
  textStyle: {
    type: Object,
    default: () => ({}),
  },
})

const wrapRef = ref(null)
const innerRef = ref(null)
const contentCopies = ref(2) // 默认两份副本

// 检查内容是否需要复制以填满容器
const checkContentLength = () => {
  if (!wrapRef.value || !innerRef.value) return

  const wrapWidth = wrapRef.value.offsetWidth
  const firstSpan = innerRef.value.querySelector('span')

  if (!firstSpan) return

  // 测量单个内容的宽度
  const singleContentWidth = firstSpan.offsetWidth

  // 如果内容比容器窄，计算需要多少副本
  if (singleContentWidth < wrapWidth) {
    const neededCopies = Math.ceil(wrapWidth / singleContentWidth) * 2
    contentCopies.value = Math.max(2, neededCopies)
  } else {
    // 内容已经比容器宽，保持两份副本
    contentCopies.value = 2
  }
}

// 当内容或容器尺寸变化时重新检查
watch(
  () => [props.content, props.containerWidth],
  () => {
    checkContentLength()
  },
)

onMounted(() => {
  checkContentLength()

  // 添加resize监听
  const resizeObserver = new ResizeObserver(checkContentLength)
  if (wrapRef.value) {
    resizeObserver.observe(wrapRef.value)
  }
})
</script>

<style scoped>
.marquee-wrap {
  overflow: hidden;
  position: relative;
  white-space: nowrap;
}

.marquee-inner {
  position: absolute;
  display: inline-block;
}

.marquee-inner span {
  display: inline-block;
}
</style>

<style>
@keyframes marquee-slide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
