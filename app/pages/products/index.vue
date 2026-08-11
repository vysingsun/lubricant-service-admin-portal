<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { storeId } = useCurrentStore()
const { data: products, isLoading } = useProductsQuery(storeId)
const deleteMutation = useDeleteProductMutation(storeId)

async function onDelete(id: string) {
  await deleteMutation.mutateAsync(id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        {{ t('products.title') }}
      </h1>
      <UButton
        icon="i-lucide-plus"
        to="/products/create"
      >
        {{ t('products.create') }}
      </UButton>
    </div>

    <div
      v-if="isLoading"
      class="text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <UAlert
      v-else-if="!products?.length"
      icon="i-lucide-package"
      color="neutral"
      variant="soft"
      :title="t('products.empty')"
    />

    <ProductTable
      v-else
      :products="products"
      @delete="onDelete"
    />
  </div>
</template>
