<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { data: stores, isLoading } = useStoresQuery()

const statusColor: Record<string, 'neutral' | 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  active: 'success',
  suspended: 'error'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h1 class="text-2xl font-semibold">
        {{ t('nav.storeSettings') }}
      </h1>
      <UButton icon="i-lucide-plus" to="/stores/create">
        {{ t('storeSettings.create') }}
      </UButton>
    </div>

    <div v-if="isLoading" class="text-muted">
      {{ t('common.loading') }}
    </div>

    <UAlert
      v-else-if="!stores?.length"
      icon="i-lucide-store"
      color="neutral"
      variant="soft"
      :title="t('storeSettings.emptyTitle')"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <UCard
        v-for="store in stores"
        :key="store.id"
        :to="`/stores/${store.id}/edit`"
      >
        <div class="flex items-center gap-4">
          <UAvatar :src="store.logoUrl || undefined" :alt="store.name" size="lg" />
          <div class="min-w-0 flex-1">
            <p class="font-medium truncate">
              {{ store.name }}
            </p>
            <p class="text-sm text-muted truncate">
              {{ store.slug }}
            </p>
          </div>
          <UBadge :color="statusColor[store.status]" variant="subtle">
            {{ store.status }}
          </UBadge>
        </div>
      </UCard>
    </div>
  </div>
</template>
