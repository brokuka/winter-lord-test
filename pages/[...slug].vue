<script setup lang="ts">
const route = useRoute()

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
  <ClientOnly>
    <Suspense>
      <ContentRenderer :value="data!" />

      <template #fallback>
        Loading...
      </template>
    </Suspense>

    <template #fallback>
      Loading...
    </template>
  </ClientOnly>
</template>
