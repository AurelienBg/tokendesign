// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  // Anthropic / Puppeteer are added in their sprints (coach = S6). Supabase
  // (S5) is wired below; it needs SUPABASE_* env (see .env.example).
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    // Auto page-view tracking on Vercel; no-op locally + on other hosts.
    '@vercel/analytics/nuxt'
  ],

  supabase: {
    // Env names follow the project's .env (NEXT_PUBLIC_* convention), with a
    // fallback to the plain SUPABASE_* names for resilience.
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE,
    // Local-first: auth is OPT-IN. Disable the global redirect so anonymous
    // users browse freely; /login is reached via the header link only.
    redirect: false
  },

  // Public runtime config. Nuxt fills walletconnectProjectId from
  // NUXT_PUBLIC_WALLETCONNECT_PROJECT_ID (used by xrpl-connect for the XRPL
  // wallet sign-in, esp. Xaman / WalletConnect QR flows).
  runtimeConfig: {
    public: {
      walletconnectProjectId: ''
    }
  },

  css: ['~/assets/css/main.css'],

  components: [
    // Flatten directory hierarchy: components/ui/AppLogo.vue → <AppLogo />
    { path: '~/components', pathPrefix: false }
  ],

  // xrpl-connect registers a <xrpl-wallet-connector> custom element.
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'xrpl-wallet-connector'
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  app: {
    head: {
      title: 'Token Design — cadre ton token, sans angle mort',
      // Dark by default — matches the blueprint identity (spec §11).
      htmlAttrs: { class: 'dark' },
      // Inline script runs synchronously BEFORE first paint — prevents a
      // light↔dark flash if the persisted theme differs from the SSR default.
      // See composables/useTheme.ts for the runtime side.
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem('tokendesign:theme');if(t==='light'){document.documentElement.classList.remove('dark')}else if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          tagPosition: 'head'
        }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Self-serve assistant that helps a web3 founder frame a token — identity, EU regulatory class, obligations, red flags, launch checklist. Not legal advice.' },
        { name: 'theme-color', content: '#0a0a0f' },
        { property: 'og:title', content: 'Token Design' },
        { property: 'og:description', content: 'Frame your token: identity, EU regulatory class (MiCA / MiFID II), obligations, red flags, launch checklist.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Token Design' },
        { name: 'twitter:card', content: 'summary' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
        }
      ]
    }
  },

  i18n: {
    // Both locales route-prefixed (spec §5 → /en/*, /fr/*). EN is the default.
    strategy: 'prefix',
    defaultLocale: 'en',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'fr', language: 'fr-FR', name: 'Français', file: 'fr.json' }
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    // Our copy contains small, static inline HTML (<em>, <b>) rendered via
    // v-html. Allow it instead of failing the bundler's HTML detection.
    compilation: {
      strictMessage: false,
      escapeHtml: false
    }
  }
})
