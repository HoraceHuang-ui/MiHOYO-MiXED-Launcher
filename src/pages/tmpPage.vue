<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
onMounted(() => {
  router.push({
    name: 'gamepage',
    query: {
      game: route.query.from as string,
    },
  })
})
</script>

<template></template>
