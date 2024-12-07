<template>
  <div class="q-py-md q-px-lg bg-white">
    <q-btn flat round color="primary" icon="close" />
    <div class="q-px-sm">
      <small class="text-weight-light text-grey-9">
        Question {{ questionIndex + 1 }} of {{ questionCount }}
      </small>
      <q-linear-progress size="lg" :value="progress" color="primary" rounded />
    </div>
  </div>
  <QuestionComponent :question="questions[questionIndex]" @answer="handleAnswer" />

  <q-footer class="q-pa-lg bg-white q-pa-lg flex flex-center flex-gap" elevated>
    <div class="q-mt-md">
      <q-btn
        flat
        round
        color="primary"
        icon="first_page"
        @click="questionIndex = 0"
        :disabled="questionIndex === 0"
        dense
      />

      <q-btn
        flat
        round
        color="primary"
        icon="chevron_left"
        @click="questionIndexDecrease"
        :disabled="questionIndex === 0"
        dense
      />

      <q-btn
        v-for="offset in paginationOffsets"
        :key="questionIndex + offset"
        :flat="offset !== 0"
        color="primary"
        :label="questionIndex + offset + 1"
        :disabled="offset === 0"
        @click="questionIndexSet(questionIndex + offset)"
      />
      <!-- Each has 3 states: undone, correct, incorrect -->

      <q-btn
        flat
        round
        color="primary"
        icon="chevron_right"
        @click="questionIndexIncrease"
        :disabled="questionIndex === questionCount - 1"
        dense
      />

      <q-btn
        flat
        round
        color="primary"
        icon="last_page"
        @click="questionIndex = questionCount - 1"
        :disabled="questionIndex === questionCount - 1"
        dense
      />
    </div>
  </q-footer>
</template>

<script setup>
import QuestionComponent from 'src/components/QuestionComponent.vue'
import { ref, onMounted, computed } from 'vue'

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
const progress = computed(() => {
  if (!questionIndex.value || !questionCount.value) {
    return 0
  }

  return questionIndex.value / (questionCount.value - 1)
})

const questionIndexIncrease = () => {
  if (questionIndex.value < questionCount.value) {
    questionIndex.value++
  }
}

const questionIndexDecrease = () => {
  if (questionIndex.value > 0) {
    questionIndex.value--
  }
}

const questionIndexSet = (index) => {
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
  // [-2, -1, 0, 1, 2]
  return [-1, 0, 1].filter((offset) => isValidIndex(questionIndex.value + offset))
})

// Here
// Props:
// question

const handleAnswer = (answer) => {
  console.log(answer)
  // to do: post to server

  questions.value[questionIndex.value].answer = answer
}

// When an answer is selected, send it to the parent component
</script>
