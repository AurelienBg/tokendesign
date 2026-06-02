<script setup lang="ts">
// Analyze merged into the unified "Frame a token" flow (/create). Redirect to
// preserve old links/bookmarks.
const localePath = useLocalePath()
await navigateTo(localePath('/create'), { redirectCode: 301 })
</script>

<template>
  <div />
</template>
