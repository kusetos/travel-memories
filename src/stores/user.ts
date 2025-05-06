import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useMemoriesStore } from './memories'

export type User = {
  id: string
  username: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const memoriesStore = useMemoriesStore()

  const initializeUser = (username: string) => {
    user.value = {
      id: crypto.randomUUID(),
      username
    }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const loadUser = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
    memoriesStore.clearMemories()
    window.location.reload()
  }

  return {
    user,
    initializeUser,
    loadUser,
    clearUser
  }
}) 