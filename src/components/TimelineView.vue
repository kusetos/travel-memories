<template>
  <div class="timeline-container">
    <h2>Your Travel Memories</h2>
    <div v-if="memories.length === 0" class="empty-state">
      <p>No memories yet. Click on the map to add your first travel memory!</p>
    </div>
    <div v-else class="timeline">
      <div v-for="memory in sortedMemories" :key="memory.id" class="timeline-item">
        <div class="timeline-content">
          <div class="timeline-header">
            <h3>{{ memory.location.name }}</h3>
            <button class="delete-button" @click="deleteMemory(memory.id)" title="Delete memory">
              🗑️
            </button>
          </div>
          <div class="timeline-date">
            {{ new Date(memory.date).toLocaleDateString() }}
          </div>
          <p class="timeline-note">{{ memory.note }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMemoriesStore, type TravelMemory } from '../stores/memories'

const memoriesStore = useMemoriesStore()

const memories = computed(() => memoriesStore.memories)

const sortedMemories = computed(() => {
  return [...memories.value].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

const deleteMemory = (id: string) => {
  if (confirm('Are you sure you want to delete this memory?')) {
    memoriesStore.deleteMemory(id)
  }
}
</script>

<style scoped>
.timeline-container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 600px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid #42b883;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #42b883;
}

.timeline-content {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-header h3 {
  margin: 0;
  color: #2c3e50;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.delete-button:hover {
  opacity: 1;
}

.timeline-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.timeline-note {
  color: #2c3e50;
  line-height: 1.5;
  margin: 0;
}
</style> 