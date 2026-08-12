<script setup lang="ts">
const { t } = useI18n()
const { logout, user } = useAuth()

const emit = defineEmits<{
  navigate: []
}>()

const links = computed(() => {
  const base = [
    { label: t('nav.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
    { label: t('nav.storeSettings'), to: '/stores', icon: 'i-lucide-store' },
    { label: t('nav.products'), to: '/products', icon: 'i-lucide-package' },
    { label: t('nav.staff'), to: '/staff', icon: 'i-lucide-users' },
    { label: t('nav.orders'), to: '/orders', icon: 'i-lucide-receipt' }
  ]

  if (user.value?.role === 'Operator') {
    base.push({ label: t('nav.bakongTokens'), to: '/bakong-tokens', icon: 'i-lucide-key-round' })
  }

  return base
})

async function onLogout() {
  logout()
  emit('navigate')
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex flex-col h-full w-full shrink-0 p-4 gap-6">
    <div class="flex items-center gap-2 px-2">
      <img
        src="/kotpreng.svg"
        :alt="t('app.name')"
        class="size-6"
      >
      <span class="font-semibold">{{ t('app.name') }}</span>
    </div>

    <nav class="flex flex-col gap-1">
      <UButton
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :icon="link.icon"
        color="neutral"
        variant="ghost"
        class="justify-start"
        active-class="bg-primary/10 text-primary"
        @click="emit('navigate')"
      >
        {{ link.label }}
      </UButton>
    </nav>

    <UButton
      icon="i-lucide-log-out"
      color="neutral"
      variant="ghost"
      class="justify-start mt-auto"
      @click="onLogout"
    >
      {{ t('nav.logout') }}
    </UButton>
  </div>
</template>
