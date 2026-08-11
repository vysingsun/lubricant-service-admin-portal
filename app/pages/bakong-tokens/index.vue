<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'operator']
})

const { t } = useI18n()
const { data: tokens, isLoading } = useBakongTokensQuery()
const deleteMutation = useDeleteBakongTokenMutation()
const renewMutation = useRenewBakongTokenMutation()

async function onDelete(id: string) {
  await deleteMutation.mutateAsync(id)
}

async function onRenew(id: string) {
  await renewMutation.mutateAsync(id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        {{ t('bakongTokens.title') }}
      </h1>
      <UButton
        icon="i-lucide-plus"
        to="/bakong-tokens/create"
      >
        {{ t('bakongTokens.create') }}
      </UButton>
    </div>

    <div
      v-if="isLoading"
      class="text-muted"
    >
      {{ t('common.loading') }}
    </div>

    <UAlert
      v-else-if="!tokens?.length"
      icon="i-lucide-key-round"
      color="neutral"
      variant="soft"
      :title="t('bakongTokens.empty')"
    />

    <BakongTokenTable
      v-else
      :tokens="tokens"
      @delete="onDelete"
      @renew="onRenew"
    />
  </div>
</template>
