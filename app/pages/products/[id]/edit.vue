<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const route = useRoute()
const { storeId } = useCurrentStore()
const productId = computed(() => route.params.id as string)
const { data: product, isLoading } = useProductQuery(storeId, productId)
</script>

<template>
  <div class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      {{ t('products.edit') }}
    </h1>

    <div
      v-if="isLoading"
      class="text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <ProductForm
      v-else-if="product"
      :product="product"
    />
  </div>
</template>
