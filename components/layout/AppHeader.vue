<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-border-subtle/70 backdrop-blur-md"
          style="background-color: rgb(var(--bg-base) / 0.72)">
    <div class="wrap max-w-5xl flex items-center justify-between py-3">
      <NuxtLink :to="localePath('/')" class="no-underline text-ink-high">
        <AppLogo />
      </NuxtLink>
      <div class="flex items-center gap-2">
        <LangSwitcher />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>
