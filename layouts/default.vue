<script setup lang="ts">
// The blueprint "technical grid" background is painted on body::before
// (assets/css/main.css), so the layout itself stays transparent.
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
