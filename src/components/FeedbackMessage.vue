<template>
  <p class="paragraph" v-html="message"></p>
</template>

<script setup>
defineProps({
  message: { type: String, required: true },
})
</script>

<style>
.paragraph {
  line-height: 1.5rem;
}
</style>
