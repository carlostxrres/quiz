<template>
  <div class="q-pa-md">
    <q-btn v-if="!answered" color="primary" label="Submit Answer" @click="handleAnswer" />

    <transition name="fade">
      <q-banner v-if="answered" class="q-mt-md" :color="isCorrect ? 'green' : 'red'" inline>
        <template v-slot:avatar>
          <q-icon :name="isCorrect ? 'check_circle' : 'cancel'" />
        </template>
        {{ isCorrect ? 'Correct Answer!' : 'Incorrect Answer!' }}
      </q-banner>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      answered: false,
      isCorrect: false,
    }
  },
  methods: {
    handleAnswer() {
      // Simulate checking answer
      this.isCorrect = Math.random() > 0.5 // Replace with actual answer logic
      this.answered = true
    },
  },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
