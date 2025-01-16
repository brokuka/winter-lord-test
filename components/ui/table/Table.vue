<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '~/utils/lib'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <table :class="cn('caption-bottom text-sm', props.class)">
    <slot />
  </table>
</template>
