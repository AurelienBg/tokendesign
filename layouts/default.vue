<script setup lang="ts">
// Clean neutral background (7powers identity); the layout stays transparent.
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <!-- XRPL wallet picker — mounted once so any page can open it. -->
    <WalletConnectorModal />
  </div>
</template>
