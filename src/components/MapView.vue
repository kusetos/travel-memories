<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
    <div v-if="showMemoryForm" class="memory-form">
      <h3>Add Memory</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Location Name</label>
          <input v-model="newMemory.location.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Date</label>
          <input v-model="newMemory.date" type="date" required />
        </div>
        <div class="form-group">
          <label>Note</label>
          <textarea v-model="newMemory.note" required></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="button">Save Memory</button>
          <button type="button" class="button button-secondary" @click="cancelAdd">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useUserStore } from '../stores/user'
import { useMemoriesStore, type TravelMemory } from '../stores/memories'

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const showMemoryForm = ref(false)
const userStore = useUserStore()
const memoriesStore = useMemoriesStore()

const newMemory = ref<Omit<TravelMemory, 'id' | 'userId'>>({
  location: {
    lat: 0,
    lng: 0,
    name: ''
  },
  date: '',
  note: ''
})

onMounted(() => {
  if (mapContainer.value) {
    // Initialize map
    map.value = L.map(mapContainer.value).setView([0, 0], 2)
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.value as L.Map)

    // Add click handler
    map.value.on('click', (e: L.LeafletMouseEvent) => {
      if (userStore.user) {
        newMemory.value.location.lat = e.latlng.lat
        newMemory.value.location.lng = e.latlng.lng
        showMemoryForm.value = true
      }
    })

    // Load existing memories
    memoriesStore.loadMemories()
    memoriesStore.memories.forEach(memory => {
      if (memory.userId === userStore.user?.id) {
        addMarker(memory)
      }
    })
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

const addMarker = (memory: TravelMemory) => {
  if (map.value) {
    const marker = L.marker([memory.location.lat, memory.location.lng])
      .addTo(map.value as L.Map)
      .bindPopup(`
        <strong>${memory.location.name}</strong><br>
        <em>${new Date(memory.date).toLocaleDateString()}</em><br>
        ${memory.note}
      `)
  }
}

const handleSubmit = () => {
  if (userStore.user) {
    const memory: Omit<TravelMemory, 'id'> = {
      ...newMemory.value,
      userId: userStore.user.id
    }
    memoriesStore.addMemory(memory)
    addMarker({ ...memory, id: '' })
    cancelAdd()
  }
}

const cancelAdd = () => {
  showMemoryForm.value = false
  newMemory.value = {
    location: {
      lat: 0,
      lng: 0,
      name: ''
    },
    date: '',
    note: ''
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#map {
  height: 100%;
  width: 100%;
  z-index: 1;
}

.memory-form {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 2;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #3aa876;
}

.button-secondary {
  background-color: #666;
}

.button-secondary:hover {
  background-color: #555;
}
</style> 