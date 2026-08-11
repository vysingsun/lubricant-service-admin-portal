<script setup lang="ts">
import type { Order } from '../queries/orders.queries'

defineProps<{
  orders: Order[]
}>()

const { t } = useI18n()

const statusColor: Record<Order['status'], 'neutral' | 'warning' | 'success' | 'error'> = {
  pending: 'warning',
  confirmed: 'neutral',
  fulfilled: 'success',
  cancelled: 'error'
}
</script>

<template>
  <UTable
    :data="orders"
    :columns="[
      { accessorKey: 'id', header: 'Order' },
      { accessorKey: 'total', header: t('orders.total') },
      { accessorKey: 'status', header: t('orders.status') },
      { accessorKey: 'placedOn', header: t('orders.placedOn') }
    ]"
  >
    <template #id-cell="{ row }">
      <span class="font-mono text-xs">{{ row.original.id.slice(0, 8) }}</span>
    </template>
    <template #total-cell="{ row }">
      {{ formatCurrency(row.original.totalAmount) }}
    </template>
    <template #status-cell="{ row }">
      <UBadge
        :color="statusColor[row.original.status]"
        variant="subtle"
      >
        {{ row.original.status }}
      </UBadge>
    </template>
    <template #placedOn-cell="{ row }">
      {{ new Date(row.original.createdAt).toLocaleDateString() }}
    </template>
  </UTable>
</template>
