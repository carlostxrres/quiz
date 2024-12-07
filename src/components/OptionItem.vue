<template>
  <q-item :key="option.text" tag="label" class="rounded-borders" v-ripple>
    <q-item-section avatar>
      <q-checkbox
        v-if="isMultipleChoice"
        v-model="localValue"
        :val="option.id"
        :disable="isDisabled"
        keep-color
      />
      <q-radio
        v-else
        v-model="localValue"
        :val="option.id"
        :color="answered && option.isCorrect ? 'positive' : 'primary'"
        :disable="answered"
        keep-color
      />
    </q-item-section>
    <q-item-section>
      <q-item-label
        :style="{
          color: answered && option.isCorrect ? 'var(--q-positive)' : 'inherit',
        }"
      >
        {{ option.text }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  option: { type: Object, required: true },
  isMultipleChoice: { type: Boolean, required: true },
  answered: { type: Boolean, required: true },
  isDisabled: { type: Boolean, default: false },
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
</script>
