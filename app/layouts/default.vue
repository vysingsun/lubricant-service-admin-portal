<script setup lang="ts">
const { t } = useI18n()
const mobileMenuOpen = ref(false)

const route = useRoute()
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})
</script>

<template>
  <div class="flex h-screen">
    <div class="hidden lg:block h-full w-64 shrink-0 border-r border-default">
      <AppSidebar />
    </div>

    <USlideover
      v-model:open="mobileMenuOpen"
      side="left"
    >
      <template #content>
        <AppSidebar @navigate="mobileMenuOpen = false" />
      </template>
    </USlideover>

    <div class="flex flex-col flex-1 min-w-0">
      <header class="flex items-center justify-between gap-2 border-b border-default px-4 sm:px-6 py-3">
        <div class="flex items-center gap-1 min-w-0">
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
            class="lg:hidden shrink-0"
            :aria-label="t('nav.menu')"
            @click="mobileMenuOpen = true"
          />
          <StoreSwitcher class="min-w-0" />
        </div>
        <LanguageSwitcher />
      </header>

      <main class="flex-1 overflow-y-auto p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
