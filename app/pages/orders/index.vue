<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { storeId } = useCurrentStore()
const { data: orders, isLoading } = useStoreOrdersQuery(storeId)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      {{ t('orders.title') }}
    </h1>

    <div
      v-if="isLoading"
      class="text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <UAlert
      v-else-if="!orders?.length"
      icon="i-lucide-receipt"
      color="neutral"
      variant="soft"
      :title="t('orders.empty')"
    />

    <OrdersTable
      v-else
      :orders="orders"
    />
  </div>
</template>
