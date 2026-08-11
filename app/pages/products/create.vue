<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      {{ t('products.create') }}
    </h1>
    <ProductForm />
  </div>
</template>
