<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-6">{{ $t('signup.title') }}</h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium mb-1">{{ $t('signup.name') }}</label>
          <input 
            v-model="user.name" 
            id="name" 
            type="text" 
            required
            class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium mb-1">{{ $t('signup.email') }}</label>
          <input 
            v-model="user.email" 
            id="email" 
            type="email" 
            required
            class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium mb-1">{{ $t('signup.password') }}</label>
          <input 
            v-model="user.password" 
            id="password" 
            type="password" 
            required
            class="w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <button 
            type="submit" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <span class="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
              {{ $t('signup.submit') }}
            </span>
            <span v-else>{{ $t('signup.submit') }}</span>
          </button>
        </div>
        
        <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ successMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Signup',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    
    const user = reactive({
      name: '',
      email: '',
      password: ''
    })
    
    const isSubmitting = ref(false)
    const successMessage = ref('')
    
    const handleSubmit = async () => {
      try {
        isSubmitting.value = true
        
        // In a real app, this would make an API call
        await store.dispatch('signup', { ...user })
        
        successMessage.value = t('signup.success')
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } catch (error) {
        console.error('Error during signup:', error)
      } finally {
        isSubmitting.value = false
      }
    }
    
    return {
      user,
      isSubmitting,
      successMessage,
      handleSubmit
    }
  }
}
</script>