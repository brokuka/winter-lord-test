<script setup lang="ts">
import type { Equipment } from '~/utils/types'

interface TestProps {
  title: string
  obj: Record<string, number>
}

const props = defineProps<TestProps>()

watchEffect(() => console.log(props))
</script>

<template>
  <slot />
</template>
