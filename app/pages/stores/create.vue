<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="flex justify-center">
    <StoreForm />
  </div>
</template>
