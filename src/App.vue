<template>
  <div class="app">
    <header class="header">
      <h1>Travel Memories 🌍</h1>
      <div v-if="user" class="user-info">
        Welcome, {{ user.username }}!
        <button class="logout-button" @click="handleLogout">Logout</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="!user" class="auth-container">
        <h2>Welcome to Travel Memories!</h2>
        <p>Please enter your username to start creating your travel memories.</p>
        <form @submit.prevent="handleSubmit" class="auth-form">
          <input
            v-model="username"
            type="text"
            placeholder="Enter your username"
            required
            class="input"
          />
          <button type="submit" class="button">Start Journey</button>
        </form>
      </div>

      <div v-else class="app-container">
        <MapView />
        <TimelineView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from './stores/user'
import MapView from './components/MapView.vue'
import TimelineView from './components/TimelineView.vue'

const userStore = useUserStore()
const username = ref('')
const user = computed(() => userStore.user)

onMounted(() => {
  userStore.loadUser()
})

const handleSubmit = () => {
  if (username.value.trim()) {
    userStore.initializeUser(username.value.trim())
  }
}

const handleLogout = () => {
  userStore.clearUser()
}
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.button {
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button:hover {
  background-color: #3aa876;
}

.app-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .app-container {
    grid-template-columns: 1fr;
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c82333;
}
</style> 