<script setup lang="ts">
const { storeId, stores, setStoreId } = useCurrentStore()

const items = computed(() =>
  (stores.value ?? []).map(store => ({
    label: store.name,
    onSelect: () => setStoreId(store.id)
  }))
)

const currentLabel = computed(() =>
  stores.value?.find(s => s.id === storeId.value)?.name ?? '—'
)
</script>

<template>
  <UDropdownMenu
    v-if="stores?.length"
    :items="items"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-store"
      :label="currentLabel"
      trailing-icon="i-lucide-chevron-down"
    />
  </UDropdownMenu>
</template>
