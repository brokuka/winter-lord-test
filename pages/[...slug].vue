<script setup lang="ts">
const route = useRoute()
// console.log(route)
const { data } = await useAsyncData(`${route.params.slug}`, () => {
  return queryCollection('docs').path(route.path).first()
})
</script>

<template>
  <ContentRenderer v-if="data" :value="data" />
  <div v-else>
    Page not found
  </div>
</template>
