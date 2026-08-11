<script setup lang="ts">
import type { Product } from '../queries/products.queries'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <UTable
    :data="products"
    :columns="[
      { accessorKey: 'name', header: t('products.name') },
      { accessorKey: 'brand', header: t('products.brand') },
      { accessorKey: 'status', header: t('products.status') },
      { accessorKey: 'actions', header: '' }
    ]"
  >
    <template #status-cell="{ row }">
      <UBadge
        :color="row.original.status === 'active' ? 'success' : 'neutral'"
        variant="subtle"
      >
        {{ row.original.status }}
      </UBadge>
    </template>
    <template #actions-cell="{ row }">
      <div class="flex justify-end gap-2">
        <UButton
          size="xs"
          variant="ghost"
          icon="i-lucide-pencil"
          :to="`/products/${row.original.id}/edit`"
        />
        <UButton
          size="xs"
          variant="ghost"
          color="error"
          icon="i-lucide-trash"
          @click="emit('delete', row.original.id)"
        />
      </div>
    </template>
  </UTable>
</template>
