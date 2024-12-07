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
        rounded
      />
    </div>
  </div>
  <QuestionComponent :question="question" />

  <q-footer class="q-py-sm q-px-md bg-white flex flex-center flex-gap" elevated>
    <q-btn
      flat
      round
      color="primary"
      icon="first_page"
      @click="questionIndex = 0"
      :disabled="questionIndex === 0"
      dense
      size="sm"
    />

    <q-space />

    <q-btn
      flat
      round
      color="primary"
      icon="chevron_left"
      @click="decreaseQuestionIndex"
      :disabled="questionIndex === 0"
      dense
      size="md"
    />

    <q-btn
      v-for="offset in paginationOffsets"
      :key="questionIndex + offset"
      :label="questionIndex + offset + 1"
      :disabled="offset === 0"
      :color="offset === 0 ? 'grey-6' : 'primary'"
      @click="setQuestionIndex(questionIndex + offset)"
      size="md"
      padding="sm"
      flat
      :class="{
        'is-answered': isQuestionAnswered(questionIndex + offset),
        'is-correct': isQuestionCorrect(questionIndex + offset),
      }"
    />
    <!-- Each has 3 states: undone, correct, incorrect -->

    <q-btn
      flat
      round
      color="primary"
      icon="chevron_right"
      @click="increaseQuestionIndex"
      :disabled="questionIndex === questionCount - 1"
      dense
      size="md"
    />

    <q-space />

    <q-btn
      flat
      round
      color="primary"
      icon="last_page"
      @click="questionIndex = questionCount - 1"
      :disabled="questionIndex === questionCount - 1"
      dense
      size="sm"
    />
  </q-footer>
</template>

<script setup>
import QuestionComponent from 'src/components/QuestionComponent.vue'
import { ref, onMounted, computed } from 'vue'
import { useOngoingTestStore } from 'src/stores/ongoingTest'

const questions = ref([{}])
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

// Container: has all the questions, the header here, and the footer here
// It has the current question number, and the total number of questions
const questionIndex = ref(0)
const questionCount = computed(() => questions.value.length)
const question = computed(() => questions.value[questionIndex.value])

const ongoingTestStore = useOngoingTestStore()

const isQuestionAnswered = (questionIndex) => {
  const targetQuestion = questions.value[questionIndex]
  if (!targetQuestion) {
    return false
  }

  const targetQuestionId = targetQuestion.id
  return ongoingTestStore.getIsAnswered(targetQuestionId)
}

const isQuestionCorrect = (questionIndex) => {
  const targetQuestion = questions.value[questionIndex]
  if (!targetQuestion) {
    return false
  }

  const targetQuestionId = targetQuestion.id
  return ongoingTestStore.getIsCorrect(targetQuestionId)
}

const answerCount = computed(() => ongoingTestStore.getAnswerCount())

const answerCountProgress = computed(() => {
  if (!answerCount.value || !questionCount.value) {
    return 0
  }

  return answerCount.value / (questionCount.value - 1)
})

const correctCount = computed(() => ongoingTestStore.getCorrectCount())
const correctCountProgress = computed(() => {
  if (!questionCount.value || !correctCount.value) {
    return 0
  }

  return correctCount.value / (questionCount.value - 1)
})

// Manage question index
const increaseQuestionIndex = () => {
  if (questionIndex.value < questionCount.value) {
    questionIndex.value++
  }
}

const decreaseQuestionIndex = () => {
  if (questionIndex.value > 0) {
    questionIndex.value--
  }
}

const setQuestionIndex = (index) => {
  if (index < 0) {
    questionIndex.value = 0
  } else if (index >= questionCount.value) {
    questionIndex.value = questionCount.value
  } else {
    questionIndex.value = index
  }
}

const isValidIndex = (index) => {
  return index >= 0 && index < questionCount.value
}

const paginationOffsets = computed(() => {
  // To do: adjust based on window width
  // [-3, -2, -1, 0, 1, 2, 3]
  return [-2, -1, 0, 1, 2].filter((offset) =>
    isValidIndex(questionIndex.value + offset),
  )
})
</script>

<style>
.is-answered {
  position: relative;
}

.is-answered::after {
  content: '';
  display: block;
  position: absolute;
  inset: 80% 50%;
  transform: translateX(-50%);
  width: 0.2rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--q-negative);
}

.is-answered.is-correct::after {
  background-color: var(--q-positive);
}
.progress::after {
  content: '';
  display: block;
  position: absolute;
  inset: 0;
  background-color: #bebebe;
  opacity: 0.2;
}
</style>
