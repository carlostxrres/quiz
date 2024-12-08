<template>
  <QuestionPageHeader :question-count="questionCount" />
  <QuestionComponent :question="question" />
  <QuestionPagePagination
    :question-count="questionCount"
    :question-index="questionIndex"
    :question-ids="questionIds"
    @update-question-index="updateQuestionIndex"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QuestionComponent from 'src/components/QuestionComponent.vue'
import QuestionPageHeader from 'src/components/QuestionPageHeader.vue'
import QuestionPagePagination from 'src/components/QuestionPagePagination.vue'

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

const questionIndex = ref(0)
const question = computed(() => questions.value[questionIndex.value])
const questionCount = computed(() => questions.value.length)
const questionIds = computed(() => questions.value.map((q) => q.id))

const updateQuestionIndex = (newIndex) => {
  if (newIndex >= 0 && newIndex < questionCount.value) {
    questionIndex.value = newIndex
  }
}
</script>
