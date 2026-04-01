<template>
  <router-link :to="{ name: routeName }"
    class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
    :class="isActive
      ? 'bg-primary-50 text-primary-700'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'">
    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
      v-html="icon" />
    {{ name }}
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
