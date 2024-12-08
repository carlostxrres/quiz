<template>
  <q-footer class="q-py-sm q-px-md bg-white flex flex-center flex-gap" elevated>
    <q-btn
      flat
      round
      color="primary"
      icon="first_page"
      @click="setMinQuestionIndex"
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
      @click="setMaxQuestionIndex"
      :disabled="questionIndex === questionCount - 1"
      dense
      size="sm"
    />
  </q-footer>
</template>

<script setup>
import { useOngoingTestStore } from 'src/stores/ongoingTest'
import { computed } from 'vue'

const props = defineProps({
  questionCount: { type: Number, required: true },
  questionIndex: { type: Number, required: true },
  questionIds: { type: Array, required: true },
})

// QuestionIndex management
const emit = defineEmits(['update-question-index'])
const increaseQuestionIndex = () => {
  if (props.questionIndex < props.questionCount - 1) {
    emit('update-question-index', props.questionIndex + 1)
  }
}

const decreaseQuestionIndex = () => {
  if (props.questionIndex > 0) {
    emit('update-question-index', props.questionIndex - 1)
  }
}

const setQuestionIndex = (index) => {
  if (index < 0) {
    emit('update-question-index', 0)
  } else if (index >= props.questionCount) {
    emit('update-question-index', props.questionCount - 1)
  } else {
    emit('update-question-index', index)
  }
}

const setMinQuestionIndex = () => {
  setQuestionIndex(0)
}

const setMaxQuestionIndex = () => {
  setQuestionIndex(props.questionCount - 1)
}

// isQuestionAnswered, isQuestionCorrect
const ongoingTestStore = useOngoingTestStore()

const isQuestionAnswered = (questionIndex) => {
  const targetQuestionId = props.questionIds[questionIndex]
  if (!targetQuestionId) {
    return false
  }

  return ongoingTestStore.getIsAnswered(targetQuestionId)
}

const isQuestionCorrect = (questionIndex) => {
  const targetQuestionId = props.questionIds[questionIndex]
  if (!targetQuestionId) {
    return false
  }

  return ongoingTestStore.getIsCorrect(targetQuestionId)
}

// paginationOffsets
const isValidIndex = (index) => index >= 0 && index < props.questionCount
const paginationOffsets = computed(() => {
  // To do: adjust based on window width
  // For instance: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
  const offsets = [-2, -1, 0, 1, 2]
  return offsets.filter((offset) => isValidIndex(props.questionIndex + offset))
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
</style>
