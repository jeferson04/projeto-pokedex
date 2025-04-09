<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <header class="bg-blue-600 text-white shadow-md">
      <div class="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center mb-4 md:mb-0">
          <router-link to="/" class="text-2xl font-bold">{{ $t('app.title') }}</router-link>
          <div class="ml-6 space-x-2">
            <button 
              v-for="locale in ['en', 'pt', 'es']" 
              :key="locale"
              @click="changeLocale(locale)"
              class="px-2 py-1 rounded" 
              :class="{ 'bg-white text-blue-600': $i18n.locale === locale, 'bg-blue-700': $i18n.locale !== locale }"
            >
              {{ locale.toUpperCase() }}
            </button>
          </div>
        </div>
        <nav class="flex space-x-4">
          <router-link to="/" class="hover:text-blue-200">{{ $t('nav.home') }}</router-link>
          <template v-if="!isLoggedIn">
            <router-link to="/signup" class="hover:text-blue-200">{{ $t('nav.signup') }}</router-link>
          </template>
          <button v-else @click="logout" class="hover:text-blue-200">{{ $t('nav.logout') }}</button>
        </nav>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const { locale } = useI18n()

    const isLoggedIn = computed(() => store.getters.isLoggedIn)

    const logout = () => {
      store.dispatch('logout')
    }

    const changeLocale = (newLocale) => {
      locale.value = newLocale
    }

    return {
      isLoggedIn,
      logout,
      changeLocale
    }
  }
}
</script>
