<script setup lang="ts">
const route = useRoute()

const { data } = await useAsyncData(`${route.params.slug}`, () => queryCollection('docs').path(route.path).first())
</script>

<template>
  <ContentRenderer v-if="data" :value="data" />
  <div v-else>
    Loading...
  </div>
</template>
