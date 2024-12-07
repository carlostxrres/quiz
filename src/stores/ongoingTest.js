import { defineStore } from 'pinia'
import { ref } from 'vue'

// const ongoingTestSchema = [
//   {
//     id: '2b24e303-c002-546d-acf5-9e3f81ddb3a6', // Question ID
//     selected: ['c586a792-048b-5cb8-8efd-cbc6a0ed6607'], // Selected answer IDs
//     answered: true, // whether the selection was submitted
//     lastModified: '2024-12-07T12:30:45Z',
//     // Whether it's correct can be checked with the original question data
//   },
//   // ...
// ]

export const useOngoingTestStore = defineStore('ongoing-test-store', () => {
  // ref()s are state properties
  // computed()s are getters
  // function()s are actions

  const questions = ref([])

  const getQuestionData = (questionId) => {
    const existingQuestionData = questions.value.find(
      (question) => question.id === questionId,
    )

    return existingQuestionData || {}
  }

  const getIsAnswered = (questionId) => {
    const { answered } = getQuestionData(questionId)
    return answered || false
  }

  const getIsCorrect = (questionId) => {
    const { correct } = getQuestionData(questionId)
    return correct || false
  }

  const getSelectionIds = (questionId) => {
    const { selected } = getQuestionData(questionId)
    return selected || []
  }

  const getAnswerCount = () => {
    return questions.value.filter((question) => question.answered).length
  }

  const getCorrectCount = () => {
    return questions.value.filter((question) => question.correct).length
  }

  const setSelection = (questionId, selected) => {
    const existingQuestionData = questions.value.find(
      (question) => question.id === questionId,
    )

    const lastModified = Date.now()

    if (existingQuestionData) {
      // Update the values
      existingQuestionData.selected = selected
      existingQuestionData.lastModified = lastModified
    } else {
      // Create a new entry
      questions.value.push({
        id: questionId,
        selected,
        answered: false,
        correct: false,
        lastModified,
      })
    }
  }

  const setAsAnswered = (questionId, correct) => {
    const existingQuestionData = questions.value.find(
      (question) => question.id === questionId,
    )

    if (existingQuestionData) {
      existingQuestionData.answered = true
      existingQuestionData.correct = correct
    }
  }

  return {
    questions,
    getQuestionData,
    getIsAnswered,
    getIsCorrect,
    getSelectionIds,

    getAnswerCount,
    getCorrectCount,

    setSelection,
    setAsAnswered,
  }
})
