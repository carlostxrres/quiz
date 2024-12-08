<template>
  <q-btn
    class="full-width q-mt-md q-mb-lg"
    label="Submit"
    color="primary"
    :disabled="disabled"
    @click="submit"
    no-caps
  />
</template>

<script setup>
defineProps({
  disabled: { type: Boolean, required: true },
})
const emit = defineEmits(['submit'])
const submit = () => {
  emit('submit')
}
</script>
