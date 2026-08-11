<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const items = computed(() =>
  (locales.value as { code: string, name?: string }[]).map(l => ({
    label: l.name ?? l.code,
    onSelect: () => setLocale(l.code as 'en' | 'km')
  }))
)

const currentLabel = computed(() =>
  (locales.value as { code: string, name?: string }[]).find(l => l.code === locale.value)?.name ?? locale.value
)
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-languages"
      :label="currentLabel"
      trailing-icon="i-lucide-chevron-down"
    />
  </UDropdownMenu>
</template>
