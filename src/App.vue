<script setup>
</script>

<template id="app">
  <TopHeader />
  <router-view></router-view>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
