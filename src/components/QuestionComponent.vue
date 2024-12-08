<template>
  <main class="q-px-md">
    <QuestionText :query="question.query" />

    <OptionsList
      :options="question.options"
      :isMultipleChoice="isMultipleChoice"
      :correctOptionsCount="correctOptionsCount"
      v-model="selectedOptionIds"
      :answered="answered"
    />

    <SubmitButton
      v-if="!answered"
      :disabled="!isSelectionCountCorrect"
      @submit="submitAnswer"
    />

    <FeedbackMessage
      v-if="answered"
      :message="question.explanation"
      class="q-px-sm q-mt-lg text-grey-9"
    />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useOngoingTestStore } from 'src/stores/ongoingTest'
import QuestionText from './QuestionText.vue'
import OptionsList from './OptionsList.vue'
import SubmitButton from './SubmitButton.vue'
import FeedbackMessage from './FeedbackMessage.vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

// Get if this question is multiple choice
const correctOptionsCount = computed(() => {
  const { options } = props.question
  if (!options) {
    return 1
  }

  return options.filter((option) => option.isCorrect).length
})
const isMultipleChoice = computed(() => correctOptionsCount.value > 1)

// Handle the selection of the options
const ongoingTestStore = useOngoingTestStore()
const selectedOptionIds = computed({
  get: () => {
    const valueInStore = ongoingTestStore.getSelectionIds(props.question.id)
    return isMultipleChoice.value ? valueInStore : valueInStore[0] || ''
  },
  set: (selected) => {
    const valueToSet = isMultipleChoice.value ? selected : [selected]
    // ongoingTestStore.setSelection(props.question.id, valueToSet, false)

    // Only update the store if the value has changed
    const currentSelection = ongoingTestStore.getSelectionIds(props.question.id)
    if (JSON.stringify(currentSelection) !== JSON.stringify(valueToSet)) {
      ongoingTestStore.setSelection(props.question.id, valueToSet, false)
    }
  },
})

// Handle the submission of the answer
const answered = computed(() =>
  ongoingTestStore.getIsAnswered(props.question.id),
)

const correctOptions = computed(
  () => props.question?.options?.filter((option) => option.isCorrect) ?? [],
)

const selectedAnswersCount = computed(() => {
  if (isMultipleChoice.value) {
    return selectedOptionIds.value.length
  } else {
    return selectedOptionIds.value ? 1 : 0
  }
})

const isSelectionCountCorrect = computed(
  () => selectedAnswersCount.value === correctOptionsCount.value,
)

const getIsCorrect = () => {
  const correctOptionIds = correctOptions.value.map((option) => option.id)

  if (isMultipleChoice.value) {
    const normalize = (arr) => [...arr.sort()].join('')
    return normalize(selectedOptionIds.value) === normalize(correctOptionIds)
  } else {
    return selectedOptionIds.value === correctOptionIds[0]
  }
}

const submitAnswer = () => {
  // Check if the user has selected an option
  if (!isSelectionCountCorrect.value) {
    // to do: user feedback
    return
  }

  // Update the store
  const isCorrect = getIsCorrect()
  ongoingTestStore.setAsAnswered(props.question.id, isCorrect)
}

// // I realized selectedOptionIds sometimes has a peak of updates,
// // so something might have recursive. Checking here:
// watch(selectedOptionIds, () => {
//   console.log('selectedOptionIds changed')
// })
</script>
