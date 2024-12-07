<template>
  <main class="q-px-md">
    <p class="q-px-md text-weight-bold">{{ question.query }}</p>

    <q-list>
      <q-item
        v-for="option in question.options"
        :key="option.text"
        tag="label"
        class="rounded-borders"
        v-ripple
      >
        <q-item-section avatar>
          <q-radio
            v-model="selectedOption"
            :val="option.id"
            @update:model-value="onOptionSelection"
            :disable="answer.is"
            :color="answer.is && option.isCorrect ? 'positive' : 'primary'"
            keep-color
          />
          <!-- To do: disable this when the  -->
        </q-item-section>
        <q-item-section>
          <q-item-label :style="{ color: answer.is && option.isCorrect ? 'green' : 'primary' }">{{
            option.text
          }}</q-item-label>
          <!-- <q-item-label caption>With description </q-item-label> -->
        </q-item-section>
      </q-item>
    </q-list>

    <div hidden class="q-px-sm q-mt-sm">
      Selected answer: <strong>{{ selectedOption }}</strong>
    </div>

    <p
      v-if="question.isSubmitted && question.isSubmittedCorrectly"
      class="q-px-sm q-mt-sm text-grey-8 paragraph"
      v-html="question.explanation"
    ></p>

    <!-- <SubmitAnswerButton /> 

    <p>
      correct:
      {{ question && question.options.find((option) => option.isCorrect).id }}
    </p>
    <p>isSubmitted: {{ submission.is }}</p>
    <p>isAnswerCorrect: {{ submission.isCorrect }}</p>
    -->

    <q-btn
      class="full-width"
      label="Submit"
      color="primary"
      v-if="!answer.is"
      :disabled="!selectedOption"
      @click="submitAnswer"
      no-caps
    />

    <p v-if="answer.is" class="q-px-sm q-mt-lg text-grey-9" v-html="question.explanation"></p>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
})

// Define the emit function
const emit = defineEmits(['answerSelected'])

const selectedOption = ref('')

// Emit the selected option to the parent component
const onOptionSelection = (option) => {
  emit('optionSelection', option)
}

const defaultAnswer = {
  is: false,
  isCorrect: false,
}
const answer = computed(() => props.question.answer || defaultAnswer)

const submitAnswer = () => {
  const correctAnswer = props.question.options.find((option) => option.isCorrect)
  if (!correctAnswer) {
    // to do: handle error
    return
  }

  const newAnswer = {
    is: true,
    isCorrect: selectedOption.value === correctAnswer.id,
  }
  answer.value = newAnswer

  emit('answer', newAnswer)
}
</script>
<style>
.paragraph {
  line-height: 1.5rem;
}

br {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
