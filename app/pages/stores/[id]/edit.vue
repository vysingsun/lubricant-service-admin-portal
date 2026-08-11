<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()
const storeId = computed(() => route.params.id as string)
const { data: store, isLoading } = useStoreQuery(storeId)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      {{ t('nav.storeSettings') }}
    </h1>

    <div v-if="isLoading" class="text-muted">
      {{ t('common.loading') }}
    </div>

    <StoreForm v-else-if="store" :store="store" />
  </div>
</template>
