<script setup lang="ts">
import type { Equipment } from '~/utils/types'

const props = defineProps<Partial<Equipment>>()

watchEffect(() => console.log(props))
</script>

<template>
  <slot />
</template>
