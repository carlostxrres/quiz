<template>
  <div>
    <h1>JSON Data</h1>
    <div v-if="error">Error: {{ error }}</div>
    <div v-else-if="!questions">Loading...</div>
    <ul v-else>
      <li v-for="question in questions" :key="question.id">
        {{ question.query }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const questions = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await fetch('/data.json')
    if (!response.ok) throw new Error('Failed to load JSON')
    questions.value = await response.json()
  } catch (err) {
    error.value = err.message
  }
})
</script>
