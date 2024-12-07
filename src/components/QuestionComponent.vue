<template>
  <main class="q-px-md">
    <p class="q-px-md text-weight-bold question-query">
      {{ question.query }}
    </p>

    <q-list>
      <q-item
        v-for="option in question.options"
        :key="option.text"
        tag="label"
        class="rounded-borders"
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox
            v-if="isMultipleChoice"
            v-model="selectedOptionIds"
            :val="option.id"
            :disable="
              !selectedOptionIds.includes(option.id) &&
              selectedOptionIds.length >= correctOptionsCount
            "
            keep-color
          />

          <q-radio
            v-else
            v-model="selectedOptionIds"
            :val="option.id"
            :color="answered && option.isCorrect ? 'positive' : 'primary'"
            :disable="answered"
            keep-color
          />

          <!-- To do: disable this when the  -->
        </q-item-section>

        <q-item-section>
          <q-item-label
            :style="{
              color:
                answered && option.isCorrect ? 'var(--q-positive)' : 'inherit',
            }"
            >{{ option.text }}</q-item-label
          >
          <!-- <q-item-label caption>Description </q-item-label> -->
        </q-item-section>
      </q-item>
    </q-list>

    <p
      v-if="question.isSubmitted && question.isSubmittedCorrectly"
      class="q-px-sm q-mt-sm text-grey-8 paragraph"
      v-html="question.explanation"
    ></p>

    <q-btn
      v-if="!answered"
      class="full-width q-mb-lg"
      label="Submit"
      color="primary"
      :disabled="!isSelectionCountCorrect"
      @click="submitAnswer"
      no-caps
    />

    <!-- 
    <q-tooltip v-model="shouldShowTooltip">Please select an option to submit</q-tooltip>
    -->

    <p
      v-if="answered"
      class="q-px-sm q-mt-lg text-grey-9"
      v-html="question.explanation"
    ></p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useOngoingTestStore } from 'src/stores/ongoingTest'

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
    ongoingTestStore.setSelection(props.question.id, valueToSet, false)
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
  // to do: check that the user selected _all_ options (1 or 2)

  if (!isSelectionCountCorrect.value) {
    // to do: user feedback
    return
  }

  // Update the store
  const isCorrect = getIsCorrect()
  ongoingTestStore.setAsAnswered(props.question.id, isCorrect)
}
</script>

<style>
.question-query {
  font-size: 1.2rem;
}

.paragraph {
  line-height: 1.5rem;
}

br {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
