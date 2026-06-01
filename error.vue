<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const localePath = useLocalePath()
</script>

<template>
  <div class="min-h-screen grid place-items-center px-6">
    <div class="text-center">
      <p class="kicker mb-3">{{ error.statusCode }}</p>
      <h1 class="font-display text-3xl mb-4">
        {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <NuxtLink :to="localePath('/')" class="btn-primary" @click="() => clearError()">
        Back to the hub
      </NuxtLink>
    </div>
  </div>
</template>
