<template>
  <div ref="widgetRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    sitekey: string
    theme?: 'light' | 'dark' | 'auto'
  }>(),
  { theme: 'light' },
)

const emit = defineEmits<{
  verified: [token: string]
  expired: []
  error: []
}>()

const widgetRef = ref<HTMLElement | null>(null)
let widgetId: string | null = null

// Unique global callback names to support multiple instances
const uid = Math.random().toString(36).slice(2, 9)
const cbVerify = `_tsv_${uid}`
const cbExpire = `_tse_${uid}`
const cbError = `_tserr_${uid}`

function loadScript(): Promise<void> {
  return new Promise((resolve) => {
    // Already loaded
    if ((window as any).turnstile) {
      resolve()
      return
    }
    // Script tag already injected (e.g., another component instance)
    const existing = document.querySelector<HTMLScriptElement>('script[data-cf-turnstile]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.cfTurnstile = 'true'
    script.addEventListener('load', () => resolve(), { once: true })
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  ;(window as any)[cbVerify] = (token: string) => emit('verified', token)
  ;(window as any)[cbExpire] = () => emit('expired')
  ;(window as any)[cbError] = () => emit('error')

  await loadScript()

  if (widgetRef.value && (window as any).turnstile) {
    widgetId = (window as any).turnstile.render(widgetRef.value, {
      sitekey: props.sitekey,
      theme: props.theme,
      callback: cbVerify,
      'expired-callback': cbExpire,
      'error-callback': cbError,
    })
  }
})

onUnmounted(() => {
  if (widgetId !== null && (window as any).turnstile) {
    ;(window as any).turnstile.remove(widgetId)
  }
  delete (window as any)[cbVerify]
  delete (window as any)[cbExpire]
  delete (window as any)[cbError]
})
</script>
