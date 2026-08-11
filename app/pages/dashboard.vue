<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const { user } = useAuth()
const { storeId, stores } = useCurrentStore()

const currentStore = computed(() => stores.value?.find(s => s.id === storeId.value))
</script>

<template>
  <div class="flex flex-col gap-6">
    <div>
      <h1 class="text-2xl font-semibold">
        {{ t('dashboard.title') }}
      </h1>
      <p class="text-muted">
        {{ t('dashboard.welcome') }}
      </p>
    </div>

    <UCard v-if="currentStore">
      <div class="flex items-center gap-4">
        <UAvatar
          :src="currentStore.logoUrl ?? undefined"
          :alt="currentStore.name"
          size="lg"
        />
        <div>
          <p class="font-medium">
            {{ currentStore.name }}
          </p>
          <p class="text-sm text-muted">
            {{ currentStore.slug }}
          </p>
        </div>
        <UBadge
          class="ml-auto"
          :color="currentStore.status === 'active' ? 'success' : 'neutral'"
          variant="subtle"
        >
          {{ currentStore.status }}
        </UBadge>
        <UButton
          :to="`/stores/${currentStore.id}/edit`"
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
        />
      </div>
    </UCard>

    <UAlert
      v-else-if="stores && stores.length === 0"
      icon="i-lucide-info"
      color="neutral"
      variant="soft"
      :title="t('storeSettings.emptyTitle')"
      :description="t('storeSettings.emptyDescription')"
    >
      <template #actions>
        <UButton
          to="/stores/create"
          size="xs"
        >
          {{ t('storeSettings.create') }}
        </UButton>
      </template>
    </UAlert>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <UCard :to="`/products`">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-package"
            class="size-6 text-primary"
          />
          <span class="font-medium">{{ t('nav.products') }}</span>
        </div>
      </UCard>
      <UCard :to="`/staff`">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-users"
            class="size-6 text-primary"
          />
          <span class="font-medium">{{ t('nav.staff') }}</span>
        </div>
      </UCard>
      <UCard :to="`/orders`">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-receipt"
            class="size-6 text-primary"
          />
          <span class="font-medium">{{ t('nav.orders') }}</span>
        </div>
      </UCard>
    </div>

    <p
      v-if="user"
      class="text-xs text-muted"
    >
      Signed in as {{ user.userId }} ({{ user.role }})
    </p>
  </div>
</template>
