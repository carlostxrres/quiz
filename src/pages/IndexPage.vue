<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />

    <JsonFetcher />
  </q-page>
</template>

<script setup>
import JsonFetcher from 'src/components/JsonFetcher.vue'
</script>
