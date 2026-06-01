import type { Config } from 'tailwindcss'

/**
 * Token Design — "blueprint" identity (spec §11).
 *
 *   Accent (amber):  #e6a93c (dark)  /  #a9741a (light)
 *   Semantics:       ok (teal) · danger · warn · info (blue)
 *
 * Unlike 7powers (where brand colors are locked), the blueprint accent and
 * semantics are THEME-AWARE here — they are wired to CSS variables in
 * assets/css/main.css and flip with the `.dark` class on <html>.
 * Surfaces (bg.*, border.*, ink.*) follow the same 7powers token architecture.
 */
export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware surfaces — driven by CSS variables in :root + .dark
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          card: 'rgb(var(--bg-card) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          raised: 'rgb(var(--bg-raised) / <alpha-value>)'
        },
        border: {
          subtle: 'rgb(var(--border-subtle) / <alpha-value>)',
          accent: 'rgb(var(--border-accent) / <alpha-value>)'
        },
        ink: {
          high: 'rgb(var(--ink-high) / <alpha-value>)',
          mid: 'rgb(var(--ink-mid) / <alpha-value>)',
          low: 'rgb(var(--ink-low) / <alpha-value>)'
        },

        // Blueprint accent + semantics — theme-aware
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          on: 'rgb(var(--on-accent) / <alpha-value>)'
        },
        ok: 'rgb(var(--ok) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        warn: 'rgb(var(--warn) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        kicker: '0.22em'
      },
      boxShadow: {
        // 230,169,60 = #e6a93c
        'glow-accent': '0 0 0 1px rgb(var(--accent) / 0.4), 0 0 24px -4px rgb(var(--accent) / 0.32)',
        'card': '0 1px 0 0 rgb(var(--ink-high) / 0.03) inset, 0 0 0 1px rgb(var(--ink-high) / 0.04)'
      }
    }
  }
}
