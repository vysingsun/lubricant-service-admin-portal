<script setup lang="ts">
const { t } = useI18n()
const { logout, user } = useAuth()

const links = computed(() => {
  const base = [
    { label: t('nav.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
    { label: t('nav.storeSettings'), to: '/stores', icon: 'i-lucide-store' },
    { label: t('nav.products'), to: '/products', icon: 'i-lucide-package' },
    { label: t('nav.staff'), to: '/staff', icon: 'i-lucide-users' },
    { label: t('nav.orders'), to: '/orders', icon: 'i-lucide-receipt' }
  ]

  if (user.value?.role === 'Operator' || user.value?.role === 'Super_Admin') {
    base.push({ label: t('nav.bakongTokens'), to: '/bakong-tokens', icon: 'i-lucide-key-round' })
  }

  return base
})

async function onLogout() {
  logout()
  await navigateTo('/login')
}
</script>

<template>
  <div class="flex flex-col h-full w-64 shrink-0 border-r border-default p-4 gap-6">
    <div class="flex items-center gap-2 px-2">
      <UIcon
        name="i-lucide-droplet"
        class="size-6 text-primary"
      />
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
