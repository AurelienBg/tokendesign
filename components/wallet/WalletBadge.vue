<script setup lang="ts">
/**
 * WalletBadge — XRPL wallet status for the signed-in user (header chip).
 * Wallet as an *additional identity* linked to the account (Phase A), distinct
 * from "sign in with wallet". Three states: no linked wallet → "Link wallet";
 * linked + offline → address + ↻; linked + live → address + ◈. Hidden for
 * anonymous users. Trimmed from 7powers.
 */
const { t } = useI18n()
const { isAuthenticated } = useAuth()
const { connect, disconnect, connecting, connected, account, linkedAddress, shorten } = useXrplWallet()

const menuOpen = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const displayAddress = computed(() => account.value?.address ?? linkedAddress.value ?? null)
const shortAddress = computed(() => shorten(displayAddress.value))

async function handleUnlink() {
  menuOpen.value = false
  await disconnect()
}

function onDocClick(e: MouseEvent) {
  if (!menuOpen.value) return
  if (!rootEl.value?.contains(e.target as Node)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div v-if="isAuthenticated" ref="rootEl" class="relative hidden sm:block">
    <!-- No linked wallet → CTA -->
    <button
      v-if="!displayAddress"
      type="button"
      class="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-border-subtle text-ink-mid hover:text-ink-high hover:border-accent transition-colors disabled:opacity-50"
      :disabled="connecting"
      @click="connect"
    >
      <span class="glyph text-accent" aria-hidden="true">◈</span>
      <span>{{ connecting ? t('wallet.connecting') : t('wallet.link') }}</span>
    </button>

    <!-- Linked → chip + menu -->
    <button
      v-else
      type="button"
      class="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md border border-border-subtle text-ink-mid hover:text-ink-high hover:border-accent transition-colors"
      :title="displayAddress"
      @click="menuOpen = !menuOpen"
    >
      <span class="glyph" :class="connected ? 'text-warn' : 'text-ink-low'" aria-hidden="true">◈</span>
      <span>{{ shortAddress }}</span>
      <span v-if="!connected" class="text-ink-low text-[10px]" aria-hidden="true">↻</span>
    </button>

    <div
      v-if="menuOpen && displayAddress"
      class="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-border-subtle bg-bg-elevated shadow-lg z-40 overflow-hidden text-sm"
    >
      <div class="px-3 py-2 border-b border-border-subtle">
        <p class="text-[10px] uppercase tracking-wider text-ink-low">{{ t('wallet.linkedAddress') }}</p>
        <p class="text-xs font-mono text-ink-high break-all leading-relaxed">{{ displayAddress }}</p>
        <p class="text-[10px] mt-1" :class="connected ? 'text-ok' : 'text-warn'">
          {{ connected ? t('wallet.statusConnected') : t('wallet.statusOffline') }}
        </p>
      </div>
      <button
        type="button"
        class="w-full text-left px-3 py-2 text-xs text-ink-mid hover:text-ink-high hover:bg-bg-card transition-colors"
        @click="handleUnlink"
      >
        {{ t('wallet.unlink') }}
      </button>
    </div>
  </div>
</template>
