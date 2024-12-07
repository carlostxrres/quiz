<template>
  <q-list>
    <OptionItem
      v-for="option in options"
      :key="option.text"
      :option="option"
      :isMultipleChoice="isMultipleChoice"
      :answered="answered"
      :isDisabled="
        !localValue.includes(option.id) &&
        localValue.length >= correctOptionsCount
      "
      v-model="localValue"
    />
  </q-list>
</template>

<script setup>
import { ref, watch } from 'vue'
import OptionItem from './OptionItem.vue'

const props = defineProps({
  options: { type: Array, required: true },
  isMultipleChoice: { type: Boolean, required: true },
  correctOptionsCount: { type: Number, required: true },
  answered: { type: Boolean, required: true },
  modelValue: { type: [Array, String], required: true },
})

const emit = defineEmits(['update:modelValue'])

// Create a local proxy for modelValue
const localValue = ref(
  Array.isArray(props.modelValue) ? [...props.modelValue] : props.modelValue,
)

// Sync localValue with modelValue changes
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = Array.isArray(newValue) ? [...newValue] : newValue
  },
)

// Emit updates when localValue changes
watch(localValue, (newValue) => {
  emit('update:modelValue', newValue)
})

// import OptionItem from './OptionItem.vue'
//
// defineProps({
//   options: { type: Array, required: true },
//   isMultipleChoice: { type: Boolean, required: true },
//   correctOptionsCount: { type: Number, required: true },
//   answered: { type: Boolean, required: true },
//   modelValue: { type: [Array, String], required: true },
// })
// defineEmits(['update:modelValue'])
</script>
