import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface TravelMemory {
  id: string
  location: {
    lat: number
    lng: number
    name: string
  }
  date: string
  note: string
  userId: string
}

export const useMemoriesStore = defineStore('memories', () => {
  const memories = ref<TravelMemory[]>([])

  const loadMemories = () => {
    const savedMemories = localStorage.getItem('memories')
    if (savedMemories) {
      memories.value = JSON.parse(savedMemories)
    }
  }

  const addMemory = (memory: Omit<TravelMemory, 'id'>) => {
    const newMemory: TravelMemory = {
      ...memory,
      id: crypto.randomUUID()
    }
    memories.value.push(newMemory)
    localStorage.setItem('memories', JSON.stringify(memories.value))
  }

  const deleteMemory = (id: string) => {
    memories.value = memories.value.filter(memory => memory.id !== id)
    localStorage.setItem('memories', JSON.stringify(memories.value))
  }

  const clearMemories = () => {
    memories.value = []
    localStorage.removeItem('memories')
  }

  return {
    memories,
    loadMemories,
    addMemory,
    deleteMemory,
    clearMemories
  }
}) 