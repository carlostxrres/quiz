<template>
  <p class="q-px-md text-weight-bold question-query">{{ query }}</p>
</template>

<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})
</script>

<style>
.question-query {
  font-size: 1.2rem;
}
</style>
