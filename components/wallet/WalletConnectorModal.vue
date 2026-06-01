<script setup lang="ts">
/**
 * Wraps the <xrpl-wallet-connector> Web Component (ClientOnly — it registers
 * itself at import time and would crash SSR). Mounted once globally from the
 * layout; surfaces trigger it via useXrplWallet().connect().
 *
 * Mount timing: ClientOnly defers children past the parent's onMounted, so we
 * watch the ref (immediate) to register the element the moment it lands.
 * Lifted from 7powers.
 */
const { registerConnector } = useXrplWallet()

const connectorEl = ref<HTMLElement | null>(null)

watch(
  connectorEl,
  (el) => {
    registerConnector(el ? (el as unknown as Parameters<typeof registerConnector>[0]) : null)
  },
  { immediate: true }
)

onBeforeUnmount(() => registerConnector(null))
</script>

<template>
  <ClientOnly>
    <xrpl-wallet-connector
      ref="connectorEl"
      primary-wallet="crossmark"
      background-color="#0c0e16"
      style="display: none"
    />
  </ClientOnly>
</template>
