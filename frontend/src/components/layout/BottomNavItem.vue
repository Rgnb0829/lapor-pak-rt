<template>
  <router-link :to="{ name: routeName }"
    class="flex flex-col items-center gap-1 px-3 py-2.5 transition-colors min-w-[56px]"
    :class="isActive ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      v-html="icon" />
    <span class="text-[10px] font-semibold">{{ name }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  name: string
  routeName: string
  icon: string
}>()

const route = useRoute()
const isActive = computed(() => route.name === props.routeName)
</script>
