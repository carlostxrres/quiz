<template>
  <div class="q-py-md q-px-lg bg-white">
    <div class="flex">
      <p class="text-grey-6 text-weight-bold content-center q-ma-none">
        Question {{ questionIndex + 1 }}
      </p>
      <q-space />
      <q-btn flat round color="primary" icon="close" />
    </div>
    <div class="q-px-sm">
      <small class="text-weight-light text-grey-9 flex">
        {{ correctCount }} correct answers of {{ answerCount }} submitted
        <q-space />
        {{ questionCount }} questions
      </small>
      <q-linear-progress
        size="lg"
        :value="correctCountProgress"
        :buffer="answerCountProgress"
        class="progress"
        color="primary"
        track-color="negative"
        animation-speed="500"
        rounded
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOngoingTestStore } from 'src/stores/ongoingTest'

const props = defineProps({
  questionCount: { type: Number, required: true },
  questionIndex: { type: Number, required: true },
})

const ongoingTestStore = useOngoingTestStore()

const answerCount = computed(() => ongoingTestStore.getAnswerCount())
const answerCountProgress = computed(() => {
  if (!props.questionCount || !answerCount.value) {
    return 0
  }

  return answerCount.value / (props.questionCount - 1)
})

const correctCount = computed(() => ongoingTestStore.getCorrectCount())
const correctCountProgress = computed(() => {
  if (!props.questionCount || !correctCount.value) {
    return 0
  }

  return correctCount.value / (props.questionCount - 1)
})
</script>

<style>
.progress::after {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background-color: #bebebe;
  opacity: 0.2;
}
</style>
