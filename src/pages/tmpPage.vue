<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
onMounted(() => {
    router.push(route.query.from)
})
</script>

<template></template>
