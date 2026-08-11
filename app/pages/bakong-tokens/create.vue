<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'operator']
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      {{ t('bakongTokens.create') }}
    </h1>
    <BakongTokenForm />
  </div>
</template>
