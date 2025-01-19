<script setup lang="ts">
const route = useRoute()
// console.log(route)
const { data } = await useAsyncData(`${route.params.slug}`, () => {
  return queryCollection('docs').path(route.path).first()
})

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
  })
}
</script>

<template>
  <ContentRenderer :value="data!" />
</template>
